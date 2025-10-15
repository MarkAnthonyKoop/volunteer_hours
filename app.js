/**
 * Volunteer Hours Tracker Application
 * A mobile-first web app for tracking volunteer hours with local storage persistence
 */

class VolunteerTracker {
    constructor() {
        this.entries = [];
        this.currentEditId = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.setDefaultDate();
        this.render();
    }

    /**
     * Load entries from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('volunteerEntries');
            if (stored) {
                this.entries = JSON.parse(stored);
                console.log(`Loaded ${this.entries.length} entries from storage`);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.showToast('Error loading saved data', 'error');
        }
    }

    /**
     * Save entries to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('volunteerEntries', JSON.stringify(this.entries));
            console.log(`Saved ${this.entries.length} entries to storage`);
        } catch (error) {
            console.error('Error saving to storage:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submission
        const form = document.getElementById('volunteer-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelEdit());

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e));

        // Filters
        document.getElementById('filter-org').addEventListener('change', () => this.renderEntriesList());
        document.getElementById('filter-category').addEventListener('change', () => this.renderEntriesList());
        document.getElementById('sort-by').addEventListener('change', () => this.renderEntriesList());

        // Export and clear
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('clear-all-btn').addEventListener('click', () => this.confirmClearAll());

        // Modal
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Refresh content when switching
        if (tabName === 'dashboard') {
            this.renderDashboard();
        } else if (tabName === 'history') {
            this.renderEntriesList();
        }
    }

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const dateInput = document.getElementById('entry-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today; // Prevent future dates
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const entry = {
            id: this.currentEditId || Date.now().toString(),
            date: formData.get('date'),
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
            this.showToast('Entry updated successfully', 'success');
        } else {
            // Add new entry
            this.entries.push(entry);
            this.showToast('Entry added successfully', 'success');
        }

        this.saveToStorage();
        this.resetForm();
        this.render();

        // Switch to history tab to show the new/updated entry
        this.switchTab('history');
    }

    /**
     * Reset the form
     */
    resetForm() {
        document.getElementById('volunteer-form').reset();
        this.setDefaultDate();
        this.currentEditId = null;
        document.getElementById('entry-id').value = '';
        document.getElementById('submit-btn').textContent = 'Add Entry';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    /**
     * Edit an entry
     */
    editEntry(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;

        this.currentEditId = id;

        // Fill form with entry data
        document.getElementById('entry-date').value = entry.date;
        document.getElementById('organization').value = entry.organization;
        document.getElementById('activity').value = entry.activity;
        document.getElementById('hours').value = entry.hours;
        document.getElementById('category').value = entry.category || '';
        document.getElementById('description').value = entry.description || '';
        document.getElementById('entry-id').value = id;

        // Update button text
        document.getElementById('submit-btn').textContent = 'Update Entry';
        document.getElementById('cancel-btn').style.display = 'block';

        // Switch to log tab
        this.switchTab('log');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.showToast('Editing entry', 'success');
    }

    /**
     * Cancel editing
     */
    cancelEdit() {
        this.resetForm();
        this.showToast('Edit cancelled', 'success');
    }

    /**
     * Delete an entry
     */
    deleteEntry(id) {
        this.showModal(
            'Delete Entry',
            'Are you sure you want to delete this volunteer entry? This action cannot be undone.',
            () => {
                this.entries = this.entries.filter(e => e.id !== id);
                this.saveToStorage();
                this.render();
                this.showToast('Entry deleted', 'success');
                this.hideModal();
            }
        );
    }

    /**
     * Confirm clear all entries
     */
    confirmClearAll() {
        if (this.entries.length === 0) {
            this.showToast('No entries to clear', 'error');
            return;
        }

        this.showModal(
            'Clear All Data',
            `Are you sure you want to delete all ${this.entries.length} volunteer entries? This action cannot be undone.`,
            () => {
                this.entries = [];
                this.saveToStorage();
                this.render();
                this.showToast('All entries cleared', 'success');
                this.hideModal();
            }
        );
    }

    /**
     * Export data as JSON
     */
    exportData() {
        if (this.entries.length === 0) {
            this.showToast('No data to export', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.entries, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `volunteer-hours-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully', 'success');
    }

    /**
     * Handle search input
     */
    handleSearch(e) {
        this.renderEntriesList();
    }

    /**
     * Get filtered and sorted entries
     */
    getFilteredEntries() {
        let filtered = [...this.entries];

        // Search filter
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(entry =>
                entry.organization.toLowerCase().includes(searchTerm) ||
                entry.activity.toLowerCase().includes(searchTerm) ||
                entry.description.toLowerCase().includes(searchTerm) ||
                (entry.category && entry.category.toLowerCase().includes(searchTerm))
            );
        }

        // Organization filter
        const orgFilter = document.getElementById('filter-org').value;
        if (orgFilter) {
            filtered = filtered.filter(e => e.organization === orgFilter);
        }

        // Category filter
        const categoryFilter = document.getElementById('filter-category').value;
        if (categoryFilter) {
            filtered = filtered.filter(e => e.category === categoryFilter);
        }

        // Sort
        const sortBy = document.getElementById('sort-by').value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'hours-desc':
                    return b.hours - a.hours;
                case 'hours-asc':
                    return a.hours - b.hours;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    /**
     * Calculate statistics
     */
    calculateStats() {
        const totalHours = this.entries.reduce((sum, entry) => sum + entry.hours, 0);
        const totalEntries = this.entries.length;

        // Get unique organizations
        const organizations = [...new Set(this.entries.map(e => e.organization))];
        const orgsCount = organizations.length;

        // Calculate this month's hours
        const now = new Date();
        const thisMonth = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() &&
                   entryDate.getFullYear() === now.getFullYear();
        }).reduce((sum, entry) => sum + entry.hours, 0);

        // Hours by organization
        const hoursByOrg = {};
        this.entries.forEach(entry => {
            hoursByOrg[entry.organization] = (hoursByOrg[entry.organization] || 0) + entry.hours;
        });

        // Sort organizations by hours
        const sortedOrgs = Object.entries(hoursByOrg)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10

        return {
            totalHours: totalHours.toFixed(1),
            totalEntries,
            orgsCount,
            thisMonth: thisMonth.toFixed(1),
            hoursByOrg: sortedOrgs
        };
    }

    /**
     * Render the entire application
     */
    render() {
        this.renderDashboard();
        this.renderEntriesList();
        this.updateFilters();
        this.updateOrgSuggestions();
    }

    /**
     * Render dashboard statistics
     */
    renderDashboard() {
        const stats = this.calculateStats();

        // Update header
        document.getElementById('total-hours').textContent = stats.totalHours;

        // Update stat cards
        document.getElementById('total-hours-stat').textContent = stats.totalHours;
        document.getElementById('total-entries-stat').textContent = stats.totalEntries;
        document.getElementById('orgs-count-stat').textContent = stats.orgsCount;
        document.getElementById('this-month-stat').textContent = stats.thisMonth;

        // Render organization chart
        this.renderOrgChart(stats.hoursByOrg);

        // Render recent activity
        this.renderRecentActivity();
    }

    /**
     * Render organization hours chart
     */
    renderOrgChart(hoursByOrg) {
        const container = document.getElementById('org-chart');

        if (hoursByOrg.length === 0) {
            container.innerHTML = '<p class="empty-state">No data yet</p>';
            return;
        }

        const maxHours = Math.max(...hoursByOrg.map(([_, hours]) => hours));

        container.innerHTML = hoursByOrg.map(([org, hours]) => {
            const percentage = (hours / maxHours) * 100;
            return `
                <div class="chart-bar">
                    <div class="chart-label">${this.escapeHtml(org)}</div>
                    <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                    <div class="chart-value">${hours.toFixed(1)}h</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render recent activity
     */
    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        const recent = [...this.entries]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent activity</p>';
            return;
        }

        container.innerHTML = recent.map(entry => `
            <div class="activity-item">
                <div class="activity-header">
                    <div class="activity-org">${this.escapeHtml(entry.organization)}</div>
                    <div class="activity-hours">${entry.hours}h</div>
                </div>
                <div class="activity-title">${this.escapeHtml(entry.activity)}</div>
                <div class="activity-date">${this.formatDate(entry.date)}</div>
            </div>
        `).join('');
    }

    /**
     * Render entries list
     */
    renderEntriesList() {
        const container = document.getElementById('entries-list');
        const entries = this.getFilteredEntries();

        if (entries.length === 0) {
            const message = this.entries.length === 0 ?
                'No volunteer entries yet. Start by logging your first volunteer hours!' :
                'No entries match your filters.';
            container.innerHTML = `<p class="empty-state">${message}</p>`;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="entry-card" data-id="${entry.id}">
                <div class="entry-header">
                    <div class="entry-org">${this.escapeHtml(entry.organization)}</div>
                    <div class="entry-hours">${entry.hours}h</div>
                </div>
                <div class="entry-activity">${this.escapeHtml(entry.activity)}</div>
                <div class="entry-meta">
                    <span class="entry-date">${this.formatDate(entry.date)}</span>
                    ${entry.category ? `<span class="entry-category">${this.escapeHtml(entry.category)}</span>` : ''}
                </div>
                ${entry.description ? `<div class="entry-description">${this.escapeHtml(entry.description)}</div>` : ''}
                <div class="entry-actions">
                    <button class="btn btn-secondary" onclick="app.editEntry('${entry.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteEntry('${entry.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update filter dropdowns
     */
    updateFilters() {
        // Organization filter
        const organizations = [...new Set(this.entries.map(e => e.organization))].sort();
        const orgFilter = document.getElementById('filter-org');
        orgFilter.innerHTML = '<option value="">All Organizations</option>' +
            organizations.map(org => `<option value="${this.escapeHtml(org)}">${this.escapeHtml(org)}</option>`).join('');

        // Category filter
        const categories = [...new Set(this.entries.map(e => e.category).filter(c => c))].sort();
        const categoryFilter = document.getElementById('filter-category');
        categoryFilter.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${this.escapeHtml(cat)}">${this.escapeHtml(cat)}</option>`).join('');
    }

    /**
     * Update organization suggestions datalist
     */
    updateOrgSuggestions() {
        const organizations = [...new Set(this.entries.map(e => e.organization))].sort();
        const datalist = document.getElementById('org-suggestions');
        datalist.innerHTML = organizations.map(org =>
            `<option value="${this.escapeHtml(org)}">`
        ).join('');
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;

        // Trigger reflow to restart animation
        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Show confirmation modal
     */
    showModal(title, message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;

        modal.classList.add('show');

        // Set up confirm handler
        const confirmBtn = document.getElementById('modal-confirm');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener('click', onConfirm);
    }

    /**
     * Hide modal
     */
    hideModal() {
        document.getElementById('confirm-modal').classList.remove('show');
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new VolunteerTracker();
    });
} else {
    app = new VolunteerTracker();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VolunteerTracker;
}
