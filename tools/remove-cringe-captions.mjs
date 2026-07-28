import { isCringeGeneric, platformFiles, readPlatform, writePlatform } from "./shared.mjs";

for (const platform of Object.keys(platformFiles)) {
  const data = readPlatform(platform);
  const before = data.prompts.length;
  data.prompts = data.prompts.filter((caption) => !isCringeGeneric(caption));
  writePlatform(platform, data);
  console.log(`${platform}: removed ${before - data.prompts.length} cringe/vague captions, kept ${data.prompts.length}`);
}
