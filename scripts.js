let cache = {};

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

    const random = prompts[Math.floor(Math.random() * prompts.length)];

    output.innerText = random;

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