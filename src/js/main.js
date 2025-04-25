import { initAuth, handleLogout, toggleTheme, setLanguage } from './auth/auth.js';
import { initProducts } from './modules/products.js';
import { showToast } from './common/toast.js';

// App state
let currentPage = 'dashboard';
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize app
function init() {
    // Check dark mode preference
    checkDarkMode();
    
    // Initialize language
    setLanguage(currentLanguage);
    
    // Initialize authentication
    initAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Listen for authentication events
    window.addEventListener('app:authenticated', handleAuthenticated);
    
    // Listen for language change events
    window.addEventListener('language:changed', handleLanguageChanged);
}

// Check dark mode preference
function checkDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) { // Only apply if user hasn't manually set theme
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Setup sidebar menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('href').replace('#', '');
            navigateTo(page);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebarContent = document.getElementById('sidebar-content');
    
    if (mobileMenuButton && sidebarContent) {
        mobileMenuButton.addEventListener('click', () => {
            sidebarContent.classList.toggle('hidden');
            sidebarContent.classList.toggle('md:block');
        });
    }
    
    // Logout button
    const logoutButton = document.getElementById('logout-button');
    const headerLogoutButton = document.getElementById('header-logout-button');
    
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (headerLogoutButton) headerLogoutButton.addEventListener('click', handleLogout);
    
    // User dropdown toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
    
    // Theme toggle
    const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
    if (sidebarThemeToggle) {
        sidebarThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Language toggle
    const sidebarLangEn = document.getElementById('sidebar-lang-en');
    const sidebarLangAr = document.getElementById('sidebar-lang-ar');
    
    if (sidebarLangEn) sidebarLangEn.addEventListener('click', () => setLanguage('en'));
    if (sidebarLangAr) sidebarLangAr.addEventListener('click', () => setLanguage('ar'));
}

// Handle authenticated user
function handleAuthenticated() {
    renderHeader();
    renderSidebar();
    renderFooter();
    
    // Navigate to dashboard by default
    navigateTo('dashboard');
    
    // Check for session timeout
    setupSessionTimeout();
}

// Handle language changed
function handleLanguageChanged(event) {
    currentLanguage = event.detail.language;
    
    // Update UI for current page
    navigateTo(currentPage, false);
}

// Render header
function renderHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const isRtl = currentLanguage === 'ar';
    
    header.innerHTML = `
        <div class="flex items-center justify-between">
            <h1 id="page-title" class="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h1>
            <div class="flex items-center space-x-4">
                <button id="notifications-button" class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 relative">
                    <i class="fas fa-bell"></i>
                    <span id="notification-badge" class="hidden absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </button>
                <div class="relative">
                    <button id="user-menu-button" class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500">
                        <i class="fas fa-user-circle text-xl"></i>
                    </button>
                    <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                        <a href="#profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fas fa-user mr-2"></i> ${isRtl ? 'الملف الشخصي' : 'Profile'}
                        </a>
                        <a href="#settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fas fa-cog mr-2"></i> ${isRtl ? 'الإعدادات' : 'Settings'}
                        </a>
                        <div class="border-t dark:border-gray-700"></div>
                        <button id="header-logout-button" class="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fas fa-sign-out-alt mr-2"></i> ${isRtl ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-attach event listeners
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const headerLogoutButton = document.getElementById('header-logout-button');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
    }
    
    if (headerLogoutButton) {
        headerLogoutButton.addEventListener('click', handleLogout);
    }
}

// Render sidebar
function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const isRtl = currentLanguage === 'ar';
    
    // Mobile header
    const mobileHeader = `
        <div class="md:hidden flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h1 class="text-xl font-bold text-primary-600">HCP ERP</h1>
            <button id="mobile-menu-button" class="text-gray-600 dark:text-gray-300 focus:outline-none">
                <i class="fas fa-bars text-xl"></i>
            </button>
        </div>
    `;
    
    // Menu items
    const menuItems = [
        { id: 'dashboard', icon: 'tachometer-alt', text: isRtl ? 'لوحة التحكم' : 'Dashboard' },
        { id: 'customers', icon: 'users', text: isRtl ? 'العملاء' : 'Customers' },
        { id: 'suppliers', icon: 'truck', text: isRtl ? 'الموردين' : 'Suppliers' },
        { id: 'sales', icon: 'shopping-cart', text: isRtl ? 'المبيعات' : 'Sales' },
        { id: 'products', icon: 'paint-roller', text: isRtl ? 'المنتجات' : 'Products' },
        { id: 'accounting', icon: 'calculator', text: isRtl ? 'الحسابات' : 'Accounting' },
        { id: 'reports', icon: 'chart-bar', text: isRtl ? 'التقارير' : 'Reports' },
        { id: 'users', icon: 'user-cog', text: isRtl ? 'المستخدمين' : 'Users' },
        { id: 'settings', icon: 'cog', text: isRtl ? 'الإعدادات' : 'Settings' }
    ];
    
    // Create menu HTML
    const menuHTML = menuItems.map(item => `
        <li class="mb-1">
            <a href="#${item.id}" class="menu-item flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300">
                <i class="fas fa-${item.icon} w-5 text-center ${isRtl ? 'ml-2' : 'mr-2'}"></i>
                <span>${item.text}</span>
            </a>
        </li>
    `).join('');
    
    // Sidebar content
    sidebar.innerHTML = `
        ${mobileHeader}
        
        <!-- Sidebar Content -->
        <div id="sidebar-content" class="md:block hidden md:h-screen flex flex-col">
            <!-- Logo & User -->
            <div class="p-4 border-b dark:border-gray-700">
                <h1 class="text-xl font-bold text-primary-600 mb-4">HCP ERP</h1>
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h3 id="user-name" class="font-medium text-gray-800 dark:text-white">Admin User</h3>
                        <p id="user-role" class="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav class="sidebar-menu flex-1 overflow-y-auto py-4 px-2">
                <ul>
                    ${menuHTML}
                </ul>
            </nav>
            
            <!-- Sidebar Footer -->
            <div class="p-4 border-t dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <button id="sidebar-theme-toggle" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">
                        <i class="fas fa-moon dark:hidden"></i>
                        <i class="fas fa-sun hidden dark:block"></i>
                    </button>
                    <div>
                        <button id="sidebar-lang-ar" class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 ${currentLanguage === 'ar' ? 'font-bold' : ''}">العربية</button>
                        <span class="text-gray-500">|</span>
                        <button id="sidebar-lang-en" class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 ${currentLanguage === 'en' ? 'font-bold' : ''}">English</button>
                    </div>
                    <button id="logout-button" class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Re-attach event listeners
    setupEventListeners();
}

