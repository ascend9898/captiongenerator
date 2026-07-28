import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, "..");
export const dataDir = path.join(repoRoot, "data");
export const platformFiles = {
  instagram: path.join(dataDir, "instagram.json"),
  tiktok: path.join(dataDir, "tiktok.json"),
  twitter: path.join(dataDir, "twitter.json"),
  other: path.join(dataDir, "other.json")
};

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]/gu;
const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~…—–]/g;

export function readPlatform(platform) {
  const file = platformFiles[platform];
  if (!file) throw new Error(`Unknown platform: ${platform}`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data.prompts)) {
    throw new Error(`${platform} file must contain a prompts array`);
  }
  return data;
}

export function writePlatform(platform, data) {
  const file = platformFiles[platform];
  if (!file) throw new Error(`Unknown platform: ${platform}`);
  const cleaned = {
    ...data,
    prompts: data.prompts.map((caption) => String(caption).trim()).filter(Boolean)
  };
  fs.writeFileSync(file, `${JSON.stringify(cleaned, null, 2)}\n`);
}

export function readAllCaptions() {
  const all = {};
  for (const platform of Object.keys(platformFiles)) {
    all[platform] = readPlatform(platform).prompts;
  }
  return all;
}

export function normalizeCaption(caption) {
  return String(caption)
    .toLowerCase()
    .replace(/\bwhat['’]?s\b/g, "whats")
    .replace(emojiRegex, " ")
    .replace(/\b(lol|lmao|haha|hehe|omg|pls|please)\b/g, " ")
    .replace(/\b(be honest|honestly)\b/g, "be honest")
    .replace(/\bgifs\b/g, "gif")
    .replace(/\bpictures\b/g, "picture")
    .replace(/\bphotos\b/g, "picture")
    .replace(/\bpic\b/g, "picture")
    .replace(punctuationRegex, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactCaption(caption) {
  return normalizeCaption(caption).replace(/\b(a|an|the|this|that|my|me|i|you|your|look|only)\b/g, " ").replace(/\s+/g, " ").trim();
}

export function similarityScore(a, b) {
  const left = new Set(compactCaption(a).split(" ").filter(Boolean));
  const right = new Set(compactCaption(b).split(" ").filter(Boolean));
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection++;
  }
  return intersection / Math.min(left.size, right.size);
}

export function hasStrongHook(caption) {
  const text = normalizeCaption(caption);
  return [
    /\bwrong answers only\b/,
    /\bwhat celebrity\b/,
    /\bwhich celebrity\b/,
    /\bwhich gif\b/,
    /\bwhich .+ gif\b/,
    /\bwhat job\b/,
    /\bwhat fake job\b/,
    /\bwhat car\b/,
    /\bwhat city\b/,
    /\bwhat country\b/,
    /\bwhat movie\b/,
    /\bwhat picture\b/,
    /\bwhat show\b/,
    /\bwhat song\b/,
    /\bwhat era\b/,
    /\bwhat .+ would\b/,
    /\bwhat does this look like\b/,
    /\bwhat warning label\b/,
    /\bwhere would\b/,
    /\bdescribe .+ with (one |a )?(gif|picture|image)\b/,
    /\breply with (a |the )?(gif|picture|image)\b/,
    /\bgive (this|me|my look).*(nickname|title|name)\b/,
    /\broast\b/,
    /\brank\b/,
    /\bguess\b/,
    /\bcaption this\b/,
    /\bfinish the sentence\b/,
    /\bchoose one\b/,
    /\bwho do i look like\b/,
    /\bwhat would you name\b/
  ].some((pattern) => pattern.test(text));
}

export function isBoringGeneric(caption) {
  const text = normalizeCaption(caption);
  const boringPatterns = [
    /^thoughts$/,
    /^thoughts on this$/,
    /^comment below$/,
    /^rate this$/,
    /^rate me$/,
    /^whats my vibe$/,
    /^how does this make you feel$/,
    /^what do you think$/,
    /^opinions$/,
    /^yes or no$/,
    /^like or pass$/,
    /^mood$/,
    /^vibes$/
  ];
  return boringPatterns.some((pattern) => pattern.test(text));
}

export function platformViolation(platform, caption) {
  const text = normalizeCaption(caption);
  if (platform === "tiktok" && /\bgif\b/.test(text)) {
    return "TikTok captions must ask for images/pictures, not GIFs";
  }
  if ((platform === "twitter" || platform === "other") && /\bgif\b/.test(text)) {
    return `${platform} captions should not use GIF prompts in this bank`;
  }
  return null;
}

export function validateCaption(platform, caption, existingByPlatform, acceptedSoFar = []) {
  const value = String(caption || "").trim();
  if (!value) return { ok: false, reason: "empty caption" };
  if (value.length > 140) return { ok: false, reason: "caption is too long" };
  if (isBoringGeneric(value)) return { ok: false, reason: "boring/generic prompt" };
  const platformError = platformViolation(platform, value);
  if (platformError) return { ok: false, reason: platformError };
  if (!hasStrongHook(value)) return { ok: false, reason: "missing strong interaction hook" };

  const normalized = normalizeCaption(value);
  const existing = existingByPlatform[platform] || [];
  const allPlatformCandidates = [...existing, ...acceptedSoFar.map((item) => item.caption)];
  if (allPlatformCandidates.some((candidate) => normalizeCaption(candidate) === normalized)) {
    return { ok: false, reason: "exact or emoji/punctuation-only duplicate" };
  }
  const near = allPlatformCandidates.find((candidate) => similarityScore(candidate, value) >= 0.88);
  if (near) return { ok: false, reason: `near-duplicate of: ${near}` };

  return { ok: true };
}

export function parseCandidateFile(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!raw || !Array.isArray(raw.captions)) {
    throw new Error("Candidate file must be JSON with a captions array");
  }
  return raw.captions.map((item) => {
    if (typeof item === "string") {
      return { platform: "instagram", caption: item };
    }
    return item;
  });
}

export function groupDuplicates(captions) {
  const groups = new Map();
  captions.forEach((caption, index) => {
    const key = normalizeCaption(caption);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ index, caption });
  });
  return [...groups.entries()].filter(([, items]) => items.length > 1);
}
