#!/bin/bash
# Automated Screenshot Capture Wrapper
# Captures all 34 screenshots for the Volunteer Hours Tracker documentation

set -e

echo "========================================"
echo "Screenshot Capture Setup"
echo "========================================"
echo ""

# Check if in correct directory
if [ ! -f "capture-screenshots.py" ]; then
    echo "❌ Error: Must run from docs/ directory"
    echo "   Run: cd docs && ./capture-all-screenshots.sh"
    exit 1
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "   Install Python 3 first"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ Error: pip3 is not installed"
    echo "   Install pip3 first"
    exit 1
fi

# Install requirements
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt -q
echo "✓ Dependencies installed"
echo ""

# Check if ChromeDriver is installed
if ! command -v chromedriver &> /dev/null; then
    echo "⚠ Warning: chromedriver not found in PATH"
    echo ""
    echo "Install ChromeDriver:"
    echo "  Ubuntu/Debian: sudo apt install chromium-chromedriver"
    echo "  macOS: brew install chromedriver"
    echo "  Or download from: https://chromedriver.chromium.org/"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if server is running
echo "🔍 Checking if app server is running..."
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "❌ Error: App server is not running at http://localhost:8080"
    echo ""
    echo "Start the server first:"
    echo "  cd .. && ./start-server.sh"
    echo ""
    exit 1
fi
echo "✓ Server is running"
echo ""

# Run the screenshot capture
echo "📸 Starting automated screenshot capture..."
echo "   This will take about 2-3 minutes"
echo ""
python3 capture-screenshots.py

echo ""
echo "✓ Screenshot capture complete!"
echo ""
echo "Next steps:"
echo "1. Review screenshots: ls -lh images/"
echo "2. Optimize images (optional): cd images && mogrify -quality 85 *.png"
echo "3. Manually capture mobile screenshot (tutorial-mobile-install.png)"
echo ""
