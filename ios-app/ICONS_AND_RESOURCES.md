# App Icons and Resources Guide

## Overview

iOS apps require specific icon sizes and resources for the App Store and device. This guide covers all required assets and how to generate them.

## Required Icons

### App Icon (Required for App Store)

iOS uses a single 1024x1024px icon that gets automatically resized for different contexts:

| Size | Purpose | Required |
|------|---------|----------|
| 1024x1024 | App Store listing | ✅ Yes |
| 180x180 | iPhone (3x) | ✅ Yes |
| 120x120 | iPhone (2x) | ✅ Yes |
| 167x167 | iPad Pro | ✅ Yes |
| 152x152 | iPad (2x) | ✅ Yes |
| 76x76 | iPad (1x) | ✅ Yes |
| 60x60 | iPhone settings | Optional |
| 40x40 | Spotlight | Optional |
| 29x29 | Settings | Optional |

### Launch Screen Images

iOS uses storyboards for launch screens. Our app will use a simple colored background with the app icon.

## Design Guidelines

### App Icon Design

**Current Theme:**
- Primary Color: `#4CAF50` (Green)
- Icon Style: Simple, flat design
- Visual: Volunteer/community theme

**Apple Requirements:**
- No transparency (must have solid background)
- Square format (1024x1024)
- No rounded corners (iOS adds these automatically)
- RGB color space (not CMYK)
- PNG format

**Recommended Design:**
```
- Background: Solid #4CAF50 (green)
- Icon: White star or hands symbol
- Style: Flat, minimalist
- Text: Avoid text in icons (use name instead)
```

### Launch Screen Design

**Current Splash Configuration (from capacitor.config.ts):**
```typescript
SplashScreen: {
  backgroundColor: "#4CAF50",
  showSpinner: false,
  splashFullScreen: true
}
```

Simple green background matching the brand color.

## Generating Icons

### Option 1: Use Online Icon Generator (Easiest)

**AppIcon.co** - Free iOS icon generator
- URL: https://www.appicon.co
- Upload 1024x1024 source image
- Download icon set
- Extract to ios/App/Assets.xcassets/AppIcon.appiconset/

**Steps:**
1. Create 1024x1024 PNG icon
2. Upload to AppIcon.co
3. Select "iOS"
4. Download zip
5. Extract to Xcode project

### Option 2: Use Capacitor Assets Generator

**Capacitor Assets Plugin** (Recommended for automation)

Install:
```bash
npm install -D @capacitor/assets
```

Create source icon:
```bash
# Place 1024x1024 icon as:
# resources/icon.png

# Generate all sizes:
npx capacitor-assets generate
```

This will automatically create all required icon sizes.

### Option 3: Manual Creation in GIMP/Photoshop

**Using GIMP (Free):**

1. Create base 1024x1024 image:
   ```
   File > New
   Width: 1024px
   Height: 1024px
   Resolution: 72 DPI
   Color Mode: RGB
   Fill: #4CAF50
   ```

2. Add icon element:
   - White star or hands symbol
   - Center it
   - Make it approximately 600x600px
   - Leave margins around edges

3. Export each required size:
   ```
   Image > Scale Image
   Width/Height: [target size]
   Interpolation: Cubic
   File > Export As > PNG
   ```

4. Required exports:
   - icon-1024.png (1024x1024) - App Store
   - icon-180.png (180x180) - iPhone 3x
   - icon-120.png (120x120) - iPhone 2x
   - icon-167.png (167x167) - iPad Pro
   - icon-152.png (152x152) - iPad 2x
   - icon-76.png (76x76) - iPad 1x

### Option 4: Use ImageMagick (Command Line)

**If you have a 1024x1024 source icon:**

```bash
# Install ImageMagick
sudo apt install imagemagick  # Linux
brew install imagemagick      # Mac

# Generate all sizes from source
convert icon-1024.png -resize 180x180 icon-180.png
convert icon-1024.png -resize 120x120 icon-120.png
convert icon-1024.png -resize 167x167 icon-167.png
convert icon-1024.png -resize 152x152 icon-152.png
convert icon-1024.png -resize 76x76 icon-76.png
```

## Creating a Simple Icon (Linux-Compatible)

Since you're on Linux, here's a simple SVG-based approach:

### SVG Icon Template

Save as `icon-template.svg`:

```svg
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#4CAF50"/>

  <!-- Star icon (volunteer/achievement symbol) -->
  <g transform="translate(512, 512)">
    <polygon
      points="0,-300 88,-92 305,-92 127,63 192,276 0,140 -192,276 -127,63 -305,-92 -88,-92"
      fill="white"
    />
  </g>

  <!-- Optional: Add subtle shadow for depth -->
  <g transform="translate(512, 512)" opacity="0.2">
    <polygon
      points="0,-280 88,-82 305,-82 127,73 192,286 0,150 -192,286 -127,73 -305,-82 -88,-82"
      fill="black"
    />
  </g>
</svg>
```

### Convert SVG to PNG using Inkscape (Linux)

```bash
# Install Inkscape
sudo apt install inkscape

# Convert SVG to 1024x1024 PNG
inkscape icon-template.svg \
  --export-filename=icon-1024.png \
  --export-width=1024 \
  --export-height=1024

# Generate all sizes
for size in 180 120 167 152 76; do
  inkscape icon-template.svg \
    --export-filename=icon-${size}.png \
    --export-width=${size} \
    --export-height=${size}
done
```

### Alternative: Use rsvg-convert

