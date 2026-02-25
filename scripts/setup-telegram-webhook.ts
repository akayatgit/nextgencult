/**
 * Setup script to configure Telegram webhook
 * Run this once after deploying your bot:
 * 
 * npx tsx scripts/setup-telegram-webhook.ts
 * 
 * Or use curl:
 * curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
 *   -H "Content-Type: application/json" \
 *   -d '{"url": "https://yourdomain.com/api/telegram-webhook"}'
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || "https://yourdomain.com/api/telegram-webhook";

if (!TELEGRAM_BOT_TOKEN) {
  console.error("Error: TELEGRAM_BOT_TOKEN environment variable is not set");
  process.exit(1);
}

async function setWebhook() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log("✅ Webhook set successfully!");
      console.log(`URL: ${WEBHOOK_URL}`);
    } else {
      console.error("❌ Failed to set webhook:", data.description);
    }
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
}

setWebhook();
