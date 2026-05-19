const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE = "https://geometry-dash-lite.io";

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

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtml(input) {
  return String(input || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function normalizeSpaces(input) {
  return decodeHtml(input).replace(/\s+/g, " ").trim();
}

function slugFromFile(relPath) {
  const unix = relPath.replace(/\\/g, "/");
  const name = unix.replace(/\.html$/i, "");
  if (name.toLowerCase() === "index") return "/";
  return `/${name}`;
}

function titleFromDoc(html) {
  const footerTitle = html.match(
    /<div class="player-footer__left[\s\S]*?<h2>([\s\S]*?)<\/h2>/i
  );
  if (footerTitle) return normalizeSpaces(footerTitle[1]);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return normalizeSpaces(h1[1]);
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  return t ? normalizeSpaces(t[1]) : "";
}

function buildCandidates(title, slug) {
  const out = [];
  const seen = new Set();
  const add = (v) => {
    const value = normalizeSpaces(v);
    if (!value) return;
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(value);
  };

  add(title);

  const slugWords = slug
    .replace(/^\//, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.trim());
  if (slugWords.length) {
    add(slugWords.map((w) => w[0].toUpperCase() + w.slice(1)).join(" "));
    add(slugWords[0]);
  }
  return out;
}

function replaceInTextNodes(html, matcher, makeReplacement) {
  const parts = String(html).split(/(<[^>]+>)/g);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("<")) continue;
    const m = parts[i].match(matcher);
    if (!m) continue;
    parts[i] = parts[i].replace(matcher, (...args) => makeReplacement(...args));
    return { changed: true, value: parts.join("") };
  }
  return { changed: false, value: html };
}

function injectSelfLinkIntoFirstParagraph(html, pageUrl, candidates) {
  const contentMatch = html.match(/<div class="game__content">([\s\S]*?)<\/div>/i);
  if (!contentMatch) return { changed: false, html };

  const block = contentMatch[1];
  const pMatch = block.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch) return { changed: false, html };

  const firstPInner = pMatch[1];
  if (/<a\b/i.test(firstPInner)) return { changed: false, html };

  let newInner = firstPInner;
  let replaced = false;

  // 1) Prefer candidate at paragraph start.
  for (const candidate of candidates) {
    const startRegex = new RegExp(
      `^(\\s*(?:&nbsp;|\\u00a0|\\s)*)(${escapeRegex(candidate)})(\\b)`,
      "i"
    );
    const attempt = replaceInTextNodes(
      newInner,
      startRegex,
      (_all, lead, word, tail) =>
        `${lead}<a href="${pageUrl}" title="${word}">${word}</a>${tail}`
    );
    if (attempt.changed) {
      newInner = attempt.value;
      replaced = true;
      break;
    }
  }

  // 2) Fallback: first occurrence of first keyword in paragraph text.
  if (!replaced && candidates.length) {
    const fallbackWord = candidates[candidates.length - 1];
    const anywhereRegex = new RegExp(`\\b(${escapeRegex(fallbackWord)})\\b`, "i");
    const attempt = replaceInTextNodes(
      newInner,
      anywhereRegex,
      (_all, word) => `<a href="${pageUrl}" title="${word}">${word}</a>`
    );
    if (attempt.changed) {
      newInner = attempt.value;
      replaced = true;
    }
  }

  if (!replaced) return { changed: false, html };

  const updatedBlock = block.replace(pMatch[0], pMatch[0].replace(firstPInner, newInner));
  const updatedHtml = html.replace(contentMatch[0], `<div class="game__content">${updatedBlock}</div>`);
  return { changed: true, html: updatedHtml };
}

let touchedFiles = 0;
let changedParagraphs = 0;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, "utf8");

  // Game detail pages in this project always include iframe + game content block.
  if (!src.includes('id="iframehtml5"') || !src.includes('class="game__content"')) continue;

  const slug = slugFromFile(rel);
  const pageUrl = `${BASE}${slug === "/" ? "/" : slug}`;
  const title = titleFromDoc(src);
  const candidates = buildCandidates(title, slug);
  const result = injectSelfLinkIntoFirstParagraph(src, pageUrl, candidates);

  if (result.changed) {
    fs.writeFileSync(file, result.html, "utf8");
    touchedFiles += 1;
    changedParagraphs += 1;
  }
}

console.log(`Updated first-paragraph self-links in ${touchedFiles} files.`);
console.log(`Paragraphs changed: ${changedParagraphs}.`);
