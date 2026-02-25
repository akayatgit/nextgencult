# Telegram Webhook Setup & Tracking Guide

## Current Status
Your webhook is **NOT SET** (URL is empty). Follow these steps to set it up.

## Step 1: Set the Webhook

### Option A: Using curl (Quick)
```bash
curl -X POST "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DOMAIN.com/api/telegram-webhook"}'
```

**Replace `YOUR_DOMAIN.com` with your actual domain!**

### Option B: Using Browser
Visit this URL (replace YOUR_DOMAIN):
```
https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/setWebhook?url=https://YOUR_DOMAIN.com/api/telegram-webhook
```

### Option C: Using the script
```bash
# Edit scripts/set-webhook.sh and replace YOUR_DOMAIN
bash scripts/set-webhook.sh
```

## Step 2: Verify Webhook is Set

```bash
curl "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/getWebhookInfo"
```

Expected response:
```json
{
  "ok": true,
  "result": {
    "url": "https://yourdomain.com/api/telegram-webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

## Step 3: Test the Webhook

1. **Send a message to your bot** (e.g., `/start`)
2. **Check your server logs** (Vercel logs or local console)
3. You should see:
   ```
   ============================================================
   📨 TELEGRAM WEBHOOK UPDATE RECEIVED
   Time: 2024-01-01T12:00:00.000Z
   Update ID: 123456789
   Type: Message
   Chat ID: 123456789
   Text: /start
   ...
   ============================================================
   ```

## Step 4: Track Webhook Updates

### Method 1: Server Logs (Vercel)
1. Go to your Vercel project
2. Click on "Logs" tab
3. Filter by "telegram-webhook"
4. You'll see all incoming updates

### Method 2: Test Endpoint
Use the test endpoint to see raw updates:
```bash
# First, set webhook to test endpoint temporarily
curl -X POST "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DOMAIN.com/api/telegram-webhook-test"}'

# Then send a message to bot and check logs
# After testing, set it back to the main webhook
```

### Method 3: Get Pending Updates
If webhook wasn't set, you can get pending updates:
```bash
curl "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/getUpdates"
```

## Troubleshooting

### Issue: Webhook URL returns 404
- Make sure your app is deployed
- Check the URL is correct (HTTPS required)
- Verify the route exists: `/api/telegram-webhook`

### Issue: Webhook URL returns 500
- Check server logs for errors
- Verify `TELEGRAM_BOT_TOKEN` is set
- Check database connection

### Issue: No updates received
- Verify webhook is set: `getWebhookInfo`
- Check if URL is accessible
- Make sure you're sending messages to the correct bot
- Check `pending_update_count` - if > 0, there are pending updates

### Issue: Updates received but no response
- Check server logs for processing messages
- Verify message sending is working
- Check if there are errors in the logs

## Quick Commands Reference

```bash
# Set webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/api/telegram-webhook"}'

# Get webhook info
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Delete webhook (for testing)
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"

# Get pending updates
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"

# Test bot token
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

## Monitoring Webhook Health

The webhook handler now logs:
- ✅ All incoming updates
- ✅ Message processing
- ✅ Message sending attempts
- ✅ Errors with details

Check your logs regularly to ensure the bot is working!
