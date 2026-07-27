import { groupDuplicates, hasStrongHook, isBoringGeneric, platformFiles, platformViolation, readPlatform } from "./shared.mjs";

let hasIssues = false;

for (const platform of Object.keys(platformFiles)) {
  const captions = readPlatform(platform).prompts;
  const duplicates = groupDuplicates(captions);
  const boring = captions.filter(isBoringGeneric);
  const weak = captions.filter((caption) => !hasStrongHook(caption));
  const platformErrors = captions
    .map((caption) => ({ caption, error: platformViolation(platform, caption) }))
    .filter((item) => item.error);

  if (duplicates.length || boring.length || platformErrors.length) hasIssues = true;

  console.log(`\n${platform}`);
  console.log(`  total: ${captions.length}`);
  console.log(`  duplicate families: ${duplicates.length}`);
  console.log(`  boring/generic: ${boring.length}`);
  console.log(`  weak hook candidates: ${weak.length}`);
  console.log(`  platform rule violations: ${platformErrors.length}`);

  if (duplicates.length) {
    console.log("  duplicate examples:");
    duplicates.slice(0, 5).forEach(([, items]) => {
      console.log(`    - ${items.map((item) => item.caption).join(" | ")}`);
    });
  }

  if (platformErrors.length) {
    console.log("  platform violations:");
    platformErrors.slice(0, 5).forEach((item) => {
      console.log(`    - ${item.error}: ${item.caption}`);
    });
  }
}

process.exitCode = hasIssues ? 1 : 0;
