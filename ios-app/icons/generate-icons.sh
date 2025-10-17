#!/bin/bash
# Generate iOS App Icons from SVG Template
# Requires: rsvg-convert (librsvg2-bin) or inkscape

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SVG_SOURCE="$SCRIPT_DIR/icon-template.svg"

# Icon sizes required for iOS
declare -A SIZES=(
  [1024]="App Store"
  [180]="iPhone @3x"
  [120]="iPhone @2x"
  [167]="iPad Pro"
  [152]="iPad @2x"
  [76]="iPad @1x"
)

echo "iOS Icon Generator"
echo "=================="
echo ""

# Check if source SVG exists
if [ ! -f "$SVG_SOURCE" ]; then
  echo "Error: SVG source not found: $SVG_SOURCE"
  exit 1
fi

# Detect available converter
CONVERTER=""
if command -v rsvg-convert &> /dev/null; then
  CONVERTER="rsvg"
  echo "Using: rsvg-convert"
elif command -v inkscape &> /dev/null; then
  CONVERTER="inkscape"
  echo "Using: inkscape"
else
  echo "Error: No SVG converter found!"
  echo ""
  echo "Please install one of:"
  echo "  - librsvg: sudo apt install librsvg2-bin"
  echo "  - inkscape: sudo apt install inkscape"
  exit 1
fi

echo ""
echo "Generating icons..."
echo ""

# Generate each size
for size in "${!SIZES[@]}"; do
  output="$SCRIPT_DIR/icon-${size}.png"
  description="${SIZES[$size]}"

  echo "  [$size x $size] $description"

  if [ "$CONVERTER" = "rsvg" ]; then
    rsvg-convert \
      -w "$size" \
      -h "$size" \
      "$SVG_SOURCE" \
      -o "$output"
  elif [ "$CONVERTER" = "inkscape" ]; then
    inkscape \
      "$SVG_SOURCE" \
      --export-filename="$output" \
      --export-width="$size" \
      --export-height="$size" \
      2>/dev/null
  fi

  # Verify output
  if [ -f "$output" ]; then
    file_size=$(du -h "$output" | cut -f1)
    echo "    ✓ Created: $output ($file_size)"
  else
    echo "    ✗ Failed to create: $output"
  fi
done

echo ""
echo "✓ Icon generation complete!"
echo ""
echo "Generated files:"
ls -lh "$SCRIPT_DIR"/*.png 2>/dev/null || echo "  No PNG files found"

echo ""
echo "Next steps:"
echo "1. Verify icons look correct:"
echo "   - Open icons/ directory"
echo "   - Check each PNG file visually"
echo ""
echo "2. Transfer to Mac when ready"
echo ""
echo "3. Add to Xcode project:"
echo "   - npx cap add ios"
echo "   - Open ios/App/App/Assets.xcassets/AppIcon.appiconset/"
echo "   - Drag icons into appropriate slots"
