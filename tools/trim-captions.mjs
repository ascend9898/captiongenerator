import { platformFiles, readPlatform, writePlatform } from "./shared.mjs";

for (const platform of Object.keys(platformFiles)) {
  const data = readPlatform(platform);
  const before = data.prompts.length;
  const trimmed = data.prompts.map((caption) => String(caption).trim()).filter(Boolean);
  const changed = data.prompts.filter((caption, index) => caption !== trimmed[index]).length + (before - trimmed.length);
  data.prompts = trimmed;
  writePlatform(platform, data);
  console.log(`${platform}: trimmed ${changed}, kept ${trimmed.length}`);
}
