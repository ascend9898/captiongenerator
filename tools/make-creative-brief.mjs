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
  "playful guessing games and mildly roastable prompts",
  "wrong-answers-only prompts and confident first-impression questions",
  "nickname/title prompts and comparison prompts that feel easy to answer",
  "date/location fantasy prompts without sounding serious or needy",
  "GIF/image reply prompts plus quick choice questions",
  "celebrity/job/movie-character guesses with a teasing tone"
];

const avoids = [
  "avoid plain vibe checks and one-word rating prompts",
  "avoid car prompts this batch",
  "avoid date/location questions this batch",
  "avoid celebrity-only prompts this batch",
  "avoid using the word vibe this batch",
  "avoid yes/no prompts unless there is a funny comparison attached"
];

const tones = [
  "confident, teasing, and easy to roast",
  "casual, slightly smug, and playful",
  "flirty but not needy, with simple wording",
  "bold, funny, and built for fast replies",
  "lightly chaotic but still natural",
  "direct, cheeky, and not over-written"
];

const mix = [
  "Use several wrong-answers-only prompts and several nickname/title prompts.",
  "Lean into guessing, ranking, and comparison formats.",
  "Mix first-impression prompts with playful roast prompts.",
  "Include a few prompts where the reply can be only one word.",
  "Make most captions feel like something a real person would send to start replies."
];

const platformConfig = {
  instagram: {
    name: "Instagram",
    responseRule: "Instagram supports GIF replies, so GIF prompts are allowed and useful. It can also use normal comment prompts.",
    forbidden: "Do not ask for image/picture replies when a GIF prompt would be more natural for Instagram.",
    examples: [
      "Describe me with a GIF",
      "What celebrity would block me for wearing this?",
      "Wrong answers only: where am I going dressed like this?",
      "Give this outfit a villain name"
    ]
  },
  tiktok: {
    name: "TikTok",
    responseRule: "TikTok uses image/picture reply prompts, not GIF prompts. Ask for a picture or image when using visual-reply formats.",
    forbidden: "Never mention GIF, GIFs, or reaction GIFs for TikTok.",
    examples: [
      "Reply with the picture this look reminds you of",
      "What cartoon character would beef with this outfit?",
      "Wrong answers only: what did I just walk into?",
      "What song title does this outfit look like?"
    ]
  },
  twitter: {
    name: "Twitter",
    responseRule: "Twitter captions should be short text-reply prompts. Avoid GIF-specific wording in this bank.",
    forbidden: "Do not mention GIFs.",
    examples: [
      "What fake headline would this photo cause?",
      "What job would I get fired from in this outfit?",
      "Rank this outfit as a life decision",
      "Wrong answers only: what meeting did I just ruin?"
    ]
  },
  other: {
    name: "Other",
    responseRule: "Other captions should be general text-reply prompts that work anywhere.",
    forbidden: "Do not mention platform-specific GIF or image reply features.",
    examples: [
      "Give this photo a dramatic episode title",
      "What fake award would this look win?",
      "Wrong answers only: what am I about to announce?",
      "What warning label should this photo come with?"
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
