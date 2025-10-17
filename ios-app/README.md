# Volunteer Hours Tracker - iOS App

Native iOS application built with Capacitor that wraps the Winefred Volunteer Hours Tracker web app.

## Overview

This iOS app provides:
- **Native iOS Storage** - Using Capacitor Preferences API instead of localStorage
- **Native File Export** - Save reports directly to iOS Documents folder
- **iOS Share Sheet** - Native sharing for reports
- **Haptic Feedback** - Tactile responses for user interactions
- **iOS Status Bar** - Customized appearance
- **Splash Screen** - Branded launch screen
- **100% Feature Parity** - All Phase 1 web app features work on iOS

## Project Structure

```
ios-app/
├── capacitor.config.ts          # Capacitor configuration
├── package.json                  # Dependencies
├── storage-adapter.js            # Unified storage abstraction
├── capacitor-features.js         # iOS native features wrapper
├── app-ios-enhanced.js           # Enhanced VolunteerTracker class
├── index.html                    # Symlink to ../index.html
├── app.js                        # Symlink to ../app.js
├── report-generator.js           # Symlink to ../report-generator.js
├── styles.css                    # Symlink to ../styles.css
└── manifest.json                 # Symlink to ../manifest.json
```

## Architecture

### Storage Adapter Pattern
```javascript
// Automatically detects platform and uses appropriate storage
await StorageAdapter.setItem('key', 'value');  // Preferences on iOS, localStorage on web
const value = await StorageAdapter.getItem('key');
```

### Capacitor Features Wrapper
```javascript
// iOS-specific features with graceful fallbacks
await CapacitorFeatures.haptic('success');
await CapacitorFeatures.share('Title', 'Content');
await CapacitorFeatures.exportToFile('filename.json', data);
```

### Class Inheritance
```javascript
// VolunteerTrackerIOS extends original VolunteerTracker
// Overrides storage methods for async native APIs
// Adds iOS-specific enhancements
```

## Development Workflow

### Phase 1: Linux/Windows (✅ COMPLETE)
Everything in this phase can be done without a Mac:

1. ✅ Install dependencies
   ```bash
   cd ~/winefred/ios-app
   npm install
   ```

2. ✅ Create Capacitor configuration
3. ✅ Implement storage adapter
4. ✅ Implement Capacitor features wrapper
5. ✅ Create iOS-enhanced app class
6. ✅ Test web version with new code

### Phase 2: Mac Required
These steps require Xcode and macOS:

1. **Transfer Project to Mac**
   ```bash
   # On Linux
   cd ~/winefred
   tar czf ios-app.tar.gz ios-app/

   # Transfer to Mac via USB, cloud, etc.

   # On Mac
   tar xzf ios-app.tar.gz
   cd ios-app
   npm install
   ```

2. **Add iOS Platform**
   ```bash
   npx cap add ios
   ```
   This creates the `ios/` directory with Xcode project.

3. **Open in Xcode**
   ```bash
   npx cap open ios
   ```

4. **Test in Simulator**
   - Select iPhone simulator in Xcode
   - Click Run button
   - Test all features

5. **Build for Device**
   - Connect iPhone via USB
   - Select your device in Xcode
   - Configure signing with Apple Developer account
   - Click Run button

6. **Prepare for App Store**
   - Archive build in Xcode
   - Upload to App Store Connect
   - Submit for review

## Testing

### Web Version Testing (Can do on Linux)
```bash
# Serve the app locally
python3 -m http.server 8000

# Open in browser
# http://localhost:8000

# Test that new async code works
# Verify storage adapter uses localStorage on web
# Check console for platform detection logs
```

### iOS Simulator Testing (Mac only)
- All features should work exactly like web version
- Plus: haptic feedback when tapping buttons
- Plus: native share sheet for reports
- Plus: native file export to Documents

### Device Testing (Mac + iPhone)
- Test on real iPhone hardware
- Verify haptics work correctly
- Test share sheet with actual apps
- Verify file export to Files app

## Dependencies

