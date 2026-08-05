# {{PLATFORM_NAME}} Caption Refresh Prompt

You are refreshing short social captions for {{PLATFORM_NAME}}.

Return JSON only. No markdown, no commentary.

## Taste Standard
Write captions a real person would post when they want easy replies.

The caption should feel like one of these:
- "What celebrity do I look like?"
- "Be honest, what kind of car do I look like I drive?"
- "What job do I look like I have?"
- "Describe me with a GIF"
- "Where would you take me on a date?"
- "Give this look a nickname"
- "Wrong answers only: where am I going dressed like this?"
- "Roast me in one sentence"

The best captions are short, obvious, and easy to answer in one comment.

## Approved Caption Shapes
Use these shapes. Do not invent weird new formats.

1. Celebrity / character guess
   - "What celebrity do I look like?"
   - "What cartoon character do I look like?"

2. Job / car / lifestyle guess
   - "What job do I look like I have?"
   - "What car do I look like I drive?"

3. Date / place question
   - "Where would you take me on a date?"
   - "Where am I going dressed like this?"

4. Nickname / naming prompt
   - "Give this look a nickname"
   - "What should I name this outfit?"

5. Direct visual reply
   - {{PLATFORM_VISUAL_EXAMPLE}}

6. Simple roast
   - "Roast me in one sentence"
   - "Roast this outfit"

7. Wrong answers only
   - "Wrong answers only: who do I look like?"
   - "Wrong answers only: where am I going?"

## Platform Rule
{{PLATFORM_RESPONSE_RULE}}
{{PLATFORM_FORBIDDEN_RULE}}

## Avoid
- Do not write fake bureaucracy captions.
- Do not use random props like front desk, lobby, phone camera, camera roll, HR, court, receipts, office printer, bank teller, hotel soap, or minibar.
- Do not ask what an object would say, print, report, deny, witness, or charge.
- Do not use abstract AI phrases like "cute chaos", "rich problem", "soft danger", "main character", or "or both".
- Do not write "What's my vibe?", "Thoughts?", "Rate this", or "Comment below".

## Creative Brief
{{CREATIVE_BRIEF}}

## Output Schema
Return exactly this JSON shape with 30 captions:
{
  "captions": [
    {
      "platform": "{{PLATFORM}}",
      "caption": "What celebrity do I look like?",
      "source_idea": "celebrity guessing",
      "hook_type": "guessing"
    }
  ]
}

Valid hook_type examples: "gif", "image", "guessing", "wrong_answers", "nickname", "date", "roast", "rank", "comparison".
