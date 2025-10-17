#!/bin/bash
# Browser Helper - Opens all required URLs in tabs
# This gets you 90% of the way there

echo "🌐 Opening All Required URLs..."
echo ""

# Check if browser is available
if command -v xdg-open &> /dev/null; then
    BROWSER="xdg-open"
elif command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
elif command -v firefox &> /dev/null; then
    BROWSER="firefox"
else
    echo "❌ No browser found"
    echo ""
    echo "Manually open these URLs:"
    echo "1. https://developer.apple.com/programs/enroll/"
    echo "2. https://codemagic.io"
    echo "3. https://appstoreconnect.apple.com"
    exit 1
fi

echo "Using browser: $BROWSER"
echo ""

# Function to open URL
open_url() {
    echo "📂 Opening: $1"
    $BROWSER "$1" 2>/dev/null &
    sleep 2
}

# Open all required URLs
echo "Opening Apple Developer..."
open_url "https://developer.apple.com/programs/enroll/"

echo "Opening Codemagic..."
open_url "https://codemagic.io"

echo "Opening App Store Connect..."
open_url "https://appstoreconnect.apple.com"

echo ""
echo "✅ All URLs opened in browser"
echo ""
echo "📋 TODO CHECKLIST:"
echo ""
echo "TAB 1: Apple Developer (developer.apple.com)"
echo "  1. Click 'Start Your Enrollment'"
echo "  2. Sign in with Apple ID"
echo "  3. Choose 'Individual'"
echo "  4. Fill form and pay \$99"
echo "  5. Wait for approval email"
echo ""
echo "TAB 2: Codemagic (codemagic.io)"
echo "  1. Click 'Sign up free'"
echo "  2. Click 'Continue with GitHub'"
echo "  3. Authorize Codemagic"
echo "  4. Select 'volunteer_hours' repo"
echo "  5. Choose 'ios-workflow'"
echo ""
echo "TAB 3: App Store Connect (appstoreconnect.apple.com)"
echo "  (Do this AFTER Apple approves you)"
echo "  1. Go to Access > API"
echo "  2. Create new key: 'Codemagic' / 'Developer'"
echo "  3. Download .p8 file"
echo "  4. Copy Issuer ID and Key ID"
echo "  5. Paste into Codemagic settings"
echo ""
echo "⏱️  Total time: ~1 hour of clicking"
echo "Then wait for build (20 min) and install on iPhone!"
echo ""
