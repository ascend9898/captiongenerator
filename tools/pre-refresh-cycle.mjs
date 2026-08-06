import fs from "node:fs";
import path from "node:path";
import { anchorPromptsForPlatform, platformHumanPrompts } from "./human-anchor-bank.mjs";
import { readPlatform, repoRoot, writePlatform } from "./shared.mjs";

const stateFile = path.join(repoRoot, "data", "refresh-state.json");
const resetEvery = 3;

function readState() {
  if (!fs.existsSync(stateFile)) return { cycles_since_anchor_reset: 0, total_cycles: 0 };
  return JSON.parse(fs.readFileSync(stateFile, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
}

function resetToAnchor() {
  for (const platform of Object.keys(platformHumanPrompts)) {
    const data = readPlatform(platform);
    data.prompts = anchorPromptsForPlatform(platform);
    writePlatform(platform, data);
  }
}

const state = readState();
state.total_cycles = Number(state.total_cycles || 0) + 1;
state.cycles_since_anchor_reset = Number(state.cycles_since_anchor_reset || 0) + 1;

if (state.cycles_since_anchor_reset >= resetEvery) {
  resetToAnchor();
  state.cycles_since_anchor_reset = 0;
  state.last_anchor_reset_cycle = state.total_cycles;
  console.log(`Anchor reset applied before cycle ${state.total_cycles}. Generate and merge a fresh batch before committing.`);
} else {
  console.log(`No anchor reset for cycle ${state.total_cycles}. Next reset in ${resetEvery - state.cycles_since_anchor_reset} cycle(s).`);
}

writeState(state);
