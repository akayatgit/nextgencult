import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage, sendTelegramMessageWithKeyboard } from "@/lib/telegram";

export async function GET(request: Request) {
  try {
    // This endpoint can be called by a cron job or manually
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Add authentication for cron jobs
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from("telegram_bot_users")
      .select("*")
      .eq("is_active", true);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No active users found" });
    }

    const results = await Promise.allSettled(
      users.map(async (user) => {
        try {
          await sendDailyReminder(user);
        } catch (error) {
          console.error(`Error sending reminder to user ${user.chat_id}:`, error);
          throw error;
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      message: `Processed ${users.length} users`,
      successful,
      failed,
    });
  } catch (error) {
    console.error("Error in send-daily endpoint:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function sendDailyReminder(user: any) {
  const today = new Date();
  const startDate = new Date(user.start_date);
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentDay = daysSinceStart + 1;

  // Skip Day 1 here because it's sent immediately on enrollment
  if (daysSinceStart <= 0) {
    return;
  }

  // Update user's current day
  await supabase
    .from("telegram_bot_users")
    .update({ current_day: currentDay })
    .eq("chat_id", user.chat_id);

  let dayData: any = null;

  if (user.roadmap_type === "custom") {
    // Fetch custom roadmap day
    const { data: template } = await supabase
      .from("custom_roadmap_templates")
      .select("data")
      .eq("id", user.roadmap_id)
      .single();

    if (template && template.data?.days) {
      dayData = template.data.days.find((d: any) => d.day === currentDay);
    }
  } else {
    // Fetch standard roadmap day (if you have a similar structure)
    // For now, we'll handle custom roadmaps primarily
    return;
  }

  if (!dayData) {
    await sendTelegramMessage(
      user.chat_id,
      `🎉 Congratulations! You've completed all days in your roadmap! 🚀\n\nUse /list to select a new roadmap.`
    );
    await supabase
      .from("telegram_bot_users")
      .update({ is_active: false })
      .eq("chat_id", user.chat_id);
    return;
  }

  // Format the daily message
  let message = `📅 <b>Day ${currentDay}</b>\n\n`;

  // Add main task
  if (dayData.newTopic) {
    message += `✅ <b>Task:</b> ${dayData.newTopic}\n`;
  }

  // Add description if available
  if (dayData.tasks && dayData.tasks[0] && dayData.tasks[0].description) {
    // Strip HTML tags for Telegram (basic)
    const description = dayData.tasks[0].description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (description) {
      message += `\n📝 <b>Description:</b>\n${description}\n`;
    }
  }

  // Add subtasks
  if (dayData.review1 || dayData.review2) {
    message += `\n📋 <b>Subtasks:</b>\n`;
    if (dayData.review1) {
      message += `  • ${dayData.review1}\n`;
    }
    if (dayData.review2) {
      message += `  • ${dayData.review2}\n`;
    }
  }

  // Add YouTube videos
  if (dayData.youtubeVideos && dayData.youtubeVideos.length > 0) {
    message += `\n🎥 <b>Videos:</b>\n`;
    dayData.youtubeVideos.forEach((video: any) => {
      if (video.url) {
        message += `  • <a href="${video.url}">${video.title || "Watch Video"}</a>\n`;
      }
    });
  }

  // Add links
  if (dayData.links && dayData.links.length > 0) {
    message += `\n🔗 <b>Links:</b>\n`;
    dayData.links.forEach((link: any) => {
      if (link.url) {
        message += `  • <a href="${link.url}">${link.title || "Open Link"}</a>\n`;
      }
    });
  }

  message += `\n💪 Good luck with today's tasks!`;

  // Send morning reminder
  await sendTelegramMessage(user.chat_id, message);
}

async function sendCompletionReminder(chatId: number, roadmapId: string, day: number) {
  const keyboard = [
    [
      {
        text: "✅ Yes, I completed it!",
        callback_data: `complete_day:${roadmapId}:${day}`,
      },
    ],
    [
      {
        text: "⏰ Remind me later",
        callback_data: `remind_later:${roadmapId}:${day}`,
      },
    ],
  ];

  await sendTelegramMessageWithKeyboard(
    chatId,
    `🌙 <b>End of Day ${day}</b>\n\nDid you complete today's tasks?`,
    keyboard
  );
}
