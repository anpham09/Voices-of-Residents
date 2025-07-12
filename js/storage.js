window.IssueTracker = window.IssueTracker || {};

window.IssueTracker.storage = {
    getIssues: function() {
        try {
            const data = localStorage.getItem(window.IssueTracker.config.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },
    saveIssue: function(issue) {
        try {
            const issues = this.getIssues();
            if (!issue.id) {
                issue.id = window.IssueTracker.utils.generateId();
            }
            if (!issue.timestamp) {
                issue.timestamp = new Date().toISOString();
            }
          
            issues.unshift(issue);
            
            localStorage.setItem(window.IssueTracker.config.storageKey, JSON.stringify(issues));
            return { success: true, issue: issue };
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return { success: false, error: 'Failed to save issue' };
        }
    },


    getIssueById: function(id) {
        const issues = this.getIssues();
        return issues.find(issue => issue.id === id);
    },

    updateIssue: function(id, updates) {
        try {
            const issues = this.getIssues();
            const issueIndex = issues.findIndex(issue => issue.id === id);
            
            if (issueIndex === -1) {
                return { success: false, error: 'Issue not found' };
            }
            
            issues[issueIndex] = { ...issues[issueIndex], ...updates };
            
            localStorage.setItem(window.IssueTracker.config.storageKey, JSON.stringify(issues));
            return { success: true, issue: issues[issueIndex] };
        } catch (error) {
            console.error('Error updating issue:', error);
            return { success: false, error: 'Failed to update issue' };
        }
    },

 
    deleteIssue: function(id) {
        try {
            const issues = this.getIssues();
            const filteredIssues = issues.filter(issue => issue.id !== id);
            
          
          
            localStorage.setItem(window.IssueTracker.config.storageKey, JSON.stringify(filteredIssues));
            return { success: true };
        } catch (error) {
            console.error('Error deleting issue:', error);
            return { success: false, error: 'Failed to delete issue' };
        }
    },

    getIssuesByCategory: function(category) {
        const issues = this.getIssues();
        return category ? issues.filter(issue => issue.category === category) : issues;
    },

    searchIssues: function(query) {
        const issues = this.getIssues();
        const searchTerm = query.toLowerCase();
        
        return issues.filter(issue => 
            issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            issue.category.toLowerCase().includes(searchTerm)
        );
    },

    getStorageStats: function() {
        const issues = this.getIssues();
        const stats = {
            totalIssues: issues.length,
            categories: {},
            totalSize: 0
        };
        
        issues.forEach(issue => {
            stats.categories[issue.category] = (stats.categories[issue.category] || 0) + 1;
            
            stats.totalSize += JSON.stringify(issue).length;
        });
        
        return stats;
    },

    clearAllIssues: function() {
        try {
            localStorage.removeItem(window.IssueTracker.config.storageKey);
            return { success: true };
        } catch (error) {
            console.error('Error clearing storage:', error);
            return { success: false, error: 'Failed to clear storage' };
        }
    },

    exportIssues: function() {
        const issues = this.getIssues();
        const dataStr = JSON.stringify(issues, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'issues_' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    importIssues: function(jsonData) {
        try {
            const importedIssues = JSON.parse(jsonData);
            
            if (!Array.isArray(importedIssues)) {
                return { success: false, error: 'Invalid data format' };
            }
            
           
            const validIssues = importedIssues.filter(issue => 
                issue.title && issue.category && issue.description
            );
            
            if (validIssues.length === 0) {
                return { success: false, error: 'No valid issues found' };
            }
            
          
            const existingIssues = this.getIssues();
            const allIssues = [...existingIssues, ...validIssues];
            
            localStorage.setItem(window.IssueTracker.config.storageKey, JSON.stringify(allIssues));
            
            return { 
                success: true, 
                imported: validIssues.length,
                skipped: importedIssues.length - validIssues.length
            };
        } catch (error) {
            console.error('Error importing issues:', error);
            return { success: false, error: 'Failed to import issues' };
        }
    }
};