import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessageWithKeyboard } from "@/lib/telegram";

export async function GET(request: Request) {
  try {
    // This endpoint should be called in the evening (e.g., 8 PM)
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
          await sendCompletionReminder(user);
        } catch (error) {
          console.error(`Error sending evening reminder to user ${user.chat_id}:`, error);
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
    console.error("Error in send-evening endpoint:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function sendCompletionReminder(user: any) {
  const today = new Date();
  const startDate = new Date(user.start_date);
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentDay = daysSinceStart + 1;

  // Check if already completed today
  const { data: progress } = await supabase
    .from("telegram_bot_progress")
    .select("*")
    .eq("chat_id", user.chat_id)
    .eq("roadmap_id", user.roadmap_id)
    .eq("day", currentDay)
    .eq("task_type", "day_complete")
    .eq("completed", true)
    .single();

  if (progress) {
    // Already completed, skip
    return;
  }

  const keyboard = [
    [
      {
        text: "✅ Yes, I completed it!",
        callback_data: `complete_day:${user.roadmap_id}:${currentDay}`,
      },
    ],
    [
      {
        text: "⏰ Remind me later",
        callback_data: `remind_later:${user.roadmap_id}:${currentDay}`,
      },
    ],
  ];

  await sendTelegramMessageWithKeyboard(
    user.chat_id,
    `🌙 <b>End of Day ${currentDay}</b>\n\nDid you complete today's tasks?`,
    keyboard
  );
}
