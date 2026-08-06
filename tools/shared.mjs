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
    /\bwhat gif describes\b/,
    /\bwhat reaction gif\b/,
    /\bwhat gif (would|explains)\b/,
    /\bwhat image describes\b/,
    /\bwhat picture explains\b/,
    /\bwhat job\b/,
    /\bwhat fake job\b/,
    /\bwhat car\b/,
    /\bwhat city\b/,
    /\bwhat country\b/,
    /\bwhat movie\b/,
    /\bwhat picture\b/,
    /\bwhat show\b/,
    /\bwhat song\b/,
    /\bwhat drink\b/,
    /\bwhat dessert\b/,
    /\bwhat perfume\b/,
    /\bwhat era\b/,
    /\bwhat city\b/,
    /\bwhat country\b/,
    /\bwhat .+ would\b/,
    /\bbe honest what\b/,
    /\bwhat does this look like\b/,
    /\bwhat warning label\b/,
    /\bwhere would\b/,
    /\bdescribe .+ with (one |a |an )?(gif|picture|image)\b/,
    /\breply with (a |the )?(gif|picture|image)\b/,
    /\bgive (this|me|my look).*(nickname|title|name)\b/,
    /\broast\b/,
    /\brank\b/,
    /\bguess\b/,
    /\bcaption this\b/,
    /\bfinish the sentence\b/,
    /\bwho do i look like\b/,
    /\bwhat cartoon character do i look like\b/,
    /\bwhat would you name\b/,
    /\bwhat would you say\b/,
    /\bwhere am i going\b/,
    /\bwhere are you taking me\b/,
    /\bwhat should i (name|caption)\b/,
    /\bwhat should someone comment\b/,
    /\bwhat would you (guess|assume|ask|save)\b/,
    /\bwhat would your\b/,
    /\bwhat would this look be called\b/,
    /\bwhat is my (red|green) flag\b/,
    /\bdescribe me in one word\b/,
    /\bdescribe this look in one word\b/,
    /\bwhat is the first word\b/,
    /\bwhat does this remind you of\b/,
    /\bsay the first thing\b/,
    /\bwould you\b/,
    /\bname this\b/,
    /\bone word\b/
  ].some((pattern) => pattern.test(text));
}

export function isCringeGeneric(caption) {
  const text = normalizeCaption(caption);
  const abstractLabels = [
    "adorable",
    "aesthetic",
    "branding",
    "calm",
    "chaos",
    "cute",
    "danger",
    "energy",
    "excellent",
    "expensive",
    "fashionable",
    "flex",
    "harmless",
    "iconic",
    "liability",
    "luxury",
    "main character",
    "paperwork",
    "problem",
    "rich",
    "risk",
    "romantic",
    "soft",
    "threat",
    "vibe"
  ];

  if (/^choose one\b/.test(text)) return true;
  if (/\bor both\b/.test(text)) return true;
  if (/\b(main character|legal problem|excellent branding|fashionable paperwork)\b/.test(text)) return true;
  if (/\b(cute|rich|soft|polite|romantic|financial|fashionable|calm)\s+(chaos|problem|threat|risk|liability|paperwork|danger|luxury)\b/.test(text)) return true;

  const abstractHits = abstractLabels.filter((label) => text.includes(label)).length;
  const hasConcreteFrame = /\b(celebrity|job|headline|city|country|movie|tv show|warning label|gif|picture|image|wrong answers only|where would|what does this look like|fake award|fake rumor)\b/.test(text);
  return abstractHits >= 2 && !hasConcreteFrame;
}

