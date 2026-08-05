import { isConfusingNonsense, isCringeGeneric, isHumanNaturalCaption, isUnnaturalEngagementBait, platformFiles, readPlatform, writePlatform } from "./shared.mjs";

for (const platform of Object.keys(platformFiles)) {
  const data = readPlatform(platform);
  const before = data.prompts.length;
  data.prompts = data.prompts.filter(
    (caption) => !isCringeGeneric(caption) && !isConfusingNonsense(caption) && !isUnnaturalEngagementBait(caption) && isHumanNaturalCaption(caption)
  );
  writePlatform(platform, data);
  console.log(`${platform}: removed ${before - data.prompts.length} cringe/vague/confusing/unnatural captions, kept ${data.prompts.length}`);
}
