# {{PLATFORM_NAME}} Caption Refresh Prompt

You are refreshing the caption bank for {{PLATFORM_NAME}} only.

Return JSON only. Do not include markdown, commentary, or explanation.

## Locked Rules
- Generate 30 candidate captions for {{PLATFORM_NAME}}.
- Every item must use `"platform": "{{PLATFORM}}"`.
- Never generate boring generic captions.
- Never generate vague AI-coded captions built from abstract labels like "cute chaos", "rich problem", "soft danger", "romantic risk", "main character", or "or both".
- Never make tiny variants by only changing emoji, punctuation, spacing, or "lol".
- Keep captions short, cheeky, and easy to answer.
- Prefer captions that make people want to roast, guess, rank, compare, nickname, or use the platform's reply format.
- Use natural internet language, but do not overdo slang.
- Do not generate plain "rate this", "thoughts?", "comment below", or "what's my vibe?" style captions.
- Do not generate "Choose one: X, Y, or both?" captions.
- Use concrete situations, people, places, or actions. Avoid abstract label pairs.

## Platform Rules
{{PLATFORM_RESPONSE_RULE}}
{{PLATFORM_FORBIDDEN_RULE}}

## Cheekiness Definition
Good {{PLATFORM_NAME}} captions should feel like:
{{PLATFORM_EXAMPLES}}

Bad captions:
- "What's my vibe?"
- "Thoughts?"
- "Comment below"
- "How does this make you feel?"
- "Rate this"
- "Choose one: cute chaos, rich chaos, or both?"
- "Choose one: romantic risk or financial risk?"
- "Main character or legal problem?"

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
      "platform": "{{PLATFORM}}",
      "caption": "What celebrity do I look like? Wrong answers only",
      "source_idea": "celebrity guessing prompt",
      "hook_type": "guessing"
    }
  ]
}

Valid hook_type examples: "gif", "image", "guessing", "wrong_answers", "nickname", "date", "roast", "rank", "comparison".
