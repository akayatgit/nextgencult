# Telegram Bot Debugging Guide

## Issue: Bot not responding after /start

### Step 1: Check Environment Variables
Make sure `TELEGRAM_BOT_TOKEN` is set in your environment:
```bash
# Check if it's set
echo $TELEGRAM_BOT_TOKEN

# Or in Vercel, check Environment Variables in dashboard
```

### Step 2: Verify Webhook is Set
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Expected response should show:
- `url`: Your webhook URL
- `pending_update_count`: Should be 0 or low number
- `last_error_date`: Should be null or recent timestamp

### Step 3: Check Webhook URL is Accessible
```bash
# Test if your webhook endpoint is accessible
curl -X POST "https://yourdomain.com/api/telegram-webhook" \
  -H "Content-Type: application/json" \
  -d '{"update_id": 1, "message": {"message_id": 1, "from": {"id": 123, "is_bot": false, "first_name": "Test"}, "chat": {"id": 123, "type": "private"}, "date": 1234567890, "text": "/start"}}'
```

### Step 4: Check Server Logs
Look at your Vercel/Next.js logs for:
- "Received Telegram update" - confirms webhook is receiving updates
- "Processing message from chat X" - confirms message is being processed
- "Sending message to chat X" - confirms message is being sent
- Any error messages

### Step 5: Test Bot Token Manually
```bash
# Test if bot token works
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```

Should return bot info if token is valid.

### Step 6: Check Database Tables Exist
Make sure you've run the SQL schema:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('telegram_bot_users', 'telegram_bot_progress');
```

### Common Issues:

1. **Missing TELEGRAM_BOT_TOKEN**
   - Add it to `.env.local` for local development
   - Add it to Vercel Environment Variables for production

2. **Webhook not set**
   - Run: `curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram-webhook"`

3. **Webhook URL not accessible**
   - Make sure your domain is deployed and accessible
   - Check if HTTPS is working

4. **Database connection issues**
   - Verify Supabase credentials are correct
   - Check if tables exist

5. **Silent failures**
   - Check server logs (Vercel logs or local console)
   - The updated code now logs more information

### Quick Test Commands:

```bash
# 1. Check webhook info
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# 2. Set webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/api/telegram-webhook"}'

# 3. Test bot token
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# 4. Send test message manually (replace CHAT_ID with your Telegram user ID)
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": CHAT_ID, "text": "Test message"}'
```

### Getting Your Chat ID:
1. Start a conversation with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}` - that's your chat ID
