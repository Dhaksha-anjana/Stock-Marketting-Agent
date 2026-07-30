"""
===============================================================================
AURUM AGENTIC AI - LOCAL HTTP WEB SERVER RUNNER
===============================================================================
Launches local web server for index.html at http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 80)
        print(f"🚀 AURUM AGENTIC AI LUXURY GOLD WEB APP RUNNING AT: {url}")
        print("=" * 80)
        print("Press Ctrl+C to stop server.\n")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
