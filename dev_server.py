from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


class HtmlFallbackHandler(SimpleHTTPRequestHandler):
    """Serve static files and map extensionless paths to .html files."""

    def end_headers(self):
        self.send_header("X-Rewrite-Server", "1")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, path: str) -> str:
        translated = super().translate_path(path)
        parsed = urlsplit(path)
        request_path = unquote(parsed.path)

        if request_path in ("", "/"):
            return translated

        candidate = request_path.lstrip("/")
        route_name = Path(candidate).name
        if "." in route_name:
            return translated

        if Path(translated).exists():
            return translated

        html_path = super().translate_path(f"{request_path}.html")
        if Path(html_path).exists():
            return html_path

        return translated

    def send_head(self):
        parsed = urlsplit(self.path)
        request_path = unquote(parsed.path)

        # Keep default behavior for root and obvious file requests.
        if request_path not in ("", "/"):
            candidate = request_path.lstrip("/")
            file_path = Path(self.directory or ".") / candidate

            # If route has no extension and no physical file, try "<route>.html".
            if "." not in Path(candidate).name and not file_path.exists():
                html_candidate = Path(self.directory or ".") / f"{candidate}.html"
                if html_candidate.exists():
                    suffix = f"?{parsed.query}" if parsed.query else ""
                    self.path = f"/{candidate}.html{suffix}"

        return super().send_head()


def run(port: int = 4567):
    server = ThreadingHTTPServer(("127.0.0.1", port), HtmlFallbackHandler)
    print(f"Rewrite server running at http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
