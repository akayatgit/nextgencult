#!/bin/bash

# Set your bot token and webhook URL
BOT_TOKEN="8063206017:AAGlXUQmoGA_1yW5bTjZ2SFJ9slVCRvwve0"
WEBHOOK_URL="https://yourdomain.com/api/telegram-webhook"

# Replace 'yourdomain.com' with your actual domain
echo "Setting webhook to: $WEBHOOK_URL"

curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}"

echo ""
echo "Webhook set! Verify with:"
echo "curl \"https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo\""
