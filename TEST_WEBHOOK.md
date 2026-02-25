# Testing Telegram Webhook

## Test the Endpoint

### 1. Test GET (Health Check)
```bash
curl https://nextgencult.com/api/telegram-webhook
```

Should return:
```json
{
  "ok": true,
  "message": "Telegram webhook endpoint is active",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "webhook_url": "https://nextgencult.com/api/telegram-webhook"
}
```

### 2. Test POST (Simulate Telegram Update)
```bash
curl -X POST https://nextgencult.com/api/telegram-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 123456789,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "is_bot": false,
        "first_name": "Test",
        "username": "testuser"
      },
      "chat": {
        "id": 123456789,
        "type": "private",
        "first_name": "Test"
      },
      "date": 1234567890,
      "text": "/start"
    }
  }'
```

Should return:
```json
{
  "ok": true
}
```

## Common Issues

### 405 Method Not Allowed
- **Cause**: Route doesn't accept the HTTP method
- **Fix**: Make sure `route.ts` exports both `GET` and `POST` handlers
- **Check**: Verify the file is at `src/app/api/telegram-webhook/route.ts`

### 404 Not Found
- **Cause**: Route file doesn't exist or wrong path
- **Fix**: Check file structure matches Next.js App Router conventions
- **Check**: File should be at `src/app/api/telegram-webhook/route.ts`

### 500 Internal Server Error
- **Cause**: Error in the route handler
- **Fix**: Check server logs for error details
- **Check**: Verify environment variables are set

## Deployment Checklist

- [ ] Route file exists at `src/app/api/telegram-webhook/route.ts`
- [ ] Route exports `POST` handler
- [ ] Route exports `GET` handler (for health checks)
- [ ] `TELEGRAM_BOT_TOKEN` is set in Vercel Environment Variables
- [ ] Code is committed and pushed to git
- [ ] Vercel deployment is successful
- [ ] Webhook is set: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`

## Verify Deployment

1. **Check if route is deployed:**
   ```bash
   curl https://nextgencult.com/api/telegram-webhook
   ```

2. **Check Vercel deployment logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Check latest deployment status
   - Look for any build errors

3. **Check Vercel function logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `telegram-webhook` function
   - Check for any runtime errors

## Next Steps After Fix

1. Test GET endpoint (should work now)
2. Test POST endpoint with sample update
3. Set webhook again (if needed)
4. Send `/start` to bot
5. Check logs for incoming updates
