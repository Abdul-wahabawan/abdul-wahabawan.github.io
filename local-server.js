const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rootAbs = path.resolve(root);
const port = 4567;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveSafePath(urlValue) {
  const rawPath = decodeURIComponent((urlValue || '/').split('?')[0]).replace(/\\/g, '/');
  const fullPath = path.resolve(rootAbs, `.${rawPath}`);
  return fullPath.startsWith(rootAbs) ? fullPath : null;
}

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
  fs.createReadStream(filePath)
    .on('error', () => {
      res.statusCode = 500;
      res.end('Server error');
    })
    .pipe(res);
}

function listDirectory(dirPath, requestPath, res) {
  fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      res.statusCode = 500;
      res.end('Server error');
      return;
    }

    entries.sort(
      (a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name),
    );

    const base = requestPath.endsWith('/') ? requestPath : `${requestPath}/`;
    const parent = base === '/' ? '' : `<li><a href="${base}..">..</a></li>`;
    const items = entries
      .map((entry) => {
        const suffix = entry.isDirectory() ? '/' : '';
        const href = `${base}${encodeURIComponent(entry.name)}${suffix}`;
        return `<li><a href="${href}">${escapeHtml(entry.name)}${suffix}</a></li>`;
      })
      .join('');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(
      `<!doctype html><meta charset="utf-8"><title>Index of ${escapeHtml(base)}</title><h1>Index of ${escapeHtml(base)}</h1><ul>${parent}${items}</ul>`,
    );
  });
}

http
  .createServer((req, res) => {
    const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const fullPath = resolveSafePath(req.url);

    if (!fullPath) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    fs.stat(fullPath, (err, stats) => {
      if (!err && stats.isFile()) {
        sendFile(fullPath, res);
        return;
      }

      if (!err && stats.isDirectory()) {
        const indexPath = path.join(fullPath, 'index.html');
        fs.stat(indexPath, (indexErr, indexStats) => {
          if (!indexErr && indexStats.isFile()) {
            sendFile(indexPath, res);
            return;
          }
          listDirectory(fullPath, requestPath, res);
        });
        return;
      }

      if (path.extname(fullPath) === '') {
        const htmlPath = `${fullPath}.html`;
        fs.stat(htmlPath, (htmlErr, htmlStats) => {
          if (!htmlErr && htmlStats.isFile()) {
            sendFile(htmlPath, res);
            return;
          }
          res.statusCode = 404;
          res.end('Not found');
        });
        return;
      }

      res.statusCode = 404;
      res.end('Not found');
    });
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`Serving all files on http://localhost:${port}`);
  });
