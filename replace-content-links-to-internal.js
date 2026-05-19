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

function stripTags(text) {
  return String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntitiesLite(input) {
  return String(input || "")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function getTitleAttr(attrs) {
  const m = String(attrs || "").match(/\btitle=(["'])([\s\S]*?)\1/i);
  return m ? decodeEntitiesLite(m[2]) : "";
}

function isBadHref(href) {
  const value = String(href || "").trim();
  if (!value) return true;
  if (value === "#") return true;
  if (/^javascript:/i.test(value)) return true;
  if (/^mailto:/i.test(value)) return true;
  if (/^tel:/i.test(value)) return true;
  if (/^https?:\/\//i.test(value) && !/https?:\/\/(www\.)?geometry-dash-lite\.io\b/i.test(value)) return true;
  if (/^\/\//.test(value) && !/\/\/(www\.)?geometry-dash-lite\.io\b/i.test(value)) return true;
  return false;
}

function chooseInternalUrl(hintText) {
  const t = String(hintText || "").toLowerCase();
  if (!t) return "/new-games";
  if (t.includes("hot")) return "/hot-games";
  if (t.includes("new")) return "/new-games";
  if (t.includes("color")) return "/games/color-games";
  if (t.includes("hypercasual")) return "/games/hypercasual-games";
  if (t.includes("running")) return "/games/running-games";
  if (t.includes("racing")) return "/games/racing-games";
  if (t.includes("privacy")) return "/privacy-policy";
  if (t.includes("term")) return "/term-of-use";
  if (t.includes("contact")) return "/contact-us";
  if (t.includes("about")) return "/about-us";
  if (t.includes("copyright") || t.includes("dmca")) return "/copyright-infringement-notice-procedure";
  if (t.includes("home")) return "/";
  if (t.includes("game")) return "/new-games";
  return "/hot-games";
}

const files = walk(ROOT);
let updatedFiles = 0;
let replacedLinks = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  // Only touch site content pages, avoid third-party embedded game internals.
  const isContentLike =
    !rel.startsWith("games/") ||
    rel === "games/color-games.html" ||
    rel === "games/hypercasual-games.html" ||
    rel === "games/running-games.html" ||
    rel === "games/racing-games.html";
  if (!isContentLike) continue;

  const original = fs.readFileSync(file, "utf8");
  if (!/game__content|article|content-box/i.test(original)) continue;

  let changed = false;
  const next = original.replace(
    /<a\b([^>]*?)\bhref=(["'])([\s\S]*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (full, before, q, href, after, inner) => {
      if (!isBadHref(href)) return full;
      const title = getTitleAttr(`${before} ${after}`);
      const text = stripTags(inner);
      const hint = `${title} ${text}`.trim();
      const replacement = chooseInternalUrl(hint);
      changed = true;
      replacedLinks += 1;
      return `<a${before}href=${q}${replacement}${q}${after}>${inner}</a>`;
    }
  );

  if (changed && next !== original) {
    fs.writeFileSync(file, next, "utf8");
    updatedFiles += 1;
  }
}

console.log(`Updated ${updatedFiles} files, replaced ${replacedLinks} links.`);
console.log(`Base domain used: ${BASE}`);
