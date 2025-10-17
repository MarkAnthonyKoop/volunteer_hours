# iOS App Icons

This directory contains the app icon assets for the Volunteer Hours Tracker iOS app.

## Current Status

**Icon Template:** ✅ Created (`icon-template.svg`)
**PNG Icons:** ⏳ Pending generation (requires SVG conversion tools)

## Quick Start

### Generate Icons (Linux)

```bash
# Option 1: Install rsvg-convert (recommended)
sudo apt install librsvg2-bin
./generate-icons.sh

# Option 2: Install Inkscape
sudo apt install inkscape
./generate-icons.sh
```

### Generated Files

After running `generate-icons.sh`, you'll have:

```
icons/
├── icon-1024.png    # 1024x1024 - App Store
├── icon-180.png     # 180x180 - iPhone @3x
├── icon-120.png     # 120x120 - iPhone @2x
├── icon-167.png     # 167x167 - iPad Pro
├── icon-152.png     # 152x152 - iPad @2x
└── icon-76.png      # 76x76 - iPad @1x
```

## Icon Design

**Current Design:**
- Background: #4CAF50 (brand green)
- Symbol: White star (representing volunteer achievement)
- Text: "VH" (Volunteer Hours)
- Style: Flat, modern, clean

**Design Rationale:**
- ⭐ Star: Universal symbol for achievement/excellence
- 🟢 Green: Positive, growth, community
- VH: Clear abbreviation of app name
- Simple: Recognizable at small sizes

## Customizing the Icon

Edit `icon-template.svg` in any SVG editor:

**Linux:**
- Inkscape (free): `sudo apt install inkscape`
- GIMP (supports SVG)

**Mac:**
- Sketch, Figma, Adobe Illustrator
- Preview (limited editing)

**Web-based:**
- Figma (free tier)
- Canva (free tier)

## Using Icons in Xcode (Mac Only)

After generating icons, transfer to Mac and:

```bash
# 1. Add iOS platform (creates Xcode project)
npx cap add ios

# 2. Icons location will be:
# ios/App/App/Assets.xcassets/AppIcon.appiconset/

# 3. Manual method:
# - Open Xcode: npx cap open ios
# - Navigate to Assets.xcassets > AppIcon
# - Drag each icon to its size slot

# 4. Automatic method (if @capacitor/assets installed):
mkdir -p resources
cp icon-1024.png resources/icon.png
npx capacitor-assets generate --ios
```

## Validation

Before submitting to App Store, verify:

- [ ] All icons generated successfully
- [ ] No transparency in any PNG
- [ ] Dimensions are exact (use `file` command)
- [ ] RGB color space (not CMYK)
- [ ] Icons appear correctly in Xcode
- [ ] App builds without warnings
- [ ] Icon looks good in simulator

### Check Icon Details

```bash
# Verify dimensions and format
for icon in *.png; do
  echo "=== $icon ==="
  file "$icon"
  identify "$icon" 2>/dev/null || echo "ImageMagick not installed"
done
```

## Alternative: Online Generator

If you can't install SVG tools, use an online generator:

1. **AppIcon.co** (recommended)
   - URL: https://www.appicon.co
   - Upload icon-template.svg or any 1024x1024 PNG
   - Select "iOS" platform
   - Download zip with all sizes
   - Extract to this directory

2. **MakeAppIcon**
   - URL: https://makeappicon.com
   - Similar process

3. **AppIconizer**
   - URL: https://appicon.build
   - Free, no registration

## Troubleshooting

### SVG Conversion Tools Not Found

```bash
# Install rsvg-convert (recommended)
sudo apt install librsvg2-bin

# Or install Inkscape
sudo apt install inkscape

# Verify installation
which rsvg-convert
which inkscape
```

### Icons Look Blurry

- Ensure source SVG is vector (not embedded raster)
- Use high-quality conversion settings
- Check that PNG is actual size (not scaled up)

### Wrong Dimensions

```bash
# Check actual size
file icon-1024.png
# Should output: PNG image data, 1024 x 1024...

# Or use ImageMagick
identify icon-1024.png
```

### Transparency Issues

Apple requires no transparency. Our icon has solid background, so this shouldn't be an issue. Verify:

```bash
# Check if image has alpha channel
identify -verbose icon-1024.png | grep -i alpha
# Should show: Alpha: undefined (no transparency)
```

## Design Alternatives

If you want to change the design, here are some ideas:

### Alternative 1: Clock Icon
- Represents time/hours tracking
- Replace star with clock face
- Keep green background

### Alternative 2: Hands Icon
- Represents helping/community
- Two hands reaching/shaking
- Keep green background

### Alternative 3: Heart Icon
- Represents caring/volunteering
- Simple heart shape
- Keep green background

To implement, edit `icon-template.svg` and change the `<polygon>` or add new shapes.

## Next Steps

1. ✅ Icon template created
2. ⏳ Install SVG conversion tools
3. ⏳ Run `./generate-icons.sh`
4. ⏳ Verify all PNGs generated
5. ⏳ Transfer to Mac
6. ⏳ Add to Xcode project
7. ⏳ Build and test

---

**Created:** 2025-10-16
**Status:** Template ready, pending PNG generation
**Tools Needed:** rsvg-convert or inkscape