// Render footer
function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    
    const isRtl = currentLanguage === 'ar';
    const currentYear = new Date().getFullYear();
    
    footer.innerHTML = `
        <p>© ${currentYear} HCP ERP. ${isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
    `;
}

// Navigate to page
function navigateTo(page, loadContent = true) {
    // Update current page
    currentPage = page;
    
    // Update page title
    updatePageTitle(page);
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        const itemPage = item.getAttribute('href').replace('#', '');
        if (itemPage === page) {
            item.classList.add('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-300');
        } else {
            item.classList.remove('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-300');
        }
    });
    
    // Close mobile menu if open
    const sidebarContent = document.getElementById('sidebar-content');
    if (window.innerWidth < 768 && sidebarContent && !sidebarContent.classList.contains('hidden')) {
        sidebarContent.classList.add('hidden');
    }
    
    // Load page content
    if (loadContent) {
        loadPageContent(page);
    }
}

// Update page title
function updatePageTitle(page) {
    const pageTitle = document.getElementById('page-title');
    if (!pageTitle) return;
    
    const isRtl = currentLanguage === 'ar';
    
    switch(page) {
        case 'dashboard': 
            pageTitle.textContent = isRtl ? 'لوحة التحكم' : 'Dashboard'; 
            break;
        case 'customers': 
            pageTitle.textContent = isRtl ? 'العملاء' : 'Customers'; 
            break;
        case 'suppliers': 
            pageTitle.textContent = isRtl ? 'الموردين' : 'Suppliers'; 
            break;
        case 'sales': 
            pageTitle.textContent = isRtl ? 'المبيعات' : 'Sales'; 
            break;
        case 'products': 
            pageTitle.textContent = isRtl ? 'المنتجات' : 'Products'; 
            break;
        case 'accounting': 
            pageTitle.textContent = isRtl ? 'الحسابات' : 'Accounting'; 
            break;
        case 'reports': 
            pageTitle.textContent = isRtl ? 'التقارير' : 'Reports'; 
            break;
        case 'users': 
            pageTitle.textContent = isRtl ? 'المستخدمين' : 'Users'; 
            break;
        case 'settings': 
            pageTitle.textContent = isRtl ? 'الإعدادات' : 'Settings'; 
            break;
        default: 
            pageTitle.textContent = isRtl ? 'لوحة التحكم' : 'Dashboard';
    }
}

