import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./shared.mjs";

const args = new Set(process.argv.slice(2));
const seedArg = process.argv.find((arg) => arg.startsWith("--seed="));
const seed = seedArg ? seedArg.split("=")[1] : new Date().toISOString().slice(0, 10);

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
  "Include some GIF prompts for Instagram and image/picture prompts for TikTok.",
  "Use several wrong-answers-only prompts and several nickname/title prompts.",
  "Lean into guessing, ranking, and comparison formats.",
  "Mix first-impression prompts with playful roast prompts.",
  "Include a few prompts where the reply can be only one word.",
  "Make most captions feel like something a real person would send to start replies."
];

const brief = `CREATIVE BRIEF FOR THIS BATCH:
Focus on ${seededPick(angles, "angle")}.
${seededPick(avoids, "avoid")}.
Use a ${seededPick(tones, "tone")} tone.
${seededPick(mix, "mix")}
Seed: ${seed}`;

const template = fs.readFileSync(path.join(repoRoot, "prompts", "caption-refresh-prompt.md"), "utf8");
const output = template.replace("{{CREATIVE_BRIEF}}", brief);

if (args.has("--write")) {
  const workDir = path.join(repoRoot, "work");
  fs.mkdirSync(workDir, { recursive: true });
  const outputFile = path.join(workDir, "caption-refresh-request.md");
  fs.writeFileSync(outputFile, output);
  console.log(`Wrote ${outputFile}`);
} else {
  console.log(output);
}
