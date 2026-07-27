# Local Codex Automation

Use this after the repo is saved as a Codex project.

Name:
```text
Caption Bank Daily Refresh
```

Schedule:
```text
Daily at 9:00 AM Bangkok time
```

Prompt:
```text
Refresh the caption bank in this repo using the local Codex prompt system. Do not use API keys or browser-stored keys.

Choose one platform for this run: instagram, tiktok, twitter, or other.

Run `npm run brief -- --platform=<platform> --write`, read `work/caption-refresh-request.<platform>.md`, generate exactly 30 caption candidates for that platform as JSON into `work/caption-candidates.json`, run `npm run validate -- work/caption-candidates.json`, fix or replace rejected candidates until validation returns 30 accepted and 0 rejected, then run `npm run merge -- work/caption-candidates.json --limit 30` and `npm run audit`.

If audit shows duplicate families, boring/generic captions, or platform rule violations, fix the batch or tooling before committing.

Commit changed tracked files with message `Refresh caption bank`.

Do not commit files under `work/`.

If git push is available, push the commit; if push fails, leave the local commit and report the failure.
```
