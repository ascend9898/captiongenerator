import { groupDuplicates, normalizeCaption, platformFiles, readPlatform, writePlatform } from "./shared.mjs";

let removedTotal = 0;

for (const platform of Object.keys(platformFiles)) {
  const data = readPlatform(platform);
  const seen = new Set();
  const deduped = [];

  for (const caption of data.prompts) {
    const key = normalizeCaption(caption);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(caption);
  }

  const before = data.prompts.length;
  data.prompts = deduped;
  writePlatform(platform, data);

  const removed = before - deduped.length;
  removedTotal += removed;
  console.log(`${platform}: removed ${removed}, kept ${deduped.length}`);

  const remainingDuplicates = groupDuplicates(deduped);
  if (remainingDuplicates.length) {
    console.log(`  warning: ${remainingDuplicates.length} duplicate families remain after conservative cleanup`);
  }
}

console.log(`\nRemoved ${removedTotal} fake variants across all platforms.`);