export function isConfusingNonsense(caption) {
  const text = normalizeCaption(caption);

  const randomPropContext = [
    "airport",
    "boarding pass",
    "bar coaster",
    "cab",
    "coffee receipt",
    "dinner receipt",
    "hotel",
    "keycard",
    "lobby",
    "parking ticket",
    "pool towel",
    "receipt",
    "room service",
    "snack",
    "taxi",
    "terminal",
    "valet"
  ];
  const randomProofWords = [
    "alibi",
    "evidence",
    "proof",
    "quick proof",
    "soft proof",
    "tiny proof"
  ];
  if (randomPropContext.some((word) => text.includes(word)) && randomProofWords.some((word) => text.includes(word))) return true;
  if (/\b(caption this|what would you|what picture|what gif).*\b(airport|hotel|receipt|snack|terminal|taxi|cab|lobby)\b/.test(text)) return true;

  const confusingPhrases = [
    "date spot",
    "date plan",
    "library card",
    "salon",
    "barista",
    "minibar",
    "hotel invoice",
    "invoice title",
    "charging to",
    "charge to",
    "too quiet",
    "too casual",
    "deny later"
  ];
  if (confusingPhrases.some((phrase) => text.includes(phrase))) return true;

  const outfitAsPersonPatterns = [
    /\bwhat (place|country|coffee shop|restaurant|lobby|hallway) would (this )?outfit\b/,
    /\bwhere would (this )?outfit (make|turn|get|be|get us|treat)\b/,
    /\bwhat .+ would (this )?outfit (make|claim|charge|lie|invent|outsource|cheat|use|overrule)\b/,
    /\bwhat fake (alibi|job) would (this )?outfit\b/,
    /\bwhat (board game|password) would (this )?outfit\b/
  ];
  if (outfitAsPersonPatterns.some((pattern) => pattern.test(text))) return true;

  const badWouldFrames = [
    /\bwhat .+ would .+ make too\b/,
    /\bwhat .+ would .+ claim on\b/,
    /\bwhat does this look like it would\b/,
    /\bwhat fake headline would .+ deny\b/,
    /\bwhat fake headline would (your|my) barista\b/
  ];
  return badWouldFrames.some((pattern) => pattern.test(text));
}

export function isUnnaturalEngagementBait(caption) {
  const text = normalizeCaption(caption);

  const allowedWrongAnswers = [
    /\bwhere am i going\b/,
    /\bwho do i look like\b/,
    /\bwhat celebrity do i look like\b/,
    /\bwhat job do i look like i have\b/,
    /\bwhat car do i look like i drive\b/,
    /\bbe honest what do i look like i do for work\b/,
    /\bbe honest what kind of car do i look like i drive\b/,
    /\bbe honest what celebrity do i look like\b/,
    /\bwhat did i just say\b/,
    /\bwhat am i thinking\b/,
    /\bwhat should i name this look\b/,
    /\bwhere would you take me\b/
  ];
  if (/\bwrong answers only\b/.test(text) && !allowedWrongAnswers.some((pattern) => pattern.test(text))) {
    return true;
  }

  const fakePropFrames = [
    "phone camera",
    "camera roll",
    "screen time",
    "front desk",
    "room going quiet",
    "lobby",
    "elevator",
    "escalator",
    "courtroom",
    "court hallway",
    "case file",
    "lawyer",
    "legal advice",
    "legal problem",
    "hr",
    "pr statement",
    "office printer",
    "office kitchen",
    "receptionist",
    "waiter",
    "bartender",
    "bouncer",
    "bank teller",
    "dmv",
    "school office",
    "restaurant restroom",
    "library entrance",
    "mall kiosk",
    "parking garage",
    "witness testimony",
    "witness statement",
    "saved screenshot",
    "screenshot evidence",
    "pinned evidence",
    "caption almost say",
    "notes app",
    "contacts list"
  ];
  if (fakePropFrames.some((phrase) => text.includes(phrase))) return true;

  const unnaturalPatterns = [
    /\bwhat gif (describes|explains) (my|the|this).*(camera|phone|room|desk|lobby|elevator|printer|dmv|bank|office|restaurant|screen time|comments)/,
    /\bwhich gif (describes|explains) (my|the|this).*(camera|phone|room|desk|lobby|elevator|printer|dmv|bank|office|restaurant|screen time|comments)/,
    /\bwhat (nickname|warning label|fake headline|fake rumor) would (the|my|this).*(front desk|camera|camera roll|elevator|lobby|office|restaurant|waiter|bartender|bouncer|receptionist|bank|dmv|notes app|contacts list)/,
    /\bwhat fake headline would (my|the|this) (group chat|contacts list|lobby|camera|receipt|sketch artist)/,
    /\bgive this (photo|selfie|outfit|look).*(courtroom|court|case file|suspect|witness|hr|incident|tabloid|documentary|presentation|project title|band name|text message|playlist)/,
    /\bcaption this like (it is|you are).*(court|lawyer|hr|presentation|evidence|screenshot)/,
    /\brank this from .*(legal|hr|pr statement|apology call|family meeting|emergency|witness|evidence)/,
    /\bwhat fake (job|award) would .*(outfit|look|caption|selfie|mirror)/,
    /\bwhat (job|job interview) would .*(outfit|look|photo|selfie)/,
    /\bwhat tv show would use this as evidence\b/,
    /\bwhat movie title would this selfie steal\b/
  ];
  return unnaturalPatterns.some((pattern) => pattern.test(text));
}

