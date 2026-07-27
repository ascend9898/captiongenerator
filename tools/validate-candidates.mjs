import { parseCandidateFile, platformFiles, readAllCaptions, validateCaption } from "./shared.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run validate -- <candidate-json-file>");
  process.exit(2);
}

const existingByPlatform = readAllCaptions();
const accepted = [];
const rejected = [];

for (const item of parseCandidateFile(file)) {
  const platform = item.platform;
  const caption = item.caption;
  if (!platformFiles[platform]) {
    rejected.push({ ...item, reason: `unknown platform: ${platform}` });
    continue;
  }
  const result = validateCaption(platform, caption, existingByPlatform, accepted.filter((candidate) => candidate.platform === platform));
  if (result.ok) {
    accepted.push({ platform, caption });
  } else {
    rejected.push({ ...item, reason: result.reason });
  }
}

console.log(JSON.stringify({ accepted, rejected, accepted_count: accepted.length, rejected_count: rejected.length }, null, 2));
process.exitCode = rejected.length ? 1 : 0;
