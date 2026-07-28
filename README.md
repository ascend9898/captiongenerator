# Caption Generator

Static caption picker plus local caption-bank refresh tools.

## Refresh Flow

Each full refresh should generate 30 captions per platform:

- 30 Instagram captions
- 30 TikTok captions
- 30 Twitter captions
- 30 Other captions

Run the same flow once per platform.

1. Generate the next platform prompt:
   ```bash
   npm run brief -- --platform=instagram --write
   ```

2. Use Codex locally with `work/caption-refresh-request.instagram.md` and save the JSON answer to:
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

5. Rotate out older captions after a full four-platform cycle:
   ```bash
   npm run trim
   npm run prune -- --count 15
   ```

6. Audit the full bank:
   ```bash
   npm run audit
   ```

7. Commit:
   ```bash
   git add data prompts tools fixtures README.md package.json
   git commit -m "Refresh caption bank"
   ```

For the Codex recurring automation setup, use `docs/local-codex-automation.md`.

Use `--platform=tiktok`, `--platform=twitter`, or `--platform=other` when refreshing those banks. Each platform gets its own prompt because Instagram supports GIF prompts, TikTok uses image/picture prompts, and the other banks avoid platform-specific reply wording.

All writes trim caption whitespace automatically. To clean whitespace manually:

```bash
npm run trim
```

To remove captions that existed before this automation was added:

```bash
npm run remove-legacy
```

The recurring refresh should add 30 captions per platform, then prune the oldest 15 captions per platform. Net result: each full cycle grows each platform by 15 captions while stale material rotates out.

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
