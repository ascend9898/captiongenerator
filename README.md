# Caption Generator

Static caption picker plus local caption-bank refresh tools.

## Daily Refresh Flow

1. Generate the next prompt:
   ```bash
   npm run brief -- --write
   ```

2. Use Codex locally with `work/caption-refresh-request.md` and save the JSON answer to:
   ```text
   work/caption-candidates.json
   ```

3. Check the batch before writing:
   ```bash
   npm run validate -- work/caption-candidates.json
   ```

4. Merge accepted captions:
   ```bash
   npm run merge -- work/caption-candidates.json --limit 30
   ```

5. Audit the full bank:
   ```bash
   npm run audit
   ```

6. Commit:
   ```bash
   git add data prompts tools fixtures README.md package.json
   git commit -m "Refresh caption bank"
   ```

For the Codex recurring automation setup, use `docs/local-codex-automation.md`.

## Rules

- Instagram may ask for GIF replies.
- TikTok should ask for image or picture replies, not GIF replies.
- Exact duplicates, emoji-only variants, punctuation-only variants, weak prompts, and generic captions are rejected.
- Strong captions must push a real response: guessing, wrong answers only, roast, nickname, comparison, GIF/image reply, date/location fantasy, or "what does this look like?"

## One-Time Cleanup

Run this when the bank has lots of fake variants:

```bash
npm run dedupe
```

This keeps the first version of each caption idea and removes punctuation/emoji-only repeats.
