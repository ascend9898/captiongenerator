let cache = {};
const counterBaseUrl = "https://countapi.mileshilliard.com/api/v1/hit";

async function nextPrompt(platform, prompts) {
  const counterKey = `ascend9898_captiongenerator_${platform}_v1`;
  const res = await fetch(`${counterBaseUrl}/${counterKey}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Shared counter unavailable");
  const data = await res.json();
  const value = Number.parseInt(data.value, 10);
  if (!Number.isFinite(value) || value < 1) throw new Error("Invalid shared counter value");
  const index = (value - 1) % prompts.length;
  return prompts[index];
}

async function loadPrompts(platform) {
  if (cache[platform]) return cache[platform];

  const res = await fetch(`data/${platform}.json`);
  const data = await res.json();

  cache[platform] = data.prompts;
  return data.prompts;
}

async function generate() {
  const platform = document.getElementById("platform").value;
  const output = document.getElementById("output");

  try {
    const prompts = await loadPrompts(platform);

    if (!prompts || prompts.length === 0) {
      output.innerText = "No prompts found.";
      return;
    }

    output.innerText = await nextPrompt(platform, prompts);

  } catch (err) {
    console.error(err);
    output.innerText = "Error loading prompt.";
  }
}

function copyPrompt() {
  const text = document.getElementById("output").innerText;

  navigator.clipboard.writeText(text);
}

document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("copyBtn").addEventListener("click", copyPrompt);
