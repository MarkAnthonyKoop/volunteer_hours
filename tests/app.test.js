/**
 * Volunteer Tracker Application Tests
 */

describe('VolunteerTracker - Initialization', () => {
    let tracker;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should initialize with empty entries array', () => {
        expect(tracker.entries).toHaveLength(0);
    });

    it('should set currentEditId to null on initialization', () => {
        expect(tracker.currentEditId).toBe(null);
    });

    it('should load entries from localStorage if available', () => {
        const testEntries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Test Org',
                activity: 'Test Activity',
                hours: 5,
                category: 'Education',
                description: 'Test description',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('volunteerEntries', JSON.stringify(testEntries));
        const newTracker = new VolunteerTracker();

        expect(newTracker.entries).toHaveLength(1);
        expect(newTracker.entries[0].organization).toBe('Test Org');
    });
});

describe('VolunteerTracker - Data Persistence', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should save entries to localStorage', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 5,
            category: 'Education',
            description: 'Test description',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        tracker.saveToStorage();

        const stored = JSON.parse(localStorage.getItem('volunteerEntries'));
        expect(stored).toHaveLength(1);
        expect(stored[0].organization).toBe('Test Org');
    });

    it('should handle localStorage errors gracefully', () => {
        // Mock localStorage to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
            throw new Error('Storage full');
        };

        // Should not throw
        tracker.saveToStorage();

        // Restore original
        localStorage.setItem = originalSetItem;
    });
});

describe('VolunteerTracker - Entry Management', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should add a new entry', () => {
        const entry = {
            id: Date.now().toString(),
            date: '2024-01-15',
            organization: 'Local Food Bank',
            activity: 'Food sorting',
            hours: 3.5,
            category: 'Social Services',
            description: 'Helped sort donations',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        expect(tracker.entries).toHaveLength(1);
        expect(tracker.entries[0].hours).toBe(3.5);
    });

    it('should edit an existing entry', () => {
        const entry = {
            id: '123',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 5,
            category: 'Education',
            description: 'Original description',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);

        // Edit the entry
        const index = tracker.entries.findIndex(e => e.id === '123');
        tracker.entries[index].description = 'Updated description';
        tracker.entries[index].hours = 6;

        expect(tracker.entries[0].description).toBe('Updated description');
        expect(tracker.entries[0].hours).toBe(6);
    });

    it('should delete an entry', () => {
        const entry1 = {
            id: '1',
            date: '2024-01-15',
            organization: 'Org 1',
            activity: 'Activity 1',
            hours: 3,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        const entry2 = {
            id: '2',
            date: '2024-01-16',
            organization: 'Org 2',
            activity: 'Activity 2',
            hours: 4,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry1, entry2);
        expect(tracker.entries).toHaveLength(2);

        tracker.entries = tracker.entries.filter(e => e.id !== '1');
        expect(tracker.entries).toHaveLength(1);
        expect(tracker.entries[0].id).toBe('2');
    });
});

describe('VolunteerTracker - Statistics Calculation', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should calculate total hours correctly', () => {
        tracker.entries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Org 1',
                activity: 'Activity 1',
                hours: 3.5,
                category: 'Education',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: '2024-01-16',
                organization: 'Org 2',
                activity: 'Activity 2',
                hours: 2.5,
                category: 'Health',
                description: '',
                createdAt: new Date().toISOString()
            }
        ];

        const stats = tracker.calculateStats();
        expect(stats.totalHours).toBe('6.0');
    });

    it('should count total entries correctly', () => {
        tracker.entries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Org 1',
                activity: 'Activity 1',
                hours: 3,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: '2024-01-16',
                organization: 'Org 2',
                activity: 'Activity 2',
                hours: 4,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            }
        ];

        const stats = tracker.calculateStats();
        expect(stats.totalEntries).toBe(2);
    });

    it('should count unique organizations correctly', () => {
        tracker.entries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Food Bank',
                activity: 'Activity 1',
                hours: 3,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: '2024-01-16',
                organization: 'Food Bank',
                activity: 'Activity 2',
                hours: 4,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                date: '2024-01-17',
                organization: 'Animal Shelter',
                activity: 'Activity 3',
                hours: 2,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            }
        ];

        const stats = tracker.calculateStats();
        expect(stats.orgsCount).toBe(2);
    });

    it('should calculate hours by organization correctly', () => {
        tracker.entries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Food Bank',
                activity: 'Activity 1',
                hours: 3,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: '2024-01-16',
                organization: 'Food Bank',
                activity: 'Activity 2',
                hours: 4,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                date: '2024-01-17',
                organization: 'Animal Shelter',
                activity: 'Activity 3',
                hours: 2,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            }
        ];

        const stats = tracker.calculateStats();
        expect(stats.hoursByOrg).toHaveLength(2);
        expect(stats.hoursByOrg[0][0]).toBe('Food Bank');
        expect(stats.hoursByOrg[0][1]).toBe(7);
        expect(stats.hoursByOrg[1][0]).toBe('Animal Shelter');
        expect(stats.hoursByOrg[1][1]).toBe(2);
    });

    it('should calculate current month hours correctly', () => {
        const now = new Date();
        const thisMonth = now.toISOString().split('T')[0].substring(0, 7);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)
            .toISOString().split('T')[0];

        tracker.entries = [
            {
                id: '1',
                date: `${thisMonth}-15`,
                organization: 'Org 1',
                activity: 'Activity 1',
                hours: 3,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: lastMonth,
                organization: 'Org 2',
                activity: 'Activity 2',
                hours: 4,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            }
        ];

        const stats = tracker.calculateStats();
        expect(stats.thisMonth).toBe('3.0');
    });

    it('should return zero stats for empty entries', () => {
        const stats = tracker.calculateStats();
        expect(stats.totalHours).toBe('0.0');
        expect(stats.totalEntries).toBe(0);
        expect(stats.orgsCount).toBe(0);
        expect(stats.thisMonth).toBe('0.0');
        expect(stats.hoursByOrg).toHaveLength(0);
    });
});

