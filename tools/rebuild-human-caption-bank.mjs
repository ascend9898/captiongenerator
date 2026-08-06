import { anchorPromptsForPlatform, platformHumanPrompts } from "./human-anchor-bank.mjs";
import { readPlatform, writePlatform } from "./shared.mjs";

for (const platform of Object.keys(platformHumanPrompts)) {
  const data = readPlatform(platform);
  data.prompts = anchorPromptsForPlatform(platform);
  writePlatform(platform, data);
  console.log(`${platform}: rebuilt ${data.prompts.length}`);
}
