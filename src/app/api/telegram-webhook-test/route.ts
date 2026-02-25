import { NextResponse } from "next/server";

/**
 * Test endpoint to see if webhook is receiving updates
 * This endpoint just logs the update and returns it
 * Useful for debugging webhook setup
 */
export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    console.log("=".repeat(50));
    console.log("WEBHOOK TEST - Received Update:");
    console.log(JSON.stringify(update, null, 2));
    console.log("=".repeat(50));
    
    // Log to a file or database if needed
    // For now, just return it
    
    return NextResponse.json({
      ok: true,
      message: "Webhook test - update received",
      update: update,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in webhook test:", error);
    return NextResponse.json({
      ok: false,
      error: String(error),
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: "Telegram webhook test endpoint",
    usage: "POST updates to this endpoint to test webhook",
    webhook_url: "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram-webhook",
  });
}
