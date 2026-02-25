import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  sendTelegramMessage,
  sendTelegramMessageWithKeyboard,
  editTelegramMessage,
  answerCallbackQuery,
  TelegramUpdate,
} from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    // Check if bot token is set
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is not set!");
      return NextResponse.json({ ok: false, error: "Bot token not configured" }, { status: 500 });
    }

    const update: TelegramUpdate = await request.json();
    
    // Enhanced logging for tracking
    console.log("=".repeat(60));
    console.log("📨 TELEGRAM WEBHOOK UPDATE RECEIVED");
    console.log("Time:", new Date().toISOString());
    console.log("Update ID:", update.update_id);
    
    if (update.message) {
      console.log("Type: Message");
      console.log("Chat ID:", update.message.chat.id);
      console.log("Text:", update.message.text);
      console.log("From:", update.message.from.first_name, update.message.from.username || "");
    }
    
    if (update.callback_query) {
      console.log("Type: Callback Query");
      console.log("Chat ID:", update.callback_query.from.id);
      console.log("Data:", update.callback_query.data);
    }
    
    console.log("Full Update:", JSON.stringify(update, null, 2));
    console.log("=".repeat(60));

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { callback_query } = update;
      const chatId = callback_query.from.id;
      const data = callback_query.data;
      const messageId = callback_query.message?.message_id;

      // Answer the callback query first
      await answerCallbackQuery(callback_query.id);

      // Handle different callback actions
      if (data.startsWith("select_roadmap:")) {
        const roadmapId = data.split(":")[1];
        const roadmapType = data.split(":")[2] || "custom";

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("telegram_bot_users")
          .select("*")
          .eq("chat_id", chatId)
          .single();

        if (existingUser) {
          // Update existing user
          await supabase
            .from("telegram_bot_users")
            .update({
              roadmap_id: roadmapId,
              roadmap_type: roadmapType,
              start_date: new Date().toISOString().split("T")[0],
              current_day: 1,
              is_active: true,
            })
            .eq("chat_id", chatId);
        } else {
          // Create new user
          await supabase.from("telegram_bot_users").insert([
            {
              chat_id: chatId,
              username: callback_query.from.username,
              first_name: callback_query.from.first_name,
              roadmap_id: roadmapId,
              roadmap_type: roadmapType,
              start_date: new Date().toISOString().split("T")[0],
              current_day: 1,
              is_active: true,
            },
          ]);
        }

        await sendTelegramMessage(
          chatId,
          `✅ Great! You've selected a roadmap. I'll send you daily reminders starting tomorrow.\n\nUse /start to see your current roadmap or /list to see all available roadmaps.`
        );
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("complete_day:")) {
        const [_, roadmapId, day] = data.split(":");

        // Mark day as complete
        await supabase.from("telegram_bot_progress").upsert(
          {
            chat_id: chatId,
            roadmap_id: roadmapId,
            day: parseInt(day),
            task_type: "day_complete",
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "chat_id,roadmap_id,day,task_type" }
        );

        // Also mark all tasks for that day as complete
        const { data: user } = await supabase
          .from("telegram_bot_users")
          .select("*")
          .eq("chat_id", chatId)
          .single();

        if (user) {
          // Fetch day data to get all tasks
          if (user.roadmap_type === "custom") {
            const { data: template } = await supabase
              .from("custom_roadmap_templates")
              .select("data")
              .eq("id", roadmapId)
              .single();

            if (template && template.data?.days) {
              const dayData = template.data.days.find((d: any) => d.day === parseInt(day));
              if (dayData) {
                // Mark main task
                await supabase.from("telegram_bot_progress").upsert(
                  {
                    chat_id: chatId,
                    roadmap_id: roadmapId,
                    day: parseInt(day),
                    task_type: "new",
                    completed: true,
                    completed_at: new Date().toISOString(),
                  },
                  { onConflict: "chat_id,roadmap_id,day,task_type" }
                );

                // Mark review tasks
                if (dayData.review1) {
                  await supabase.from("telegram_bot_progress").upsert(
                    {
                      chat_id: chatId,
                      roadmap_id: roadmapId,
                      day: parseInt(day),
                      task_type: "review1",
                      completed: true,
                      completed_at: new Date().toISOString(),
                    },
                    { onConflict: "chat_id,roadmap_id,day,task_type" }
                  );
                }
                if (dayData.review2) {
                  await supabase.from("telegram_bot_progress").upsert(
                    {
                      chat_id: chatId,
                      roadmap_id: roadmapId,
                      day: parseInt(day),
                      task_type: "review2",
                      completed: true,
                      completed_at: new Date().toISOString(),
                    },
                    { onConflict: "chat_id,roadmap_id,day,task_type" }
                  );
                }
              }
            }
          }
        }

        if (messageId) {
          await editTelegramMessage(
            chatId,
            messageId,
            `✅ Day ${day} marked as complete! Great job! 🎉\n\nI'll send you the next day's tasks tomorrow.`
          );
        }

        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("remind_later:")) {
        // User wants to be reminded later, we'll send another reminder in a few hours
        // For now, just acknowledge
        if (messageId) {
          await editTelegramMessage(
            chatId,
            messageId,
            `⏰ No problem! I'll remind you again later. Keep up the great work! 💪`
          );
        }
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    }

    // Handle regular messages
    if (update.message) {
      const { message } = update;
      const chatId = message.chat.id;
      const text = message.text || "";
      const command = text.split(" ")[0];

      console.log(`Processing message from chat ${chatId}: ${text}`);

      // Handle /start command
      if (command === "/start") {
        console.log("Handling /start command");
        const startParam = text.split(" ")[1]; // Deep link parameter

        if (startParam) {
          // User came from deep link, select that roadmap
          const roadmapId = startParam;
          const { data: existingUser } = await supabase
            .from("telegram_bot_users")
            .select("*")
            .eq("chat_id", chatId)
            .single();

          if (existingUser) {
            await supabase
              .from("telegram_bot_users")
              .update({
                roadmap_id: roadmapId,
                roadmap_type: "custom",
                start_date: new Date().toISOString().split("T")[0],
                current_day: 1,
                is_active: true,
              })
              .eq("chat_id", chatId);
          } else {
            await supabase.from("telegram_bot_users").insert([
              {
                chat_id: chatId,
                username: message.from.username,
                first_name: message.from.first_name,
                last_name: message.from.last_name,
                roadmap_id: roadmapId,
                roadmap_type: "custom",
                start_date: new Date().toISOString().split("T")[0],
                current_day: 1,
                is_active: true,
              },
            ]);
          }

          await sendTelegramMessage(
            chatId,
            `✅ Welcome! You've been enrolled in the roadmap. I'll send you daily reminders starting tomorrow.\n\nUse /list to see all available roadmaps.`
          );
        } else {
          // Show roadmap list
          console.log("Showing roadmap list");
          await handleListCommand(chatId);
        }
        return NextResponse.json({ ok: true });
      }

      // If no command matched, send a default welcome message
      if (!text.startsWith("/")) {
        console.log("Unknown message, sending help");
        await sendTelegramMessage(
          chatId,
          `👋 Hi! I'm the NG Cult Learning Bot.\n\n` +
            `Use /start to see available roadmaps\n` +
            `Use /list to see all roadmaps\n` +
            `Use /help for more commands`
        );
        return NextResponse.json({ ok: true });
      }

      // Handle /list command
      if (command === "/list") {
        await handleListCommand(chatId);
        return NextResponse.json({ ok: true });
      }

      // Handle /status command
      if (command === "/status") {
        await handleStatusCommand(chatId);
        return NextResponse.json({ ok: true });
      }

      // Handle /help command
      if (command === "/help") {
        await sendTelegramMessage(
          chatId,
          `📚 <b>NG Cult Bot Commands:</b>\n\n` +
            `/start - Start the bot and see available roadmaps\n` +
            `/list - Show all available roadmaps\n` +
            `/status - Check your current progress\n` +
            `/help - Show this help message\n\n` +
            `The bot will send you daily reminders with tasks, videos, and links. Complete your tasks and mark them done! 🚀`
        );
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

async function handleListCommand(chatId: number) {
  try {
    // Fetch custom roadmaps
    const { data: customRoadmaps } = await supabase
      .from("custom_roadmap_templates")
      .select("id, title")
      .order("created_at", { ascending: false })
      .limit(20);

    // Fetch standard roadmaps
    const { data: standardRoadmaps } = await supabase
      .from("roadmaps")
      .select("id, title")
      .eq("is_active", true)
      .order("rank", { ascending: true })
      .limit(20);

    const allRoadmaps: Array<{ id: string; title: string; type: string }> = [];

    if (customRoadmaps) {
      customRoadmaps.forEach((r) => {
        allRoadmaps.push({ id: r.id, title: r.title, type: "custom" });
      });
    }

    if (standardRoadmaps) {
      standardRoadmaps.forEach((r) => {
        allRoadmaps.push({ id: r.id.toString(), title: r.title, type: "standard" });
      });
    }

    if (allRoadmaps.length === 0) {
      await sendTelegramMessage(chatId, "No roadmaps available at the moment.");
      return;
    }

    // Create keyboard with roadmap options
    const keyboard = allRoadmaps.map((roadmap) => [
      {
        text: `${roadmap.type === "custom" ? "📝" : "📚"} ${roadmap.title}`,
        callback_data: `select_roadmap:${roadmap.id}:${roadmap.type}`,
      },
    ]);

    await sendTelegramMessageWithKeyboard(
      chatId,
      "📚 <b>Available Roadmaps:</b>\n\nSelect a roadmap to get started:",
      keyboard
    );
  } catch (error) {
    console.error("Error handling list command:", error);
    await sendTelegramMessage(chatId, "Error fetching roadmaps. Please try again later.");
  }
}

async function handleStatusCommand(chatId: number) {
  try {
    const { data: user } = await supabase
      .from("telegram_bot_users")
      .select("*")
      .eq("chat_id", chatId)
      .single();

    if (!user) {
      await sendTelegramMessage(
        chatId,
        "You haven't selected a roadmap yet. Use /list to see available roadmaps."
      );
      return;
    }

    // Calculate days since start
    const startDate = new Date(user.start_date);
    const today = new Date();
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedDay = daysSinceStart + 1;

    // Get progress for current day
    const { data: progress } = await supabase
      .from("telegram_bot_progress")
      .select("*")
      .eq("chat_id", chatId)
      .eq("roadmap_id", user.roadmap_id)
      .eq("day", user.current_day);

    const completedTasks = progress?.filter((p) => p.completed).length || 0;
    const totalTasks = progress?.length || 0;

    await sendTelegramMessage(
      chatId,
      `📊 <b>Your Progress:</b>\n\n` +
        `Roadmap: ${user.roadmap_id}\n` +
        `Current Day: ${user.current_day}\n` +
        `Started: ${startDate.toLocaleDateString()}\n` +
        `Progress: ${completedTasks}/${totalTasks} tasks completed\n\n` +
        `Keep going! 💪`
    );
  } catch (error) {
    console.error("Error handling status command:", error);
    await sendTelegramMessage(chatId, "Error fetching your status. Please try again later.");
  }
}
