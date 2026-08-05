import { groupDuplicates, hasStrongHook, isBoringGeneric, isConfusingNonsense, isCringeGeneric, isHumanNaturalCaption, isUnnaturalEngagementBait, platformFiles, platformViolation, readPlatform } from "./shared.mjs";

let hasIssues = false;

for (const platform of Object.keys(platformFiles)) {
  const captions = readPlatform(platform).prompts;
  const duplicates = groupDuplicates(captions);
  const boring = captions.filter(isBoringGeneric);
  const cringe = captions.filter(isCringeGeneric);
  const confusing = captions.filter(isConfusingNonsense);
  const unnatural = captions.filter(isUnnaturalEngagementBait);
  const notHuman = captions.filter((caption) => !isHumanNaturalCaption(caption));
  const weak = captions.filter((caption) => !hasStrongHook(caption));
  const platformErrors = captions
    .map((caption) => ({ caption, error: platformViolation(platform, caption) }))
    .filter((item) => item.error);

  if (duplicates.length || boring.length || cringe.length || confusing.length || unnatural.length || notHuman.length || weak.length || platformErrors.length) hasIssues = true;

  console.log(`\n${platform}`);
  console.log(`  total: ${captions.length}`);
  console.log(`  duplicate families: ${duplicates.length}`);
  console.log(`  boring/generic: ${boring.length}`);
  console.log(`  cringe/vague AI-coded: ${cringe.length}`);
  console.log(`  confusing/nonsense: ${confusing.length}`);
  console.log(`  unnatural engagement bait: ${unnatural.length}`);
  console.log(`  not human/natural enough: ${notHuman.length}`);
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

  if (cringe.length) {
    console.log("  cringe examples:");
    cringe.slice(0, 5).forEach((caption) => {
      console.log(`    - ${caption}`);
    });
  }

  if (confusing.length) {
    console.log("  confusing examples:");
    confusing.slice(0, 5).forEach((caption) => {
      console.log(`    - ${caption}`);
    });
  }

  if (unnatural.length) {
    console.log("  unnatural examples:");
    unnatural.slice(0, 5).forEach((caption) => {
      console.log(`    - ${caption}`);
    });
  }

  if (notHuman.length) {
    console.log("  not human/natural examples:");
    notHuman.slice(0, 5).forEach((caption) => {
      console.log(`    - ${caption}`);
    });
  }

  if (weak.length) {
    console.log("  weak hook examples:");
    weak.slice(0, 5).forEach((caption) => {
      console.log(`    - ${caption}`);
    });
  }
}

process.exitCode = hasIssues ? 1 : 0;
