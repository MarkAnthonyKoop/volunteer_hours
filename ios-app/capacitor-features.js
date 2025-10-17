/**
 * Capacitor Features Module
 * iOS-specific native features that enhance the app
 */

// Check if Capacitor is available
const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor !== undefined;
};

class CapacitorFeatures {
  /**
   * Export data using native file system
   * @param {string} filename - Name of file to save
   * @param {string} data - Data to save
   * @param {string} mimeType - MIME type (e.g., 'application/json')
   * @returns {Promise<boolean>} - Success status
   */
  static async exportToFile(filename, data, mimeType = 'application/json') {
    if (!isCapacitor()) {
      return false; // Fallback to web export
    }

    try {
      const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');

      await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      return true;
    } catch (error) {
      console.error('Native file export failed:', error);
      return false;
    }
  }

  /**
   * Share content using native share sheet
   * @param {string} title - Share title
   * @param {string} text - Text to share
   * @param {string} url - Optional URL to share
   * @returns {Promise<boolean>} - Success status
   */
  static async share(title, text, url = null) {
    if (!isCapacitor()) {
      return false; // Fallback to web share or nothing
    }

    try {
      const { Share } = await import('@capacitor/share');

      const shareOptions = {
        title: title,
        text: text,
        dialogTitle: 'Share via'
      };

      if (url) {
        shareOptions.url = url;
      }

      await Share.share(shareOptions);
      return true;
    } catch (error) {
      console.error('Native share failed:', error);
      return false;
    }
  }

  /**
   * Trigger haptic feedback
   * @param {string} type - Type of haptic (light, medium, heavy, success, warning, error)
   * @returns {Promise<void>}
   */
  static async haptic(type = 'medium') {
    if (!isCapacitor()) {
      return; // No haptic on web
    }

    try {
      const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
        default:
          await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  /**
   * Hide splash screen
   * @returns {Promise<void>}
   */
  static async hideSplash() {
    if (!isCapacitor()) {
      return;
    }

    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide();
    } catch (error) {
      console.error('Hide splash failed:', error);
    }
  }

  /**
   * Show splash screen
   * @returns {Promise<void>}
   */
  static async showSplash() {
    if (!isCapacitor()) {
      return;
    }

    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.show();
    } catch (error) {
      console.error('Show splash failed:', error);
    }
  }

  /**
   * Set status bar style
   * @param {string} style - 'light' or 'dark'
   * @returns {Promise<void>}
   */
  static async setStatusBarStyle(style = 'dark') {
    if (!isCapacitor()) {
      return;
    }

    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({
        style: style === 'light' ? Style.Light : Style.Dark
      });
    } catch (error) {
      console.error('Set status bar style failed:', error);
    }
  }

  /**
   * Get device info
   * @returns {Promise<Object>} - Device information
   */
  static async getDeviceInfo() {
    if (!isCapacitor()) {
      return {
        platform: 'web',
        model: 'Browser',
        manufacturer: navigator.userAgent
      };
    }

    try {
      const { Device } = await import('@capacitor/device');
      return await Device.getInfo();
    } catch (error) {
      console.error('Get device info failed:', error);
      return null;
    }
  }

  /**
   * Check if running on native platform
   * @returns {boolean}
   */
  static isNative() {
    return isCapacitor();
  }

  /**
   * Get platform name
   * @returns {string} - 'ios', 'android', or 'web'
   */
  static getPlatform() {
    if (!isCapacitor()) {
      return 'web';
    }

    const platform = window.Capacitor.getPlatform();
    return platform;
  }

  /**
   * Initialize all Capacitor features on app start
   * @returns {Promise<void>}
   */
  static async initialize() {
    if (!isCapacitor()) {
      console.log('Running on web - Capacitor features disabled');
      return;
    }

    console.log('Initializing Capacitor features...');

    try {
      // Set status bar style
      await this.setStatusBarStyle('dark');

      // Hide splash screen after app is ready
      setTimeout(() => this.hideSplash(), 2000);

      // Log platform info
      const platform = this.getPlatform();
      console.log(`Running on ${platform}`);

      const deviceInfo = await this.getDeviceInfo();
      console.log('Device info:', deviceInfo);

    } catch (error) {
      console.error('Capacitor initialization failed:', error);
    }
  }
}

// Export for ES modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CapacitorFeatures;
}
