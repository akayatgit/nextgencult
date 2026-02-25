# Telegram Bot Workflow

## Current Workflow (As Designed)

### Step 1: User sends `/start`
- **Handler**: `/api/telegram-webhook` (POST)
- **Action**: Shows roadmap list with inline buttons
- **Response**: "📚 Available Roadmaps: Select a roadmap to get started:"

### Step 2: User clicks a roadmap button
- **Handler**: `/api/telegram-webhook` (POST) - Callback Query
- **Action**: 
  1. Saves/updates user in `telegram_bot_users` table
  2. **Should send Day 1 message immediately** ← THIS IS FAILING
  3. Sends welcome message
- **Expected Response**: 
  - Day 1 tasks (with description, subtasks, videos, links)
  - Welcome message: "✅ You're in! This is Day 1..."

### Step 3: After 2 minutes (Cron Job)
- **Handler**: `/api/telegram-send-followups` (GET)
- **Trigger**: Cron job runs every 2 minutes (`*/2 * * * *`)
- **Action**: 
  - Finds users enrolled 2+ minutes ago who haven't received followup
  - Sends follow-up message with buttons
- **Expected Response**: "🧠 Quick check-in! Did you get a chance to start Day 1?"

### Step 4: From Day 2 onwards (Cron Job)
- **Handler**: `/api/telegram-send-daily` (GET)
- **Trigger**: Cron job runs at 8:00 AM daily (`0 8 * * *`)
- **Action**: 
  - Calculates current day based on start_date
  - Sends that day's tasks
  - Skips Day 1 (already sent immediately)

### Step 5: Evening reminder (Cron Job)
- **Handler**: `/api/telegram-send-evening` (GET)
- **Trigger**: Cron job runs at 8:00 PM daily (`0 20 * * *`)
- **Action**: Asks if user completed the day

## The Problem

**After Step 2, Day 1 message is NOT being sent.**

The code calls `sendDayMessage()` but it's likely:
1. Failing silently (returning false)
2. Template not found
3. Day 1 data not in expected format
4. Error in message sending

## What Should Happen

1. User clicks roadmap → **Day 1 sent immediately** ✅
2. Welcome message sent ✅
3. After 2 min → Follow-up sent (via cron) ⏳
4. Next day 8 AM → Day 2 sent (via cron) ⏳

## Debugging Steps

Check Vercel logs for:
- `Sending Day 1 to chat X for roadmap Y`
- `sendDayMessage called: chatId=X...`
- `Template fetched: found/not found`
- `Day 1 data: found/not found`
- Any error messages
