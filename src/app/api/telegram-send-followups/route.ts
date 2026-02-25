import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessageWithKeyboard } from "@/lib/telegram";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional: secure with a secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Users who enrolled at least 2 minutes ago and haven't received followup yet
    const { data: users, error } = await supabase
      .from("telegram_bot_users")
      .select("*")
      .eq("is_active", true)
      .eq("welcome_followup_sent", false)
      .lte(
        "enrolled_at",
        new Date(Date.now() - 2 * 60 * 1000).toISOString()
      );

    if (error) {
      console.error("Error fetching users for followups:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users pending followup" });
    }

    const results = await Promise.allSettled(
      users.map(async (user: any) => {
        const keyboard = [
          [
            {
              text: "✅ I started!",
              callback_data: `welcome_followup:started`,
            },
          ],
          [
            {
              text: "😓 It's hard",
              callback_data: `welcome_followup:hard`,
            },
          ],
          [
            {
              text: "⏰ No time, remind me tomorrow",
              callback_data: `welcome_followup:tomorrow`,
            },
          ],
        ];

        await sendTelegramMessageWithKeyboard(
          user.chat_id,
          "🧠 <b>Quick check-in!</b>\n\nDid you get a chance to start Day 1?\n\nIf something is stopping you, tell me so I can help:",
          keyboard
        );

        await supabase
          .from("telegram_bot_users")
          .update({ welcome_followup_sent: true })
          .eq("chat_id", user.chat_id);
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      message: `Processed ${users.length} users for followup`,
      successful,
      failed,
    });
  } catch (error) {
    console.error("Error in send-followups endpoint:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

