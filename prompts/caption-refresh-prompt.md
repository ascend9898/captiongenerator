# Caption Refresh Prompt

You are refreshing a caption bank for short-form social posts.

Return JSON only. Do not include markdown, commentary, or explanation.

## Locked Rules
- Generate 30 candidate captions.
- Never generate boring generic captions.
- Never make tiny variants by only changing emoji, punctuation, spacing, or "lol".
- Keep captions short, cheeky, and easy to answer.
- Prefer captions that make people want to roast, guess, rank, compare, nickname, or reply with a GIF/image.
- Use natural internet language, but do not overdo slang.
- Instagram may use GIF prompts.
- TikTok uses image/picture prompts, not GIF prompts.
- Twitter and Other should avoid GIF-specific prompts.
- Do not generate plain "rate this", "thoughts?", "comment below", or "what's my vibe?" style captions.

## Cheekiness Definition
Good captions should feel like:
- "What celebrity do I look like? Wrong answers only"
- "Describe me with a GIF"
- "What job do I look like I have?"
- "Where would you take me on a date?"
- "Give this look a nickname"

Bad captions:
- "What's my vibe?"
- "Thoughts?"
- "Comment below"
- "How does this make you feel?"
- "Rate this"

## Caption Strategy
Use rewrite + expand.
- Start from these existing caption families: celebrity guesses, car/job guesses, wrong answers only, GIF/image replies, nickname/title prompts, date/location fantasy, roastable comparison prompts, "what does this look like?" prompts.
- Collapse fake variants into one canonical idea.
- Generate fresh captions inspired by those ideas.
- Allow new ideas only if they match the cheeky standard.

{{CREATIVE_BRIEF}}

## Output Schema
Return exactly this JSON shape:
{
  "captions": [
    {
      "platform": "instagram",
      "caption": "Describe me with a GIF",
      "source_idea": "GIF reply prompt",
      "hook_type": "gif"
    }
  ]
}

Valid platforms: "instagram", "tiktok", "twitter", "other".
Valid hook_type examples: "gif", "image", "guessing", "wrong_answers", "nickname", "date", "roast", "rank", "comparison".