export function isHumanNaturalCaption(caption) {
  const text = normalizeCaption(caption);
  const naturalPatterns = [
    /\bdescribe me with (a |an )?(gif|picture|image)\b/,
    /\bdescribe my face with (a |an )?(gif|picture|image)\b/,
    /\bdescribe this look with (a |an )?(gif|picture|image)\b/,
    /\breply with the (gif|picture|image).*(reminds you|friend would send)\b/,
    /\bwhat (gif|picture|image) (would|explains|describes)\b/,
    /\bwhat gif describes me\b/,
    /\bwhat picture describes me\b/,
    /\bwhat image describes me\b/,
    /\breply with the picture that describes me\b/,
    /\breply with the image that describes me\b/,
    /\bwhat celebrity do i look like\b/,
    /\bwhat celebrity would i be\b/,
    /\bwho do i look like\b/,
    /\bwhat job do i look like i have\b/,
    /\bwhat car do i look like i drive\b/,
    /\bbe honest what do i look like i do for work\b/,
    /\bbe honest what kind of car do i look like i drive\b/,
    /\bbe honest what celebrity do i look like\b/,
    /\bwhere would you take me\b/,
    /\bwhere am i going dressed like this\b/,
    /\bwhere am i going\b/,
    /\bwhere are you taking me\b/,
    /\bwhere do i look like im going\b/,
    /\bwhat song do i look like\b/,
    /\bwhat song should be playing here\b/,
    /\bwhat drink do i look like i order\b/,
    /\bwhat dessert do i look like\b/,
    /\bwhat perfume do i look like i wear\b/,
    /\bwhat city do i look like i belong in\b/,
    /\bwhat country do i look like i belong in\b/,
    /\bwhat era do i look like i belong in\b/,
    /\bwhat color would you call this look\b/,
    /\bwhat should i name this outfit\b/,
    /\bwhat should i caption this\b/,
    /\bwhat should someone comment on this\b/,
    /\bwhat movie character do i look like\b/,
    /\bwhat cartoon character do i look like\b/,
    /\bgive (me|this look|this outfit) (a )?(nickname|name|title)\b/,
    /\bwrong answers only\b/,
    /\broast me\b/,
    /\broast this outfit\b/,
    /\broast this look\b/,
    /\brank this outfit\b/,
    /\brank this look\b/,
    /\bcaption this\b/,
    /\bdescribe me in one word\b/,
    /\bdescribe this look in one word\b/,
    /\bwhat is the first word that comes to mind\b/,
    /\bwhat .+ reminds you of\b/,
    /\bwhat would you reply to this\b/,
    /\bwhat would you say to this\b/,
    /\bwhat does this remind you of\b/,
    /\bsay the first thing you thought\b/,
    /\bwhat would you comment on this\b/,
    /\bwould you (trust|let|introduce)\b/,
    /\bwhat would you (guess|assume|ask|save)\b/,
    /\bwhat would you dare me to do\b/,
    /\bwhat would your\b/,
    /\bwhat would this look be called\b/,
    /\bwhat is my (red|green) flag\b/,
    /\bfinish the sentence\b/,
    /\bname this (era|look|outfit)\b/,
    /\bone word\b/
  ];
  return naturalPatterns.some((pattern) => pattern.test(text));
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
  if (isCringeGeneric(value)) return { ok: false, reason: "cringe/vague AI-coded prompt" };
  if (isConfusingNonsense(value)) return { ok: false, reason: "confusing/nonsense prompt" };
  if (isUnnaturalEngagementBait(value)) return { ok: false, reason: "unnatural engagement-bait prompt" };
  if (!isHumanNaturalCaption(value)) return { ok: false, reason: "not human/natural enough" };
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
