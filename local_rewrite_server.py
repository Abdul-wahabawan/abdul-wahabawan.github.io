from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


class RewriteHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.path = self._rewrite_path(self.path)
        super().do_GET()

    def do_HEAD(self):
        self.path = self._rewrite_path(self.path)
        super().do_HEAD()

    @staticmethod
    def _rewrite_path(raw_path: str) -> str:
        parts = urlsplit(raw_path)
        request_path = unquote(parts.path)

        if request_path == "/":
            return raw_path

        relative = request_path.lstrip("/")
        request_file = Path(relative)

        # Match .htaccess behavior: if request is not a directory and
        # "<request>.html" exists, serve the HTML file.
        if (
            "." not in request_file.name
            and not request_file.is_dir()
            and Path(f"{relative}.html").is_file()
        ):
            rewritten = f"/{relative}.html"
            if parts.query:
                rewritten += f"?{parts.query}"
            return rewritten

        return raw_path


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 4567
    server = ThreadingHTTPServer((host, port), RewriteHandler)
    print(f"Serving with rewrite on http://{host}:{port}")
    server.serve_forever()
