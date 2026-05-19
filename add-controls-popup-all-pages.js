const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const DEFAULT_CONTROLS = [
  "WASD / Arrow keys = move",
  "Mouse click / Tap = action",
  "Space = jump or dash",
  "Esc = pause / menu",
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(full, files);
    } else if (name.toLowerCase().endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function stripTags(input) {
  return String(input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(input) {
  return String(input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractControls(html) {
  const liMatches = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
  const candidates = liMatches
    .map((m) => stripTags(m[1]))
    .filter(Boolean)
    .filter((text) =>
      /(wasd|arrow|key|keys|click|tap|space|ctrl|shift|mouse|touch|jump|dash|attack|move|controls?)/i.test(
        text
      )
    )
    .slice(0, 6);

  if (!candidates.length) return DEFAULT_CONTROLS;
  return candidates.slice(0, 4);
}

function buildPopupMarkup(lines) {
  const items = lines
    .map((line) => `            <li>${escapeHtml(line)}</li>`)
    .join("\n");
  return [
    `<div class="player-controls-popup hide-share" id="player-controls-popup" aria-hidden="true">`,
    `    <button class="player-controls-popup__close" type="button" id="player-controls-close" aria-label="Close controls">×</button>`,
    `    <div class="player-controls-popup__title">Controls</div>`,
    `    <ul class="player-controls-popup__list">`,
    items,
    `    </ul>`,
    `</div>`,
  ].join("\n");
}

function insertControlsButton(html) {
  if (html.includes('data-action="controls"')) return html;
  return html.replace(
    /(\s*<button class="player-footer-btn" type="button" data-action="fullscreen"[\s\S]*?<\/button>)/i,
    [
      `                            <button class="player-footer-btn" type="button" data-action="controls" aria-label="Game controls" aria-expanded="false">`,
      `                                <span class="player-footer-btn__icon" aria-hidden="true">🎮</span>`,
      `                            </button>`,
      `$1`,
    ].join("\n")
  );
}

function insertControlsPopup(html) {
  if (html.includes('id="player-controls-popup"')) return html;
  const lines = extractControls(html);
  const popup = buildPopupMarkup(lines);
  return html.replace(
    /(<iframe id="iframehtml5"[\s\S]*?<\/iframe>)/i,
    `$1\n${popup}`
  );
}

let updated = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes('class="player-footer__actions')) continue;
  if (!src.includes('id="iframehtml5"')) continue;

  let next = src;
  next = insertControlsButton(next);
  next = insertControlsPopup(next);

  if (next !== src) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
  }
}

console.log(`Updated controls button/popup in ${updated} HTML files.`);
