# Telegram Bot Deep Links Guide

## Format
Telegram deep links follow this format:
```
t.me/ngcult_bot?start=ROADMAP_ID
```

## Sample Deep Links

### For Custom Roadmaps (from custom_roadmap_templates)
If you have a custom roadmap with ID `tmpl_1772032441812_5dpqre`:
```
t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre
```

### For Standard Roadmaps (from roadmaps table)
If you have a standard roadmap with ID `1`:
```
t.me/ngcult_bot?start=1
```

## Python 21-Day Roadmap

### Option 1: Create it in the Builder
1. Go to: `https://yourdomain.com/custom-roadmap/builder`
2. Title: "Python 21-Day Kickstart"
3. Add all 21 days with tasks, subtasks, descriptions, videos, and links
4. Click "Save & Get Link"
5. Copy the roadmap ID (e.g., `tmpl_1772032441812_5dpqre`)
6. Use it in the deep link:
   ```
   t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre
   ```

### Option 2: Find Existing Roadmap ID

**For Custom Roadmaps:**
```sql
SELECT id, title, created_at 
FROM custom_roadmap_templates 
WHERE title ILIKE '%python%' 
ORDER BY created_at DESC;
```

**For Standard Roadmaps:**
```sql
SELECT id, title 
FROM roadmaps 
WHERE title ILIKE '%python%' AND is_active = true;
```

## Quick Reference Links

### Example Custom Roadmap Deep Link:
```
t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre
```

### Example Standard Roadmap Deep Link:
```
t.me/ngcult_bot?start=1
```

### Generic Start (Shows List):
```
t.me/ngcult_bot?start=
```
or just:
```
t.me/ngcult_bot
```

## How to Share with Users

### In Messages/Posts:
```
🚀 Start your Python 21-Day Learning Journey:
t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre
```

### As HTML Link:
```html
<a href="https://t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre">
  Start Python 21-Day Roadmap
</a>
```

### As Markdown:
```markdown
[Start Python 21-Day Roadmap](https://t.me/ngcult_bot?start=tmpl_1772032441812_5dpqre)
```

## Testing Deep Links

1. **On Desktop:** Click the link in a browser, it will open Telegram Desktop/Web
2. **On Mobile:** Click the link, it will open Telegram app
3. **In Telegram:** Send the link to yourself or a test chat and click it

## Notes

- The `start` parameter can be up to 64 characters
- If the roadmap ID doesn't exist, the bot will show the roadmap list
- Users can also use `/list` command to see all available roadmaps
- Deep links work even if the user hasn't started the bot before
