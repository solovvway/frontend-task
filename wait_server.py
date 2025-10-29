from http.server import BaseHTTPRequestHandler, HTTPServer
import time

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        time.sleep(float(100000))
        self.send_response(200)
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()

with HTTPServer(('', 8000), handler) as server:
    server.serve_forever()