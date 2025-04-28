/**
 * HCP-ERP Utility Functions
 * Contains common utility functions used across the application
 */

/**
 * Show a notification message to the user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds to show the message
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transform transition-transform duration-300 translate-x-full';
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transform transition-transform duration-300';
    
    switch (type) {
        case 'success':
            notification.className += ' bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-check-circle mr-2"></i> ${message}</div>`;
            break;
        case 'error':
            notification.className += ' bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i> ${message}</div>`;
            break;
        case 'warning':
            notification.className += ' bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-exclamation-triangle mr-2"></i> ${message}</div>`;
            break;
        default:
            notification.className += ' bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-info-circle mr-2"></i> ${message}</div>`;
    }
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Hide notification after duration
    setTimeout(() => {
        notification.classList.add('translate-x-full');
    }, duration);
}

/**
 * Format date to display format
 * @param {Date|string|number} date - Date to format (Date object, ISO string, or timestamp)
 * @param {string} format - Format type ('short', 'medium', 'long', 'full')
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'medium') {
    if (!date) return '';
    
    // Convert to Date object if string or number
    if (!(date instanceof Date)) {
        // Handle Firestore Timestamp
        if (date && typeof date.toDate === 'function') {
            date = date.toDate();
        } else {
            date = new Date(date);
        }
    }
    
    // Check if valid date
    if (isNaN(date.getTime())) return '';
    
    // Get current language
    const lang = localStorage.getItem('hcp-erp-language') || 'en';
    
    // Format options based on requested format
    let options;
    switch (format) {
        case 'short':
            options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            break;
        case 'long':
            options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            break;
        case 'full':
            options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long',
                hour: '2-digit', 
                minute: '2-digit' 
            };
            break;
        case 'time':
            options = { hour: '2-digit', minute: '2-digit' };
            break;
        default: // medium
            options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            };
    }
    
    return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    if (amount === undefined || amount === null) return '';
    
    // Get current language
    const lang = localStorage.getItem('hcp-erp-language') || 'en';
    
    // Format options
    const options = {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', options).format(amount);
}

/**
 * Format number with thousands separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(num, decimals = 0) {
    if (num === undefined || num === null) return '';
    
    // Get current language
    const lang = localStorage.getItem('hcp-erp-language') || 'en';
    
    // Format options
    const options = {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    };
    
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', options).format(num);
}

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    // Check for saved dark mode preference
    const darkModeSaved = localStorage.getItem('hcp-erp-dark-mode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial dark mode state
    if (darkModeSaved === 'true' || (darkModeSaved === null && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Add dark mode toggle button handler
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

/**
 * Toggle dark mode on/off
 */
function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    localStorage.setItem('hcp-erp-dark-mode', isDarkMode);
    
    // Refresh charts if they exist (dark mode affects chart colors)
    if (window.salesChart) {
        updateSalesChart(currentSalesPeriod || 'month');
    }
    
    if (window.productsChart) {
        updateProductsChart(currentProductsPeriod || 'month');
    }
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone format is valid
 */
function isValidPhone(phone) {
    const re = /^\+?[\d\s()-]{8,20}$/;
    return re.test(String(phone));
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename for the downloaded file
 */
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    // Column headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    csvContent += data.map(item => {
        return headers.map(header => {
            let value = item[header];
            
            // Format value for CSV (handle commas, quotes, etc.)
            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            
            value = String(value);
            
            // Escape quotes and wrap in quotes if contains comma or newline
            if (value.includes('"')) {
                value = value.replace(/"/g, '""');
            }
            
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                value = `"${value}"`;
            }
            
            return value;
        }).join(',');
    }).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'export.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export data to PDF file
 * @param {string} elementId - ID of element to export as PDF
 * @param {string} filename - Filename for the downloaded file
 */
function exportToPDF(elementId, filename) {
    // This would typically use a library like jsPDF or html2pdf
    // For this demo, we'll just show a notification
    showNotification('PDF export functionality would be implemented with a PDF library', 'info');
}

/**
 * Check if user has permission for a specific action
 * @param {string} permission - Permission to check
 * @returns {Promise<boolean>} Promise that resolves to true if user has permission
 */
async function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) return false;
        
        const userData = userDoc.data();
        
        // Admin has all permissions
        if (userData.role === 'admin') return true;
        
        // Check role-based permissions
        const permissionsMap = {
            'manager': ['read', 'write', 'update', 'delete_own'],
            'sales': ['read', 'write_sales', 'update_sales'],
            'inventory': ['read', 'write_inventory', 'update_inventory'],
            'accounting': ['read', 'write_invoices', 'update_invoices'],
            'user': ['read']
        };
        
        const rolePermissions = permissionsMap[userData.role] || [];
        return rolePermissions.includes(permission);
    } catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', initDarkMode);
