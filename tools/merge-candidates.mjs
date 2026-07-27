import { parseArgs } from "node:util";
import { parseCandidateFile, readAllCaptions, readPlatform, validateCaption, writePlatform } from "./shared.mjs";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    limit: { type: "string", short: "l", default: "30" }
  },
  allowPositionals: true
});

const file = positionals[0];
const limit = Number(values.limit);
if (!file || !Number.isFinite(limit) || limit < 1) {
  console.error("Usage: npm run merge -- <candidate-json-file> --limit 30");
  process.exit(2);
}

const existingByPlatform = readAllCaptions();
const accepted = [];
const rejected = [];

for (const item of parseCandidateFile(file)) {
  if (accepted.length >= limit) break;
  const result = validateCaption(item.platform, item.caption, existingByPlatform, accepted.filter((candidate) => candidate.platform === item.platform));
  if (result.ok) {
    accepted.push({ platform: item.platform, caption: item.caption.trim() });
  } else {
    rejected.push({ ...item, reason: result.reason });
  }
}

for (const item of accepted) {
  const data = readPlatform(item.platform);
  data.prompts.push(item.caption);
  writePlatform(item.platform, data);
}

console.log(JSON.stringify({ merged: accepted, rejected, merged_count: accepted.length, rejected_count: rejected.length }, null, 2));

if (!accepted.length) {
  process.exitCode = 1;
}
