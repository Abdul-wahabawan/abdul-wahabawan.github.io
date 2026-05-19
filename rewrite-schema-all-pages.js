const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_URL = "https://geometry-dash-lite.io";
const SITE_NAME = "Geometry Dash Lite";

function toTitleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function normalizeUrl(urlOrPath) {
  if (!urlOrPath) return null;
  const value = String(urlOrPath).trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${BASE_URL}${value}`;
  return `${BASE_URL}/${value.replace(/^\.?\/*/, "")}`;
}

function extractFirst(text, regex) {
  const m = text.match(regex);
  return m ? m[1].trim() : "";
}

function getCanonical(html, relPath) {
  const fromTag = extractFirst(
    html,
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );
  if (fromTag) return normalizeUrl(fromTag);

  const noExt = relPath.replace(/\\/g, "/").replace(/index\.html$/i, "").replace(/\.html$/i, "");
  const pathname = noExt ? `/${noExt}` : "/";
  return `${BASE_URL}${pathname}`;
}

function buildBreadcrumb(canonicalUrl, pageTitle) {
  let pathname = "/";
  try {
    pathname = new URL(canonicalUrl).pathname || "/";
  } catch (_) {}
  const clean = pathname.replace(/\/+$/, "") || "/";
  const segments = clean === "/" ? [] : clean.split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/`,
    },
  ];

  let running = "";
  segments.forEach((seg, i) => {
    running += `/${seg}`;
    const isLast = i === segments.length - 1;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: isLast && pageTitle ? pageTitle : toTitleFromSlug(decodeURIComponent(seg)),
      item: `${BASE_URL}${running}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildSoftwareApplication(html, canonicalUrl) {
  const title = extractFirst(html, /<title>([\s\S]*?)<\/title>/i) || SITE_NAME;
  const description =
    extractFirst(
      html,
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i
    ) || `Play games online on ${SITE_NAME}.`;
  const imageRaw =
    extractFirst(
      html,
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) ||
    extractFirst(
      html,
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i
    );

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1250",
    },
  };

  const image = normalizeUrl(imageRaw);
  if (image) schema.image = image;
  return schema;
}

function schemaBlock(software, breadcrumb) {
  return (
    "\n<script type=\"application/ld+json\">\n" +
    JSON.stringify(software, null, 2) +
    "\n</script>\n" +
    "<script type=\"application/ld+json\">\n" +
    JSON.stringify(breadcrumb, null, 2) +
    "\n</script>\n"
  );
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walk(full, files);
    } else if (name.toLowerCase().endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walk(ROOT);
let updated = 0;

for (const file of htmlFiles) {
  const rel = path.relative(ROOT, file);
  const original = fs.readFileSync(file, "utf8");
  if (!/<\/head>/i.test(original)) continue;

  const canonical = getCanonical(original, rel);
  const software = buildSoftwareApplication(original, canonical);
  const pageTitle = extractFirst(original, /<title>([\s\S]*?)<\/title>/i) || SITE_NAME;
  const breadcrumb = buildBreadcrumb(canonical, pageTitle);

  // Remove old schema blocks that contain either target type.
  let next = original.replace(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?(SoftwareApplication|BreadcrumbList)[\s\S]*?<\/script>\s*/gi,
    ""
  );

  next = next.replace(/<\/head>/i, `${schemaBlock(software, breadcrumb)}</head>`);

  if (next !== original) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
  }
}

console.log(`Updated schema in ${updated} HTML files.`);
