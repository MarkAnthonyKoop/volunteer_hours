/**
 * Volunteer Hours Tracker - iOS Enhanced Version
 * Wraps the original web app with Capacitor native features
 */

// Import storage adapter and Capacitor features
// Note: These will be loaded via script tags in HTML

/**
 * iOS-Enhanced Volunteer Tracker
 * Extends the original VolunteerTracker with native iOS features
 */
class VolunteerTrackerIOS extends VolunteerTracker {
  constructor() {
    super();
    this.isNative = false;
    this.platform = 'web';
  }

  /**
   * Initialize the application with Capacitor features
   */
  async init() {
    // Initialize Capacitor features first
    await this.initializeCapacitor();

    // Call parent init (will call our overridden loadFromStorage)
    await this.loadFromStorage();
    this.setupEventListeners();
    this.setDefaultDate();
    this.render();
    this.initializeReporting();
  }

  /**
   * Initialize Capacitor features
   */
  async initializeCapacitor() {
    try {
      // Check if Capacitor is available
      this.isNative = CapacitorFeatures.isNative();
      this.platform = CapacitorFeatures.getPlatform();

      if (this.isNative) {
        console.log(`Running on ${this.platform} with Capacitor`);

        // Initialize Capacitor features
        await CapacitorFeatures.initialize();

        console.log('Capacitor features initialized successfully');
      } else {
        console.log('Running on web - using standard localStorage');
      }
    } catch (error) {
      console.error('Failed to initialize Capacitor:', error);
      this.isNative = false;
      this.platform = 'web';
    }
  }

