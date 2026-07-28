import { execFileSync } from "node:child_process";
import { normalizeCaption, platformFiles, readPlatform, writePlatform } from "./shared.mjs";

const baselineRef = process.argv.find((arg) => arg.startsWith("--baseline="))?.split("=")[1] || "6ed06dd";

for (const platform of Object.keys(platformFiles)) {
  const baselineRaw = execFileSync("git", ["show", `${baselineRef}:data/${platform}.json`], { encoding: "utf8" });
  const baseline = JSON.parse(baselineRaw).prompts.map(normalizeCaption);
  const legacyKeys = new Set(baseline);

  const data = readPlatform(platform);
  const before = data.prompts.length;
  data.prompts = data.prompts.filter((caption) => !legacyKeys.has(normalizeCaption(caption)));
  writePlatform(platform, data);

  console.log(`${platform}: removed ${before - data.prompts.length} legacy captions, kept ${data.prompts.length}`);
}
