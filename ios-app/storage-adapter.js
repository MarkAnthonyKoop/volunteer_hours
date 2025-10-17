/**
 * Storage Adapter - Unified storage interface for web and native platforms
 *
 * Automatically detects environment and uses:
 * - Capacitor Preferences API on iOS/Android
 * - localStorage on web browsers
 */

// Check if Capacitor is available
const isCapacitor = () => {
  return typeof window !== 'undefined' &&
         window.Capacitor !== undefined;
};

class StorageAdapter {
  /**
   * Set an item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store (must be string)
   * @returns {Promise<void>}
   */
  static async setItem(key, value) {
    if (isCapacitor()) {
      // Use Capacitor Preferences on native platforms
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key, value });
    } else {
      // Use localStorage on web
      localStorage.setItem(key, value);
    }
  }

  /**
   * Get an item from storage
   * @param {string} key - Storage key
   * @returns {Promise<string|null>} - Stored value or null if not found
   */
  static async getItem(key) {
    if (isCapacitor()) {
      // Use Capacitor Preferences on native platforms
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      // Use localStorage on web
      return localStorage.getItem(key);
    }
  }

  /**
   * Remove an item from storage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  static async removeItem(key) {
    if (isCapacitor()) {
      // Use Capacitor Preferences on native platforms
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key });
    } else {
      // Use localStorage on web
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all items from storage
   * @returns {Promise<void>}
   */
  static async clear() {
    if (isCapacitor()) {
      // Use Capacitor Preferences on native platforms
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.clear();
    } else {
      // Use localStorage on web
      localStorage.clear();
    }
  }

  /**
   * Get all keys from storage
   * @returns {Promise<string[]>} - Array of all keys
   */
  static async keys() {
    if (isCapacitor()) {
      // Use Capacitor Preferences on native platforms
      const { Preferences } = await import('@capacitor/preferences');
      const { keys } = await Preferences.keys();
      return keys;
    } else {
      // Use localStorage on web
      return Object.keys(localStorage);
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
   * Get platform information
   * @returns {Promise<Object>} - Platform details
   */
  static async getPlatform() {
    if (isCapacitor()) {
      const { Capacitor } = await import('@capacitor/core');
      return {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        version: '7.4.3'
      };
    } else {
      return {
        platform: 'web',
        isNative: false,
        version: 'N/A'
      };
    }
  }
}

// Export for ES modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageAdapter;
}
