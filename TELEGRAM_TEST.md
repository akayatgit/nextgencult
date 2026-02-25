# Telegram Bot Testing Guide

## ✅ Webhook Status: SET
Your webhook is correctly configured:
- **URL**: `https://nextgencult.com/api/telegram-webhook`
- **Pending Updates**: 0 (good!)
- **IP Address**: 216.198.79.1

## Test the Bot

### Step 1: Send a message to your bot
1. Open Telegram
2. Search for `@ngcult_bot`
3. Click "Start" or send `/start`

### Step 2: Check Server Logs
Go to your Vercel dashboard → Your Project → Logs

You should see logs like:
```
============================================================
📨 TELEGRAM WEBHOOK UPDATE RECEIVED
Time: 2024-01-01T12:00:00.000Z
Update ID: 123456789
Type: Message
Chat ID: 123456789
Text: /start
From: YourName username
============================================================
```

### Step 3: Expected Bot Response
The bot should respond with:
- A welcome message showing available roadmaps
- Or a roadmap list with buttons to select

## Quick Test Commands

### Test /start command
Send to bot: `/start`
Expected: Shows roadmap list

### Test /list command
Send to bot: `/list`
Expected: Shows all available roadmaps

### Test /help command
Send to bot: `/help`
Expected: Shows help message with commands

### Test /status command
Send to bot: `/status`
Expected: Shows your progress (if you've selected a roadmap)

## Troubleshooting

### If bot doesn't respond:
1. **Check Vercel logs** - Look for errors
2. **Check environment variables** - Make sure `TELEGRAM_BOT_TOKEN` is set
3. **Check database** - Make sure Supabase tables exist
4. **Check webhook** - Verify it's still set: 
   ```bash
   curl "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/getWebhookInfo"
   ```

### If you see errors in logs:
- **"TELEGRAM_BOT_TOKEN is not set"** → Add it to Vercel Environment Variables
- **Database errors** → Check Supabase connection and table existence
- **"Error sending Telegram message"** → Check bot token is correct

## Monitor Webhook Health

### Check for pending updates:
```bash
curl "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/getWebhookInfo"
```

If `pending_update_count` > 0, there are updates waiting to be processed.

### Get recent updates manually:
```bash
curl "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/getUpdates"
```

## Next Steps

1. ✅ Webhook is set
2. ⏳ Test by sending `/start` to the bot
3. ⏳ Check logs to see if updates are received
4. ⏳ Verify bot responds correctly
5. ⏳ Test roadmap selection
6. ⏳ Test daily reminders (wait for cron job or trigger manually)

## Manual Daily Reminder Test

To test daily reminders without waiting:
```bash
curl "https://nextgencult.com/api/telegram-send-daily"
```

This will send reminders to all active users immediately.