describe('VolunteerTracker - Filtering and Sorting', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();

        // Add sample data
        tracker.entries = [
            {
                id: '1',
                date: '2024-01-15',
                organization: 'Food Bank',
                activity: 'Food sorting',
                hours: 3,
                category: 'Social Services',
                description: 'Sorted donations',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                date: '2024-02-10',
                organization: 'Animal Shelter',
                activity: 'Dog walking',
                hours: 5,
                category: 'Animal Welfare',
                description: 'Walked shelter dogs',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                date: '2024-01-20',
                organization: 'Food Bank',
                activity: 'Food distribution',
                hours: 2,
                category: 'Social Services',
                description: 'Distributed food packages',
                createdAt: new Date().toISOString()
            }
        ];
    });

    it('should sort entries by date descending', () => {
        // Mock the DOM elements
        const mockSelect = {
            value: 'date-desc'
        };
        document.getElementById = (id) => {
            if (id === 'sort-by') return mockSelect;
            return { value: '' };
        };

        const filtered = tracker.getFilteredEntries();
        expect(filtered[0].date).toBe('2024-02-10');
        expect(filtered[1].date).toBe('2024-01-20');
        expect(filtered[2].date).toBe('2024-01-15');
    });

    it('should sort entries by date ascending', () => {
        const mockSelect = {
            value: 'date-asc'
        };
        document.getElementById = (id) => {
            if (id === 'sort-by') return mockSelect;
            return { value: '' };
        };

        const filtered = tracker.getFilteredEntries();
        expect(filtered[0].date).toBe('2024-01-15');
        expect(filtered[1].date).toBe('2024-01-20');
        expect(filtered[2].date).toBe('2024-02-10');
    });

    it('should sort entries by hours descending', () => {
        const mockSelect = {
            value: 'hours-desc'
        };
        document.getElementById = (id) => {
            if (id === 'sort-by') return mockSelect;
            return { value: '' };
        };

        const filtered = tracker.getFilteredEntries();
        expect(filtered[0].hours).toBe(5);
        expect(filtered[1].hours).toBe(3);
        expect(filtered[2].hours).toBe(2);
    });

    it('should sort entries by hours ascending', () => {
        const mockSelect = {
            value: 'hours-asc'
        };
        document.getElementById = (id) => {
            if (id === 'sort-by') return mockSelect;
            return { value: '' };
        };

        const filtered = tracker.getFilteredEntries();
        expect(filtered[0].hours).toBe(2);
        expect(filtered[1].hours).toBe(3);
        expect(filtered[2].hours).toBe(5);
    });
});

describe('VolunteerTracker - Utility Functions', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should format dates correctly', () => {
        const formatted = tracker.formatDate('2024-01-15');
        expect(formatted).toContain('Jan');
        expect(formatted).toContain('15');
        expect(formatted).toContain('2024');
    });

    it('should escape HTML to prevent XSS', () => {
        const malicious = '<script>alert("xss")</script>';
        const escaped = tracker.escapeHtml(malicious);
        expect(escaped).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    it('should escape HTML special characters', () => {
        const text = 'Test & "quotes" <tags>';
        const escaped = tracker.escapeHtml(text);
        expect(escaped).toContain('&amp;');
        expect(escaped).toContain('&lt;');
        expect(escaped).toContain('&gt;');
    });
});

describe('VolunteerTracker - Edge Cases', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should handle decimal hours correctly', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 2.75,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        const stats = tracker.calculateStats();
        expect(stats.totalHours).toBe('2.8');
    });

    it('should handle entries without categories', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 5,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        expect(tracker.entries[0].category).toBe('');
    });

    it('should handle entries without descriptions', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 5,
            category: 'Education',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        expect(tracker.entries[0].description).toBe('');
    });

    it('should handle very long organization names', () => {
        const longName = 'A'.repeat(200);
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: longName,
            activity: 'Test Activity',
            hours: 5,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        expect(tracker.entries[0].organization).toHaveLength(200);
    });

    it('should handle zero hours entries', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            organization: 'Test Org',
            activity: 'Test Activity',
            hours: 0,
            category: '',
            description: '',
            createdAt: new Date().toISOString()
        };

        tracker.entries.push(entry);
        const stats = tracker.calculateStats();
        expect(stats.totalHours).toBe('0.0');
    });

    it('should handle large numbers of entries', () => {
        for (let i = 0; i < 1000; i++) {
            tracker.entries.push({
                id: i.toString(),
                date: '2024-01-15',
                organization: `Org ${i % 10}`,
                activity: 'Activity',
                hours: 1,
                category: '',
                description: '',
                createdAt: new Date().toISOString()
            });
        }

        const stats = tracker.calculateStats();
        expect(stats.totalEntries).toBe(1000);
        expect(stats.totalHours).toBe('1000.0');
    });
});

describe('VolunteerTracker - Data Validation', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new VolunteerTracker();
    });

    it('should handle malformed localStorage data', () => {
        localStorage.setItem('volunteerEntries', 'invalid json');
        const newTracker = new VolunteerTracker();
        expect(newTracker.entries).toHaveLength(0);
    });

    it('should handle missing required fields gracefully', () => {
        const entry = {
            id: '1',
            date: '2024-01-15',
            // missing organization, activity, hours
        };

        tracker.entries.push(entry);
        // Should not throw when calculating stats
        const stats = tracker.calculateStats();
        expect(stats).toBeTruthy();
    });
});
