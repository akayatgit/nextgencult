# Fix 405 Error on Telegram Webhook

## Issue
Getting `405 This page isn't working` when accessing `https://nextgencult.com/api/telegram-webhook`

## Solution Steps

### Step 1: Verify File Structure
The route file should be at:
```
src/app/api/telegram-webhook/route.ts
```

✅ File exists and is correct.

### Step 2: Commit and Push Changes
Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Add Telegram webhook route with GET and POST handlers"
git push
```

### Step 3: Trigger Vercel Redeploy
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
   OR
5. Push a new commit to trigger auto-deploy

### Step 4: Test the Endpoint

**Test GET (should work now):**
```bash
curl https://nextgencult.com/api/telegram-webhook
```

Expected response:
```json
{
  "ok": true,
  "message": "Telegram webhook endpoint is active",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "webhook_url": "https://nextgencult.com/api/telegram-webhook"
}
```

**Test POST:**
```bash
curl -X POST https://nextgencult.com/api/telegram-webhook \
  -H "Content-Type: application/json" \
  -d '{"update_id": 1, "message": {"message_id": 1, "from": {"id": 123, "is_bot": false, "first_name": "Test"}, "chat": {"id": 123, "type": "private"}, "date": 1234567890, "text": "/start"}}'
```

### Step 5: Verify Deployment
1. Check Vercel deployment logs for any errors
2. Check if the route appears in Vercel Functions
3. Wait 1-2 minutes after deployment for changes to propagate

### Step 6: Re-set Webhook (if needed)
After confirming the endpoint works:

```bash
curl -X POST "https://api.telegram.org/bot8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://nextgencult.com/api/telegram-webhook"}'
```

## Common Causes of 405 Error

1. **Route not deployed** - Solution: Redeploy
2. **Caching issue** - Solution: Clear cache, wait, or redeploy
3. **Wrong HTTP method** - Solution: Route now handles both GET and POST ✅
4. **File not in correct location** - Solution: Verified file is correct ✅

## Verification Checklist

- [ ] Route file exists at `src/app/api/telegram-webhook/route.ts`
- [ ] Route exports `GET` handler ✅
- [ ] Route exports `POST` handler ✅
- [ ] Changes committed and pushed
- [ ] Vercel deployment successful
- [ ] GET endpoint returns 200 OK
- [ ] POST endpoint returns 200 OK
- [ ] Webhook is set correctly

## After Fix

Once the endpoint works:
1. Test by sending `/start` to your bot
2. Check Vercel logs for incoming updates
3. Verify bot responds correctly