  /**
   * Load entries from storage (override to use StorageAdapter)
   */
  async loadFromStorage() {
    try {
      const stored = await StorageAdapter.getItem('volunteerEntries');
      if (stored) {
        this.entries = JSON.parse(stored);
        console.log(`Loaded ${this.entries.length} entries from ${this.isNative ? 'native' : 'web'} storage`);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.showToast('Error loading saved data', 'error');
    }
  }

  /**
   * Save entries to storage (override to use StorageAdapter)
   */
  async saveToStorage() {
    try {
      await StorageAdapter.setItem('volunteerEntries', JSON.stringify(this.entries));
      console.log(`Saved ${this.entries.length} entries to ${this.isNative ? 'native' : 'web'} storage`);
    } catch (error) {
      console.error('Error saving to storage:', error);
      this.showToast('Error saving data', 'error');
    }
  }

  /**
   * Handle form submission with haptic feedback (override)
   */
  async handleFormSubmit(e) {
    e.preventDefault();

    // Add haptic feedback on submit
    await CapacitorFeatures.haptic('light');

    const formData = new FormData(e.target);
    const entry = {
      id: this.currentEditId || Date.now().toString(),
      date: formData.get('date'),
      volunteer: formData.get('volunteer')?.trim() || 'Me',
      organization: formData.get('organization').trim(),
      activity: formData.get('activity').trim(),
      hours: parseFloat(formData.get('hours')),
      category: formData.get('category'),
      description: formData.get('description').trim(),
      createdAt: this.currentEditId ?
        this.entries.find(e => e.id === this.currentEditId).createdAt :
        new Date().toISOString()
    };

    if (this.currentEditId) {
      // Update existing entry
      const index = this.entries.findIndex(e => e.id === this.currentEditId);
      this.entries[index] = entry;
      await CapacitorFeatures.haptic('success');
      this.showToast('Entry updated successfully', 'success');
    } else {
      // Add new entry
      this.entries.push(entry);
      await CapacitorFeatures.haptic('success');
      this.showToast('Entry added successfully', 'success');
    }

    await this.saveToStorage();
    this.resetForm();
    this.render();

    // Switch to history tab to show the new/updated entry
    this.switchTab('history');
  }

  /**
   * Delete an entry with haptic feedback (override)
   */
  async deleteEntry(id) {
    this.showModal(
      'Delete Entry',
      'Are you sure you want to delete this volunteer entry? This action cannot be undone.',
      async () => {
        // Haptic feedback on delete
        await CapacitorFeatures.haptic('warning');

        this.entries = this.entries.filter(e => e.id !== id);
        await this.saveToStorage();
        this.render();

        await CapacitorFeatures.haptic('success');
        this.showToast('Entry deleted', 'success');
        this.hideModal();
      }
    );
  }

  /**
   * Export data with native file system (override)
   */
  async exportData() {
    if (this.entries.length === 0) {
      this.showToast('No data to export', 'error');
      return;
    }

    const dataStr = JSON.stringify(this.entries, null, 2);
    const filename = `volunteer-hours-${new Date().toISOString().split('T')[0]}.json`;

    // Try native file export first
    if (this.isNative) {
      const success = await CapacitorFeatures.exportToFile(filename, dataStr, 'application/json');

      if (success) {
        await CapacitorFeatures.haptic('success');
        this.showToast('Data exported to Documents folder', 'success');
        return;
      }
    }

    // Fallback to web export
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Data exported successfully', 'success');
  }

  /**
   * Share a report using native share sheet
   */
  async shareReport(reportContent, title = 'Volunteer Hours Report') {
    if (!this.isNative) {
      this.showToast('Share feature available on mobile app', 'error');
      return;
    }

    try {
      const success = await CapacitorFeatures.share(title, reportContent);
      if (success) {
        await CapacitorFeatures.haptic('success');
        this.showToast('Report shared', 'success');
      }
    } catch (error) {
      console.error('Share failed:', error);
      this.showToast('Failed to share report', 'error');
    }
  }

  /**
   * Generate report with share option (enhanced)
   */
  async generateReport() {
    if (this.entries.length === 0) {
      this.showToast('No entries to export', 'error');
      return;
    }

    // Update report generator data
    this.reportGenerator.setEntries(this.entries);

    const filters = this.getReportFilters();
    const format = document.querySelector('input[name="format"]:checked').value;

    const filtered = this.reportGenerator.filterEntries(filters);
    if (filtered.length === 0) {
      this.showToast('No entries match the selected filters', 'error');
      return;
    }

    const report = this.reportGenerator.generateReport(filters, format);

    // On native, offer to share in addition to download
    if (this.isNative && (format === 'txt' || format === 'md')) {
      // For text formats, offer share option
      await this.shareReport(report.content, 'Volunteer Hours Report');
    } else {
      // For other formats, download
      this.reportGenerator.downloadReport(report.content, report.filename, report.mimeType);
    }

    await CapacitorFeatures.haptic('success');
    this.showToast(`Report generated: ${filtered.length} entries`, 'success');
  }

  /**
   * Add share button to report form
   */
  enhanceReportForm() {
    if (!this.isNative) {
      return; // Only add on native platforms
    }

    // Add share button to report actions
    const reportActions = document.querySelector('.report-actions');
    if (reportActions && !document.getElementById('share-report-btn')) {
      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.id = 'share-report-btn';
      shareBtn.className = 'btn btn-secondary';
      shareBtn.textContent = 'Share Report';
      shareBtn.addEventListener('click', () => this.shareCurrentReport());
      reportActions.insertBefore(shareBtn, reportActions.firstChild);
    }
  }

  /**
   * Share current report preview
   */
  async shareCurrentReport() {
    const filters = this.getReportFilters();
    const filtered = this.reportGenerator.filterEntries(filters);

    if (filtered.length === 0) {
      this.showToast('No entries to share', 'error');
      return;
    }

    // Generate text format for sharing
    const report = this.reportGenerator.generateReport(filters, 'txt');
    await this.shareReport(report.content, 'Volunteer Hours Report');
  }

  /**
   * Initialize reporting with share button
   */
  initializeReporting() {
    super.initializeReporting();

    // Add share button if on native platform
    setTimeout(() => this.enhanceReportForm(), 100);
  }
}

// Initialize the iOS-enhanced app when DOM is ready
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    app = new VolunteerTrackerIOS();
    await app.init();
  });
} else {
  (async () => {
    app = new VolunteerTrackerIOS();
    await app.init();
  })();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VolunteerTrackerIOS;
}