### Capacitor Core (v7.4.3)
```json
{
  "@capacitor/core": "^7.4.3",
  "@capacitor/cli": "^7.4.3",
  "@capacitor/ios": "^7.4.3"
}
```

### Capacitor Plugins (v7.0+)
```json
{
  "@capacitor/preferences": "^7.0.2",    // Native storage
  "@capacitor/filesystem": "^7.1.4",     // File operations
  "@capacitor/share": "^7.0.2",          // Share sheet
  "@capacitor/haptics": "^7.0.2",        // Haptic feedback
  "@capacitor/splash-screen": "^7.0.3",  // Launch screen
  "@capacitor/status-bar": "^7.0.3",     // Status bar
  "@capacitor/keyboard": "^7.0.3"        // Keyboard handling
}
```

## Mac Requirements

See [MAC_REQUIREMENTS.md](./MAC_REQUIREMENTS.md) for detailed information about:
- Minimum Mac hardware needed
- macOS version requirements
- Xcode version compatibility
- Alternative options (cloud Mac services)

**Short Answer:** Yes, an old MacBook can work if it runs macOS 12.5+ and Xcode 14+. See requirements doc for details.

## App Configuration

### App Identity
- **App ID:** `com.winefred.volunteerhours`
- **App Name:** `Volunteer Hours`
- **Minimum iOS:** 13.0+

### Colors
- **Primary:** `#4CAF50` (Green)
- **Splash Background:** `#4CAF50`
- **Status Bar:** Dark content on light background

### Capabilities Required
- File system access (Documents directory)
- Share sheet access
- Haptic engine access
- Keyboard management

## Build Configuration

### Debug Build (Development)
```bash
# In Xcode:
# Product > Scheme > Edit Scheme
# Run > Build Configuration > Debug

# Features:
# - Console logging enabled
# - Faster build times
# - Can run on simulator or device
```

### Release Build (App Store)
```bash
# In Xcode:
# Product > Archive

# Requirements:
# - Apple Developer account ($99/year)
# - Signing certificate configured
# - App Store Connect setup
# - Privacy policy URL
# - Screenshots for App Store
```

## Deployment Checklist

- [ ] Mac with Xcode installed
- [ ] Apple Developer account ($99/year)
- [ ] App icons created (1024x1024 required)
- [ ] Launch screen images
- [ ] Privacy policy published
- [ ] App Store description written
- [ ] Screenshots for all iPhone sizes
- [ ] Test on real iPhone device
- [ ] Archive and upload to App Store Connect
- [ ] Submit for App Store review

## Troubleshooting

### "Cannot find module '@capacitor/...'"
```bash
npm install
```

### "Capacitor is not defined"
On web: This is expected. Features gracefully degrade.
On iOS: Check that Capacitor is initialized in index.html

### "Storage not persisting"
Check browser console for storage errors.
Verify StorageAdapter is being used instead of direct localStorage.

### Xcode Build Errors
- Update to latest Xcode version
- Clean build folder (Product > Clean Build Folder)
- Delete DerivedData folder
- Run `npx cap sync ios`

## Support

### Documentation
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Plugin Reference](https://capacitorjs.com/docs/apis)
- [Apple Developer Portal](https://developer.apple.com)

### Related Files
- Parent web app: `~/winefred/`
- Migration report: `~/winefred/IOS_APP_MIGRATION_REPORT.md`
- Original app code: `~/winefred/app.js`

## License

Same as parent Winefred project.

## Timeline

- **Phase 1 (Linux):** ✅ Complete (1 day)
- **Phase 2 (Mac):** Estimated 2-4 weeks
  - 1-2 days: Mac setup and Xcode configuration
  - 3-5 days: Testing and debugging
  - 1-2 weeks: App Store submission and review

## Next Steps

1. Review this documentation
2. Acquire Mac meeting requirements (see MAC_REQUIREMENTS.md)
3. Transfer project to Mac
4. Run `npx cap add ios`
5. Open in Xcode
6. Test in simulator
7. Prepare App Store assets
8. Submit to App Store

---

**Status:** Ready for Mac development phase
**Created:** 2025-10-16
**Capacitor Version:** 7.4.3
**Minimum iOS:** 13.0+
