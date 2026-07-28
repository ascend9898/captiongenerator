# Local Codex Automation

Use this after the repo is saved as a Codex project.

Name:
```text
Caption Bank 5 Minute Refresh
```

Schedule:
```text
Every 5 minutes
```

Prompt:
```text
Refresh the caption bank in this repo using the local Codex prompt system. Do not use API keys or browser-stored keys.

Run a full platform cycle every time. Generate:
- 30 Instagram captions
- 30 TikTok captions
- 30 Twitter captions
- 30 Other captions

For each platform in this order: instagram, tiktok, twitter, other:

1. Run `npm run brief -- --platform=<platform> --write`.
2. Read `work/caption-refresh-request.<platform>.md`.
3. Generate exactly 30 caption candidates for that platform as JSON into `work/caption-candidates.<platform>.json`.
4. Run `npm run validate -- work/caption-candidates.<platform>.json`.
5. Fix or replace rejected candidates until validation returns 30 accepted and 0 rejected.
6. Run `npm run merge -- work/caption-candidates.<platform>.json --limit 30`.

After all four platforms are merged, run `npm run trim`, `npm run remove-cringe`, `npm run prune -- --count 15`, and `npm run audit`.

This means every 5-minute cycle adds 30 captions per platform and removes the oldest 15 captions per platform. Net result: each platform grows by 15 captions per cycle while stale captions rotate out.

If audit shows duplicate families, boring/generic captions, or platform rule violations, fix the batch or tooling before committing.

Commit changed tracked files with message `Refresh caption bank`.

Do not commit files under `work/`.

If git push is available, push the commit; if push fails, leave the local commit and report the failure.
```
