#!/bin/bash
# Quick start script for Volunteer Hours Tracker

echo "=========================================="
echo "  Volunteer Hours Tracker"
echo "=========================================="
echo ""
echo "Starting local web server..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server"
    echo "Server running at: http://localhost:8080"
    echo "Tests available at: http://localhost:8080/tests/test.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Using Python 2 HTTP server"
    echo "Server running at: http://localhost:8080"
    echo "Tests available at: http://localhost:8080/tests/test.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8080
else
    echo "ERROR: Python not found!"
    echo ""
    echo "Please install Python or use another HTTP server:"
    echo "  - Node.js: npx http-server -p 8080"
    echo "  - PHP: php -S localhost:8080"
    echo "  - Or open index.html directly in your browser"
    exit 1
fi