// Load page content
function loadPageContent(page) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    
    // Clear previous content
    contentArea.innerHTML = '';
    
    // Show loading state
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'py-8 text-center';
    loadingIndicator.innerHTML = `
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-400 border-t-transparent"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    `;
    contentArea.appendChild(loadingIndicator);
    
    // Load page content
    switch(page) {
        case 'dashboard':
            loadDashboard(contentArea);
            break;
        case 'products':
            loadProducts(contentArea);
            break;
        case 'customers':
            loadCustomers(contentArea);
            break;
        case 'suppliers':
            loadSuppliers(contentArea);
            break;
        case 'sales':
            loadSales(contentArea);
            break;
        case 'accounting':
            loadAccounting(contentArea);
            break;
        case 'reports':
            loadReports(contentArea);
            break;
        case 'users':
            loadUsers(contentArea);
            break;
        case 'settings':
            loadSettings(contentArea);
            break;
        default:
            loadDashboard(contentArea);
    }
}

// Load dashboard
function loadDashboard(container) {
    // For now, we'll just show a placeholder
    container.innerHTML = `
        <div class="fade-in">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                            <i class="fas fa-shopping-cart text-blue-500 dark:text-blue-300"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">$24,780</h3>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center text-green-500">
                        <i class="fas fa-arrow-up mr-1"></i>
                        <span class="text-sm">12.5% from last month</span>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                            <i class="fas fa-users text-green-500 dark:text-green-300"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">573</h3>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center text-green-500">
                        <i class="fas fa-arrow-up mr-1"></i>
                        <span class="text-sm">8.2% from last month</span>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-amber-100 dark:bg-amber-900 mr-4">
                            <i class="fas fa-paint-roller text-amber-500 dark:text-amber-300"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Products</p>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">128</h3>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center text-green-500">
                        <i class="fas fa-arrow-up mr-1"></i>
                        <span class="text-sm">5.3% from last month</span>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
                            <i class="fas fa-exclamation-circle text-red-500 dark:text-red-300"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">15</h3>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center text-red-500">
                        <i class="fas fa-arrow-up mr-1"></i>
                        <span class="text-sm">3.6% from last week</span>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity Table -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
                    <a href="#sales" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                        View All <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">ORD-2023-001</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">Ahmed Mohamed</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400">2023-04-15</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">$1,200.00</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Delivered
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">ORD-2023-002</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">Sara Ahmed</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400">2023-04-16</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">$850.00</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">ORD-2023-003</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">Mohamed Ali</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400">2023-04-16</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">$2,400.00</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Processing
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Load products
function loadProducts(container) {
    initProducts(container);
}

// Load customers
function loadCustomers(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Customers management module will be implemented here</p>
        </div>
    `;
}

// Load suppliers
function loadSuppliers(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Suppliers management module will be implemented here</p>
        </div>
    `;
}

// Load sales
function loadSales(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Sales management module will be implemented here</p>
        </div>
    `;
}

// Load accounting
function loadAccounting(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Accounting module will be implemented here</p>
        </div>
    `;
}

// Load reports
function loadReports(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Reports module will be implemented here</p>
        </div>
    `;
}

// Load users
function loadUsers(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Users management module will be implemented here</p>
        </div>
    `;
}

// Load settings
function loadSettings(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">Settings module will be implemented here</p>
        </div>
    `;
}

// Setup session timeout
function setupSessionTimeout() {
    const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    let sessionTimeoutId;
    
    // Reset timeout on user activity
    const resetSessionTimeout = () => {
        clearTimeout(sessionTimeoutId);
        sessionTimeoutId = setTimeout(() => {
            // Log out user after timeout
            showToast('Your session has expired due to inactivity', 'warning');
            handleLogout();
        }, SESSION_TIMEOUT);
    };
    
    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimeout, false);
    });
    
    // Initial timeout
    resetSessionTimeout();
}

// Initialize the app
init();