```bash
# Install librsvg
sudo apt install librsvg2-bin

# Convert to PNG
rsvg-convert -w 1024 -h 1024 icon-template.svg -o icon-1024.png
rsvg-convert -w 180 -h 180 icon-template.svg -o icon-180.png
rsvg-convert -w 120 -h 120 icon-template.svg -o icon-120.png
rsvg-convert -w 167 -h 167 icon-template.svg -o icon-167.png
rsvg-convert -w 152 -h 152 icon-template.svg -o icon-152.png
rsvg-convert -w 76 -h 76 icon-template.svg -o icon-76.png
```

## Icon Directory Structure

### Linux Development (Current)

```
ios-app/
├── icons/
│   ├── icon-1024.png      # App Store
│   ├── icon-180.png       # iPhone @3x
│   ├── icon-120.png       # iPhone @2x
│   ├── icon-167.png       # iPad Pro
│   ├── icon-152.png       # iPad @2x
│   └── icon-76.png        # iPad @1x
└── splash/
    └── splash-2732x2732.png  # Universal splash (optional)
```

### Mac Development (After `npx cap add ios`)

```
ios/App/App/
├── Assets.xcassets/
│   ├── AppIcon.appiconset/
│   │   ├── Contents.json
│   │   ├── AppIcon-1024.png
│   │   ├── AppIcon-180.png
│   │   ├── AppIcon-120.png
│   │   └── ... (all sizes)
│   └── Splash.imageset/
│       └── splash.png
└── Base.lproj/
    └── LaunchScreen.storyboard
```

## Adding Icons to Xcode Project

### Automatic (Recommended)

After running `npx cap add ios` on Mac:

1. Xcode will open automatically
2. Navigate to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
3. Drag and drop icons into corresponding slots
4. Xcode validates and shows warnings for missing sizes

### Manual Method

1. Open Xcode project
2. Select `Assets.xcassets` in Project Navigator
3. Click `AppIcon`
4. Drag each icon to its size slot:
   - iPhone App (iOS 14+): 60pt @2x, 60pt @3x
   - iPad App (iOS 14+): 76pt @1x, 76pt @2x, 83.5pt @2x
   - App Store: 1024pt @1x

### Using Capacitor Assets

```bash
# After installing @capacitor/assets

# 1. Create resources directory
mkdir -p resources

# 2. Place your 1024x1024 icon as:
cp icons/icon-1024.png resources/icon.png

# 3. Generate all assets
npx capacitor-assets generate --ios

# 4. Sync to Xcode project
npx cap sync ios
```

## Splash Screen Setup

### Current Configuration (Simple)

Our app uses a simple solid color splash screen (no images needed):

```typescript
// capacitor.config.ts
SplashScreen: {
  backgroundColor: "#4CAF50",
  showSpinner: false,
  splashFullScreen: true
}
```

### Adding Custom Splash Image (Optional)

If you want a custom splash screen with logo:

1. Create 2732x2732px PNG (largest iPad Pro size)
2. Place as `resources/splash.png`
3. Run `npx capacitor-assets generate --ios`
4. Or manually add to `ios/App/App/Assets.xcassets/Splash.imageset/`

**Splash Design Guidelines:**
- Safe area: Keep important content in center 1024x1024
- Background: #4CAF50
- Logo: Centered, white, ~400x400px
- Format: PNG with transparency OR solid background

## Pre-Generated Icon Set

I can create a basic icon set for you on Linux right now. Would you like:

**Option A: Star Icon** (volunteer/achievement theme)
- Green background (#4CAF50)
- White star symbol
- Simple, clean design

**Option B: Hands Icon** (helping/community theme)
- Green background (#4CAF50)
- White hands symbol
- Represents volunteering

**Option C: Clock/Hours Icon** (time tracking theme)
- Green background (#4CAF50)
- White clock symbol
- Represents hour tracking

## Validation Checklist

Before submitting to App Store:

- [ ] 1024x1024 icon created
- [ ] No transparency in icon
- [ ] Icon is in RGB color space
- [ ] All required sizes generated
- [ ] Icons added to Xcode Assets.xcassets
- [ ] App builds without icon warnings
- [ ] Icon appears correctly in simulator
- [ ] Splash screen configured
- [ ] Launch screen appears correctly

## Common Issues

### Icon Appears Black
- **Cause:** Transparency in PNG
- **Fix:** Ensure solid background color

### Icon Rejected by App Store
- **Cause:** Wrong dimensions or color space
- **Fix:** Verify 1024x1024 and RGB color mode

### Icon Not Updating in Simulator
- **Cause:** Xcode cache
- **Fix:** Clean build folder (Cmd+Shift+K), delete app from simulator

### Wrong Icon Sizes
- **Cause:** Manual resizing without proper interpolation
- **Fix:** Use ImageMagick or AppIcon.co for clean resizing

## Next Steps

### On Linux (Now)

1. Create icon design:
   ```bash
   cd ~/winefred/ios-app
   mkdir icons
   # Create SVG or design in GIMP
   ```

2. Generate all sizes:
   ```bash
   # Using Inkscape or rsvg-convert
   # See commands above
   ```

3. Verify icons:
   ```bash
   ls -lh icons/
   file icons/*.png  # Verify format and dimensions
   ```

### On Mac (Later)

1. Transfer icons directory to Mac
2. Run `npx cap add ios`
3. Add icons to Xcode project
4. Build and verify in simulator

## Resources

- [Apple Human Interface Guidelines - App Icon](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [AppIcon.co](https://www.appicon.co) - Free icon generator
- [Capacitor Assets Plugin](https://github.com/ionic-team/capacitor-assets)
- [Icon design tools](https://www.figma.com) - Figma (free tier)

---

**Status:** Ready to create icons on Linux
**Created:** 2025-10-16
**Recommended:** Use SVG + Inkscape method for Linux
