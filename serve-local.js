const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const host = "127.0.0.1";
const port = 4567;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
};

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const normalized = cleanPath.replace(/^\/+/, "");

  const direct = path.join(rootDir, normalized);
  if (fileExists(direct)) return direct;

  if (!path.extname(normalized)) {
    const htmlCandidate = path.join(rootDir, `${normalized}.html`);
    if (fileExists(htmlCandidate)) return htmlCandidate;

    const indexCandidate = path.join(rootDir, normalized, "index.html");
    if (fileExists(indexCandidate)) return indexCandidate;
  }

  const rootIndex = path.join(rootDir, "index.html");
  if (fileExists(rootIndex)) return rootIndex;

  return null;
}

http
  .createServer((req, res) => {
    const targetPath = resolvePath(req.url);

    if (!targetPath) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    fs.readFile(targetPath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`Local server running at http://${host}:${port}`);
  });
