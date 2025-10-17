# Building iOS App Without a Mac

## Overview

You can build and publish your Capacitor iOS app to the App Store **without owning a Mac** using cloud CI/CD services. This guide covers the best options as of 2025.

---

## ✅ Recommended: Codemagic

**Best option for Capacitor iOS builds without a Mac.**

### Pricing
- **Free Tier:** 500 macOS M2 build minutes/month
- **Pay-as-you-go:** ~$0.038/minute for macOS M2
- **Professional:** $299/month (unlimited builds, 3 concurrencies)

### Why Codemagic?
- ✅ Specifically supports Capacitor
- ✅ Free tier is generous (500 min/month)
- ✅ Can sign and publish to App Store
- ✅ Linux-based custom signing available
- ✅ Used by devs leaving Ionic Appflow
- ✅ Cost: One user went from $507/mo (Appflow) to <$20/mo

### Setup Steps

#### 1. Create Codemagic Account
```bash
# Visit: https://codemagic.io
# Sign up with GitHub/GitLab/Bitbucket
```

#### 2. Push Project to Git Repository
```bash
cd ~/winefred/ios-app
git init
git add .
git commit -m "Initial iOS app setup"
git remote add origin https://github.com/MarkAnthonyKoop/volunteer_hours
git push -u origin master
```

#### 3. Connect Repository to Codemagic
1. Log into Codemagic
2. Click "Add application"
3. Select your repository
4. Choose "Capacitor" as framework

#### 4. Configure codemagic.yaml

Create `codemagic.yaml` in project root:

```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 120
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.winefred.volunteerhours
      vars:
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      node: latest
    scripts:
      - name: Install npm dependencies
        script: |
          npm install
      - name: Cocoapods installation
        script: |
          cd ios/App && pod install
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      email:
        recipients:
          - markanthonykoop@gmail.com
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        submit_to_app_store: false
```

#### 5. Set Up Apple Certificates (One-Time)

**Option A: Let Codemagic Handle It (Easiest)**
1. In Codemagic dashboard: Settings > Code signing
2. Connect Apple Developer account
3. Codemagic auto-generates certificates

**Option B: Manual (More Control)**
1. Create Apple Developer account ($99/year)
2. Generate signing certificate and provisioning profile
3. Upload to Codemagic

#### 6. Trigger Build
```bash
git commit -m "Trigger iOS build"
git push

# Or manually trigger in Codemagic dashboard
```

#### 7. Download IPA or Auto-Publish
- Build completes in ~10-20 minutes
- Download .ipa file from artifacts
- OR: Auto-publish to App Store Connect (TestFlight/App Store)

---

## Alternative: GitHub Actions

**Cost:** Free tier includes some macOS minutes (macOS = 10x Linux minutes)

### Pros
- Free if you stay within limits
- Integrated with GitHub
- Full control

### Cons
- macOS minutes expensive (10x multiplier)
- More complex setup
- Manual code signing required
- No automatic App Store upload

### Setup

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Add iOS platform
      run: npx cap add ios

    - name: Install CocoaPods
      run: |
        cd ios/App
        pod install

    - name: Build iOS app
      run: |
        cd ios/App
        xcodebuild -workspace App.xcworkspace \
          -scheme App \
          -destination 'generic/platform=iOS' \
          -archivePath App.xcarchive \
          archive

    - name: Upload IPA
      uses: actions/upload-artifact@v3
      with:
        name: ios-app
        path: ios/App/App.xcarchive
```

**Note:** This builds but doesn't sign or publish. You'll need to add signing steps manually.

---

## Comparison: Cloud Build Services

| Service | Free Tier | Paid Plans | Capacitor Support | App Store Upload | Complexity |
|---------|-----------|------------|-------------------|------------------|------------|
| **Codemagic** | 500 min/mo | $299/mo | ✅ Native | ✅ Auto | Low |
| GitHub Actions | Limited | $0.08/min | ⚠️ Manual | ❌ Manual | High |
| Ionic Appflow | ❌ None | $499/mo | ✅ Native | ✅ Auto | Low |
| Bitrise | 45 min/mo | $40+/mo | ✅ Yes | ✅ Auto | Medium |
| CircleCI | 30k creds | Pay-as-go | ⚠️ Manual | ❌ Manual | High |

**Recommendation:** Start with Codemagic free tier (500 min/mo = ~25-50 builds)

---

## What You Still Need

Even with cloud builds, you still need:

### 1. Apple Developer Account ✅ Required
- **Cost:** $99/year
- **Purpose:** Code signing, App Store submission
- **Sign up:** https://developer.apple.com

### 2. App Icons (PNG) ⚠️ Pending
```bash
# On Linux:
sudo apt install librsvg2-bin
cd ~/winefred/ios-app/icons
./generate-icons.sh

