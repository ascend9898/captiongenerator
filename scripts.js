let cache = {};

function nextPrompt(platform, prompts) {
  const key = `captiongenerator:${platform}:nextIndex`;
  const current = Number.parseInt(localStorage.getItem(key) || "0", 10);
  const index = Number.isFinite(current) ? current % prompts.length : 0;
  localStorage.setItem(key, String((index + 1) % prompts.length));
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

    output.innerText = nextPrompt(platform, prompts);

  } catch (err) {
    console.error(err);
    output.innerText = "Error loading prompts.";
  }
}

function copyPrompt() {
  const text = document.getElementById("output").innerText;

  navigator.clipboard.writeText(text);
}

document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("copyBtn").addEventListener("click", copyPrompt);
