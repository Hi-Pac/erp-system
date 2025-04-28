/**
 * HCP-ERP Dashboard Module
 * Manages dashboard charts, stats, and dynamic content
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and dashboard components
    initDashboard();
    
    // Refresh dashboard button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
    
    // Task management
    initTaskManagement();
    
    // Chart period toggles
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateSalesChart(period);
            
            // Update active state
            periodButtons.forEach(btn => {
                btn.classList.remove('bg-primary-100', 'dark:bg-primary-900', 'text-primary-800', 'dark:text-primary-200');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            });
            
            this.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            this.classList.add('bg-primary-100', 'dark:bg-primary-900', 'text-primary-800', 'dark:text-primary-200');
        });
    });
    
    // Top products time range change
    const topProductsRange = document.getElementById('topProductTimeRange');
    if (topProductsRange) {
        topProductsRange.addEventListener('change', function() {
            const period = this.value;
            updateProductsChart(period);
        });
    }
});

/**
 * Initialize dashboard components
 */
function initDashboard() {
    // Initialize sales chart
    initSalesChart();
    
    // Initialize products chart
    initProductsChart();
    
    // Load dashboard stats from Firestore
    loadDashboardStats();
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
    // Show loading indicator
    const refreshBtn = document.getElementById('refreshDashboard');
    const originalContent = refreshBtn.innerHTML;
    refreshBtn.innerHTML = `<span class="spinner mr-2"></span> ${translationService.translate('refresh')}`;
    refreshBtn.disabled = true;
    
    // Reload charts and stats
    initSalesChart();
    initProductsChart();
    loadDashboardStats()
        .then(() => {
            // Restore button state after loading
            setTimeout(() => {
                refreshBtn.innerHTML = originalContent;
                refreshBtn.disabled = false;
            }, 700);
        })
        .catch(error => {
            console.error('Error refreshing dashboard:', error);
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
        });
}

/**
 * Load dashboard statistics from Firestore
 * @returns {Promise} Promise that resolves when stats are loaded
 */
function loadDashboardStats() {
    // In a real app, this would fetch data from Firestore
    // For this demo, we'll simulate a delay and use static data
    return new Promise((resolve) => {
        setTimeout(() => {
            // Load recent activity
            // loadRecentActivity();
            
            resolve();
        }, 500);
    });
}

// Charts

/**
 * Initialize sales chart with default period (month)
 */
function initSalesChart() {
    updateSalesChart('month');
}

/**
 * Update sales chart data based on period
 * @param {string} period - Time period ('week', 'month', or 'year')
 */
function updateSalesChart(period) {
    // Get sales data based on period
    const { labels, data } = getSalesData(period);
    
    // Chart configuration
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Check if chart already exists and destroy it
    if (window.salesChart) {
        window.salesChart.destroy();
    }
    
    // Get colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    
    // Create new chart
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: translationService.translate('total-sales'),
                data: data,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    });
}

/**
 * Get sales data based on selected period
 * @param {string} period - Time period ('week', 'month', or 'year')
 * @returns {Object} Object containing labels and data arrays
 */
function getSalesData(period) {
    // In a real app, this would fetch data from Firestore
    // For this demo, we'll use simulated data
    
    if (period === 'week') {
        return {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            data: [3200, 2800, 3500, 4100, 3800, 2900, 3400]
        };
    } else if (period === 'month') {
        return {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [12500, 14800, 16200, 18300]
        };
    } else if (period === 'year') {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [42000, 39500, 45600, 48200, 51300, 47800, 52400, 55600, 58900, 62100, 59800, 64300]
        };
    }
    
    // Default fallback
    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [12500, 14800, 16200, 18300]
    };
}

/**
 * Initialize products chart with default period (month)
 */
function initProductsChart() {
    updateProductsChart('month');
}

/**
 * Update products chart data based on period
 * @param {string} period - Time period ('week', 'month', or 'year')
 */
function updateProductsChart(period) {
    // Get product data based on period
    const { labels, data } = getProductsData(period);
    
    // Chart configuration
    const ctx = document.getElementById('productsChart').getContext('2d');
    
    // Check if chart already exists and destroy it
    if (window.productsChart) {
        window.productsChart.destroy();
    }
    
    // Get colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    
    // Create new chart
    window.productsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: translationService.translate('sales'),
                data: data,
                backgroundColor: [
                    'rgba(37, 99, 235, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(139, 92, 246, 0.7)'
                ],
                borderColor: [
                    'rgba(37, 99, 235, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