# Commit icons to repo
git add icons/*.png
git commit -m "Add iOS app icons"
git push
```

### 3. iOS Platform Files ✅ Auto-Generated
- Codemagic can run `npx cap add ios` for you
- Or you can add it locally and commit

### 4. Signing Certificates ✅ Codemagic Handles
- Codemagic can auto-generate
- Or upload your own

---

## Step-by-Step: Build Your First iOS App (No Mac Needed)

### Phase 1: Preparation (30 minutes)

1. **Generate Icons**
   ```bash
   cd ~/winefred/ios-app/icons
   sudo apt install librsvg2-bin
   ./generate-icons.sh
   ```

2. **Add iOS Platform Locally (Optional)**
   ```bash
   # Skip this if you want Codemagic to do it
   # Only works if you have Xcode access
   ```

3. **Commit to Git**
   ```bash
   cd ~/winefred/ios-app
   git init
   git add .
   git commit -m "iOS app ready for cloud build"
   git push
   ```

### Phase 2: Codemagic Setup (1 hour)

1. **Create Account:** https://codemagic.io
2. **Connect Repository:** Link GitHub/GitLab
3. **Configure Build:** Use template above
4. **Apple Developer:**
   - Sign up at developer.apple.com ($99/year)
   - Connect to Codemagic

### Phase 3: First Build (15-30 minutes)

1. **Trigger Build:** Push to repo or manual trigger
2. **Wait:** ~10-20 minutes for build
3. **Review Logs:** Check for errors
4. **Download IPA:** From artifacts

### Phase 4: App Store Submission (1-2 days)

1. **Create App:** In App Store Connect
2. **Upload Build:** Via Codemagic auto-publish
3. **Add Metadata:** Screenshots, description
4. **Submit for Review:** Apple reviews in 1-2 weeks

---

## Cost Breakdown

### Option 1: Codemagic Free Tier + Apple Developer
- Codemagic: **$0/month** (500 min free)
- Apple Developer: **$99/year**
- **Total First Year: $99**
- **Total Annual: $99**

### Option 2: Codemagic Paid + Apple Developer
- Codemagic: **$299/month** (if you exceed free tier)
- Apple Developer: **$99/year**
- **Total First Year: $3,687**
- **Total Annual: $3,687**

### Option 3: Buy Used Mac + Apple Developer
- Mac: **$600-700** (one-time)
- Apple Developer: **$99/year**
- **Total First Year: $699-799**
- **Total Annual: $99**

**For Your Use Case:**
- If building occasionally: Use Codemagic free tier ($99/year total)
- If building frequently: Buy used Mac ($699 one-time, then $99/year)
- If building daily: Codemagic Professional ($299/month)

---

## Troubleshooting

### Build Fails: "No Xcode Project Found"
**Solution:** Run `npx cap add ios` first (can do in Codemagic script)

### Build Fails: "Signing Failed"
**Solution:** Check Apple Developer account connected, certificates valid

### Build Timeout
**Solution:** Free tier = 120min timeout, should be plenty. Check logs for hanging steps.

### App Store Upload Fails
**Solution:** Verify bundle ID matches, signing is distribution type

---

## Next Steps

1. ✅ Generate app icons (run `./icons/generate-icons.sh`)
2. ✅ Push project to GitHub
3. ✅ Sign up for Codemagic (free)
4. ✅ Sign up for Apple Developer ($99/year)
5. ✅ Configure Codemagic build
6. ✅ Trigger first build
7. ✅ Download IPA or publish to TestFlight
8. ✅ Submit to App Store

**You can do all of this from Linux without ever touching a Mac!**

---

## Resources

- **Codemagic Docs:** https://docs.codemagic.io/yaml-quick-start/building-a-capacitor-app/
- **Codemagic Capacitor Guide:** https://capgo.app/blog/automatic-capacitor-ios-build-codemagic/
- **Apple Developer:** https://developer.apple.com
- **App Store Connect:** https://appstoreconnect.apple.com

---

**Status:** Ready to build iOS app without Mac
**Recommended:** Codemagic free tier (500 min/month)
**Cost:** $99/year (Apple Developer only)
**Timeline:** 1-2 weeks to App Store
