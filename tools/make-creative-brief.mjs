import fs from "node:fs";
import path from "node:path";
import { platformFiles, repoRoot } from "./shared.mjs";

const args = new Set(process.argv.slice(2));
const seedArg = process.argv.find((arg) => arg.startsWith("--seed="));
const platformArg = process.argv.find((arg) => arg.startsWith("--platform="));
const seed = seedArg ? seedArg.split("=")[1] : new Date().toISOString().slice(0, 10);
const platform = platformArg ? platformArg.split("=")[1] : "instagram";

if (!platformFiles[platform]) {
  throw new Error(`Unknown platform: ${platform}`);
}

function seededPick(list, salt) {
  let hash = 0;
  const input = `${seed}:${salt}`;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return list[hash % list.length];
}

const angles = [
  "celebrity and character guesses",
  "job and car guesses",
  "date and place questions",
  "nickname prompts",
  "direct visual-reply prompts",
  "simple roast prompts"
];

const avoids = [
  "avoid fake headline formats",
  "avoid random props",
  "avoid workplace or paperwork jokes",
  "avoid trying to sound clever",
  "avoid abstract labels",
  "avoid complicated wording"
];

const tones = [
  "casual and direct",
  "flirty but simple",
  "playful and easy to answer",
  "cheeky but natural",
  "short and comment-friendly",
  "plain-spoken and confident"
];

const mix = [
  "Use only the approved caption shapes.",
  "Most captions should be answerable in one short comment.",
  "Keep the wording close to how a normal person would ask.",
  "Prefer simple questions over clever lines.",
  "Make the prompts feel like they were written quickly by a real person."
];

const platformConfig = {
  instagram: {
    name: "Instagram",
    responseRule: "Instagram supports GIF replies, so GIF prompts are allowed and useful. It can also use normal comment prompts.",
    forbidden: "Do not ask for image/picture replies when a GIF prompt would be more natural for Instagram.",
    visualExample: "\"Describe me with a GIF\" or \"What GIF describes me right now?\"",
    examples: [
      "Describe me with a GIF",
      "What GIF describes me right now?",
      "What celebrity do I look like?",
      "Wrong answers only: where am I going dressed like this?",
      "Give this outfit a villain name"
    ]
  },
  tiktok: {
    name: "TikTok",
    responseRule: "TikTok uses image/picture reply prompts, not GIF prompts. Ask for a picture or image when using visual-reply formats.",
    forbidden: "Never mention GIF, GIFs, or reaction GIFs for TikTok.",
    visualExample: "\"Reply with the picture that describes me\" or \"What picture describes me right now?\"",
    examples: [
      "Reply with the picture that describes me",
      "What cartoon character do I look like?",
      "Wrong answers only: where am I going dressed like this?",
      "What song do I look like?"
    ]
  },
  twitter: {
    name: "Twitter",
    responseRule: "Twitter captions should be short text-reply prompts. Avoid GIF-specific wording in this bank.",
    forbidden: "Do not mention GIFs.",
    visualExample: "\"Describe me in one word\" or \"What does this remind you of?\"",
    examples: [
      "What celebrity do I look like?",
      "What job do I look like I have?",
      "Wrong answers only: where am I going dressed like this?",
      "Give this look a nickname"
    ]
  },
  other: {
    name: "Other",
    responseRule: "Other captions should be general text-reply prompts that work anywhere.",
    forbidden: "Do not mention platform-specific GIF or image reply features.",
    visualExample: "\"Describe me in one word\" or \"What does this remind you of?\"",
    examples: [
      "What celebrity do I look like?",
      "What job do I look like I have?",
      "Where would you take me on a date?",
      "Give this look a nickname"
    ]
  }
};

const brief = `CREATIVE BRIEF FOR THIS BATCH:
Focus on ${seededPick(angles, "angle")}.
${seededPick(avoids, "avoid")}.
Use a ${seededPick(tones, "tone")} tone.
${seededPick(mix, "mix")}
Seed: ${seed}`;

const template = fs.readFileSync(path.join(repoRoot, "prompts", "caption-refresh-prompt.md"), "utf8");
const config = platformConfig[platform];
const output = template
  .replaceAll("{{PLATFORM}}", platform)
  .replaceAll("{{PLATFORM_NAME}}", config.name)
  .replace("{{PLATFORM_VISUAL_EXAMPLE}}", config.visualExample)
  .replace("{{PLATFORM_RESPONSE_RULE}}", config.responseRule)
  .replace("{{PLATFORM_FORBIDDEN_RULE}}", config.forbidden)
  .replace("{{PLATFORM_EXAMPLES}}", config.examples.map((example) => `- "${example}"`).join("\n"))
  .replace("{{CREATIVE_BRIEF}}", brief);

if (args.has("--write")) {
  const workDir = path.join(repoRoot, "work");
  fs.mkdirSync(workDir, { recursive: true });
  const outputFile = path.join(workDir, `caption-refresh-request.${platform}.md`);
  fs.writeFileSync(outputFile, output);
  console.log(`Wrote ${outputFile}`);
} else {
  console.log(output);
}
