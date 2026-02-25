# Telegram Bot Setup Guide

## Overview
This Telegram bot sends daily reminders to students enrolled in roadmaps, tracks their progress, and helps them stay on track with their learning journey.

## Prerequisites
- Telegram Bot Token (from @BotFather)
- Supabase database with the required tables
- Deployed Next.js application

## Setup Steps

### 1. Database Setup
Run the SQL schema file to create the required tables:
```sql
-- Run this in your Supabase SQL editor
\i telegram-bot-schema.sql
```

This creates:
- `telegram_bot_users` - Stores user chat IDs and roadmap selections
- `telegram_bot_progress` - Tracks daily task completion

### 2. Environment Variables
Add these to your `.env.local` (or Vercel environment variables):

```env
TELEGRAM_BOT_TOKEN=8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/api/telegram-webhook
CRON_SECRET=your-secret-key-here  # Optional, for securing cron endpoints
```

### 3. Set Webhook
After deploying your app, set the Telegram webhook:

**Option A: Using the setup script**
```bash
npx tsx scripts/setup-telegram-webhook.ts
```

**Option B: Using curl**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/api/telegram-webhook"}'
```

**Option C: Using Telegram API directly**
Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram-webhook`

### 4. Verify Webhook
Check if webhook is set correctly:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 5. Cron Jobs (Vercel)
The `vercel.json` file is already configured with:
- Morning reminders: 9:00 AM daily (`/api/telegram-send-daily`)
- Evening reminders: 8:00 PM daily (`/api/telegram-send-evening`)

Make sure your Vercel project has cron jobs enabled.

## Bot Commands

- `/start` - Start the bot and see available roadmaps (or use deep link: `t.me/ngcult_bot?start=roadmap_id`)
- `/list` - Show all available roadmaps (custom + standard)
- `/status` - Check your current progress
- `/help` - Show help message

## Bot Flow

1. **User starts bot** → Shows roadmap list
2. **User selects roadmap** → Stored in `telegram_bot_users` table
3. **Daily morning (9 AM)** → Bot sends day's tasks, description, subtasks, videos, links
4. **Daily evening (8 PM)** → Bot asks if user completed the day
5. **User clicks "Completed"** → Progress saved to `telegram_bot_progress` table

## Deep Links
Users can start with a specific roadmap:
```
t.me/ngcult_bot?start=python_roadmap
t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre
```

## API Endpoints

- `POST /api/telegram-webhook` - Receives Telegram updates
- `GET /api/telegram-send-daily` - Sends morning reminders (cron)
- `GET /api/telegram-send-evening` - Sends evening reminders (cron)

## Testing

1. Start the bot: `/start`
2. Select a roadmap from the list
3. Manually trigger daily reminder:
   ```bash
   curl "https://yourdomain.com/api/telegram-send-daily"
   ```
4. Manually trigger evening reminder:
   ```bash
   curl "https://yourdomain.com/api/telegram-send-evening"
   ```

## Troubleshooting

- **Webhook not receiving updates**: Check webhook URL is correct and accessible
- **Cron jobs not running**: Verify `vercel.json` is deployed and cron jobs are enabled
- **Database errors**: Ensure all tables are created and Supabase connection is working
- **Bot not responding**: Check `TELEGRAM_BOT_TOKEN` is correct

## Security Notes

- Never commit your bot token to git
- Use environment variables for all secrets
- Consider adding authentication to cron endpoints using `CRON_SECRET`
- Validate all user inputs before database operations
