import { parseArgs } from "node:util";
import { platformFiles, readPlatform, writePlatform } from "./shared.mjs";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    count: { type: "string", short: "c", default: "15" },
    platform: { type: "string", short: "p" }
  }
});

const count = Number(values.count);
if (!Number.isInteger(count) || count < 0) {
  console.error("Usage: npm run prune -- --count 15 [--platform instagram]");
  process.exit(2);
}

const platforms = values.platform ? [values.platform] : Object.keys(platformFiles);
for (const platform of platforms) {
  if (!platformFiles[platform]) {
    console.error(`Unknown platform: ${platform}`);
    process.exitCode = 2;
    continue;
  }

  const data = readPlatform(platform);
  const removed = data.prompts.splice(0, count);
  writePlatform(platform, data);
  console.log(`${platform}: pruned ${removed.length}, kept ${data.prompts.length}`);
}
