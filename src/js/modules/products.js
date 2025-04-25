import { showToast } from '../common/toast.js';
import { showModal, showConfirmation } from '../common/modal.js';
import { 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductCategories,
    exportProductsToCSV
} from '../services/product-service.js';
import { isAdmin } from '../auth/auth.js';

// State
let productsLastVisible = null;
let productsPerPage = 10;
let activeProductFilters = {
    category: '',
    priceMin: '',
    priceMax: '',
    search: ''
};
let editingProduct = null;

// DOM Elements
let productsTableBody;
let productsEmptyState;
let productsLoadingState;
let productSearchInput;
let addProductBtn;
let filterProductsBtn;
let exportProductsBtn;
let productFiltersPanel;
let filterCategory;
let filterPriceMin;
let filterPriceMax;
let applyFiltersBtn;
let resetFiltersBtn;
let prevPageBtn;
let nextPageBtn;
let paginationStart;
let paginationEnd;
let paginationTotal;

/**
 * Initialize products module
 * @param {HTMLElement} container - Container element
 */
export const initProducts = (container) => {
    // Render products UI
    renderProductsUI(container);
    
    // Get DOM elements
    productsTableBody = document.getElementById('products-table-body');
    productsEmptyState = document.getElementById('products-empty-state');
    productsLoadingState = document.getElementById('products-loading-state');
    productSearchInput = document.getElementById('product-search');
    addProductBtn = document.getElementById('add-product-btn');
    filterProductsBtn = document.getElementById('filter-products-btn');
    exportProductsBtn = document.getElementById('export-products-btn');
    productFiltersPanel = document.getElementById('product-filters-panel');
    filterCategory = document.getElementById('filter-category');
    filterPriceMin = document.getElementById('filter-price-min');
    filterPriceMax = document.getElementById('filter-price-max');
    applyFiltersBtn = document.getElementById('apply-filters-btn');
    resetFiltersBtn = document.getElementById('reset-filters-btn');
    prevPageBtn = document.getElementById('prev-page-btn');
    nextPageBtn = document.getElementById('next-page-btn');
    paginationStart = document.getElementById('pagination-start');
    paginationEnd = document.getElementById('pagination-end');
    paginationTotal = document.getElementById('pagination-total');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load products
    loadProducts();
};

/**
 * Render products UI
 * @param {HTMLElement} container - Container element
 */
const renderProductsUI = (container) => {
    const isRtl = document.body.classList.contains('rtl');
    const categories = getProductCategories();
    
    // Create categories options
    const categoriesOptions = categories.map(category => 
        `<option value="${category.id}">${category.name}</option>`
    ).join('');
    
    container.innerHTML = `
        <!-- Products Header with Search and Add Button -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                ${isRtl ? 'إدارة المنتجات' : 'Products Management'}
            </h2>
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative">
                    <input type="text" id="product-search" placeholder="${isRtl ? 'بحث عن منتجات...' : 'Search products...'}" 
                           class="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-base">
                    <button class="absolute inset-y-0 ${isRtl ? 'left-0 px-3' : 'right-0 px-3'} flex items-center">
                        <i class="fas fa-search text-gray-400"></i>
                    </button>
                </div>
                <div class="flex gap-2">
                    <button id="add-product-btn" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md 
                           inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 
                           focus:ring-offset-2 transition-colors duration-300">
                        <i class="fas fa-plus ${isRtl ? 'ml-2' : 'mr-2'}"></i> 
                        ${isRtl ? 'إضافة منتج' : 'Add Product'}
                    </button>
                    <button id="filter-products-btn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                           text-gray-700 dark:text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 
                           focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-300">
                        <i class="fas fa-filter"></i>
                    </button>
                    <button id="export-products-btn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                           text-gray-700 dark:text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 
                           focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-300">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Filters Panel (Initially Hidden) -->
        <div id="product-filters-panel" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm 
             border border-gray-200 dark:border-gray-700 mb-6 hidden">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                ${isRtl ? 'تصفية المنتجات' : 'Filter Products'}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'الفئة' : 'Category'}
                    </label>
                    <select id="filter-category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 
                           dark:bg-gray-700 dark:text-white text-base">
                        <option value="">${isRtl ? 'كل الفئات' : 'All Categories'}</option>
                        ${categoriesOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'نطاق السعر' : 'Price Range'}
                    </label>
                    <div class="flex items-center space-x-2">
                        <input type="number" id="filter-price-min" placeholder="${isRtl ? 'الحد الأدنى' : 'Min'}" 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-primary-500 
                               dark:bg-gray-700 dark:text-white text-base">
                        <span class="text-gray-500">-</span>
                        <input type="number" id="filter-price-max" placeholder="${isRtl ? 'الحد الأقصى' : 'Max'}" 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-primary-500 
                               dark:bg-gray-700 dark:text-white text-base">
                    </div>
                </div>
                <div class="flex items-end">
                    <button id="apply-filters-btn" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 
                           rounded-md inline-flex items-center focus:outline-none focus:ring-2 
                           focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-300 mr-2">
                        ${isRtl ? 'تطبيق التصفية' : 'Apply Filters'}
                    </button>
                    <button id="reset-filters-btn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 
                           dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                           transition-colors duration-300">
                        ${isRtl ? 'إعادة ضبط' : 'Reset'}
                    </button>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-${isRtl ? 'right' : 'left'} text-xs font-medium 
                                text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ${isRtl ? 'الاسم' : 'Name'}
                            </th>
                            <th scope="col" class="px-6 py-3 text-${isRtl ? 'right' : 'left'} text-xs font-medium 
                                text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ${isRtl ? 'الفئة' : 'Category'}
                            </th>
                            <th scope="col" class="px-6 py-3 text-${isRtl ? 'right' : 'left'} text-xs font-medium 
                                text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ${isRtl ? 'الباتش/الكود' : 'Batch/Code'}
                            </th>
                            <th scope="col" class="px-6 py-3 text-${isRtl ? 'right' : 'left'} text-xs font-medium 
                                text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ${isRtl ? 'السعر' : 'Price'}
                            </th>
                            <th scope="col" class="px-6 py-3 text-${isRtl ? 'left' : 'right'} text-xs font-medium 
                                text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ${isRtl ? 'الإجراءات' : 'Actions'}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700" id="products-table-body">
                        <!-- Products will be loaded here dynamically -->
                    </tbody>
                </table>
            </div>
            
            <!-- Empty State -->
            <div id="products-empty-state" class="py-8 text-center hidden">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    ${isRtl ? 'لم يتم العثور على منتجات' : 'No products found'}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    ${isRtl ? 'ابدأ بإضافة منتج جديد.' : 'Get started by adding a new product.'}
                </p>
                <div class="mt-6">
                    <button type="button" class="add-product-empty-state inline-flex items-center px-4 py-2 border 
                           border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                           bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-primary-500">
                        <i class="fas fa-plus ${isRtl ? 'ml-2' : 'mr-2'}"></i> 
                        ${isRtl ? 'إضافة منتج' : 'Add Product'}
                    </button>
                </div>
            </div>
            
            <!-- Loading State -->
            <div id="products-loading-state" class="py-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-400 border-t-transparent"></div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    ${isRtl ? 'جاري تحميل المنتجات...' : 'Loading products...'}
                </p>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
                ${isRtl ? 'عرض ' : 'Showing '}
                <span id="pagination-start">1</span> 
                ${isRtl ? 'إلى' : 'to'} 
                <span id="pagination-end">10</span> 
                ${isRtl ? 'من' : 'of'} 
                <span id="pagination-total">0</span> 
                ${isRtl ? 'منتج' : 'products'}
            </div>
            <div class="flex space-x-2">
                <button id="prev-page-btn" class="px-3 py-1 rounded-md bg-white dark:bg-gray-800 
                       border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       disabled:opacity-50 disabled:cursor-not-allowed">
                    ${isRtl ? 'التالي' : 'Previous'}
                </button>
                <button id="next-page-btn" class="px-3 py-1 rounded-md bg-white dark:bg-gray-800 
                       border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       disabled:opacity-50 disabled:cursor-not-allowed">
                    ${isRtl ? 'السابق' : 'Next'}
                </button>
            </div>
        </div>
    `;
};

/**
 * Setup event listeners
 */
const setupEventListeners = () => {
    // Add product button
    addProductBtn.addEventListener('click', () => openProductModal());
    document.querySelector('.add-product-empty-state')?.addEventListener('click', () => openProductModal());
    
    // Filters
    filterProductsBtn.addEventListener('click', toggleFiltersPanel);
    applyFiltersBtn.addEventListener('click', () => {
        applyFilters();
        toggleFiltersPanel();
    });
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Search
    productSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            activeProductFilters.search = e.target.value.trim().toLowerCase();
            loadProducts();
        }
    });
    
    // Pagination
    nextPageBtn.addEventListener('click', loadNextProductsPage);
    prevPageBtn.addEventListener('click', loadPreviousProductsPage);
    
    // Export
    exportProductsBtn.addEventListener('click', exportProductsHandler);
};

/**
 * Load products
 * @param {boolean} isFirstPage - Whether to load the first page
 */
const loadProducts = async (isFirstPage = true) => {
    try {
        // Show loading state
        productsLoadingState.classList.remove('hidden');
        productsEmptyState.classList.add('hidden');
        productsTableBody.innerHTML = '';
        
        // Get options
        const options = {
            pageSize: productsPerPage,
            startAfterDoc: !isFirstPage ? productsLastVisible : null
        };
        
        // Apply filters
        if (activeProductFilters.category) {
            options.filters = [{
                field: 'category',
                operator: '==',
                value: activeProductFilters.category
            }];
        }
        
        // Add price filters to the options
        if (activeProductFilters.priceMin) {
            if (!options.filters) options.filters = [];
            options.filters.push({
                field: 'price',
                operator: '>=',
                value: parseFloat(activeProductFilters.priceMin)
            });
        }
        
        if (activeProductFilters.priceMax) {
            if (!options.filters) options.filters = [];
            options.filters.push({
                field: 'price',
                operator: '<=',
                value: parseFloat(activeProductFilters.priceMax)
            });
        }
        
        // Get products
        const result = await getProducts({
            ...options,
            search: activeProductFilters.search
        });
        
        // Update pagination
        updatePagination(isFirstPage ? 1 : parseInt(paginationStart.textContent) + productsPerPage, result.documents.length);
        
        // Update last visible doc for pagination
        productsLastVisible = result.lastVisible;
        
        // Update pagination buttons
        prevPageBtn.disabled = isFirstPage;
        nextPageBtn.disabled = !result.hasMore;
        
        // Display products
        displayProducts(result.documents);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    } finally {
        // Hide loading state
        productsLoadingState.classList.add('hidden');
    }
};

/**
 * Display products in the table
 * @param {Array<Object>} products - Products array
 */
const displayProducts = (products) => {
    productsTableBody.innerHTML = '';
    
    if (products.length === 0) {
        productsEmptyState.classList.remove('hidden');
        return;
    }
    
    productsEmptyState.classList.add('hidden');
    
    const isRtl = document.body.classList.contains('rtl');
    const canEdit = isAdmin();
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Format batch codes for display
        const batchCodesDisplay = product.batchCodes && product.batchCodes.length > 0
            ? product.batchCodes.join(', ')
            : 'N/A';
        
        // Format category for display
        let categoryDisplay = 'Unknown';
        switch(product.category) {
            case 'constructional': categoryDisplay = isRtl ? 'إنشائية' : 'Constructional'; break;
            case 'external': categoryDisplay = isRtl ? 'خارجية' : 'External'; break;
            case 'decorative': categoryDisplay = isRtl ? 'ديكورية' : 'Decorative'; break;
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${product.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${categoryDisplay}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${batchCodesDisplay}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">$${product.price.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-${isRtl ? 'left' : 'right'} text-sm font-medium space-x-2">
                <button data-id="${product.id}" data-action="view" 
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <i class="fas fa-eye"></i>
                </button>
                ${canEdit ? `
                <button data-id="${product.id}" data-action="edit" 
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                    <i class="fas fa-edit"></i>
                </button>
                <button data-id="${product.id}" data-action="delete" 
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </td>
        `;
        
        // Add event listeners for buttons
        row.querySelector('[data-action="view"]').addEventListener('click', () => viewProduct(product.id));
        
        if (canEdit) {
            row.querySelector('[data-action="edit"]').addEventListener('click', () => editProduct(product.id));
            row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProductHandler(product.id));
        }
        
        productsTableBody.appendChild(row);
    });
};

/**
 * View product details
 * @param {string} id - Product ID
 */
const viewProduct = async (id) => {
    try {
        const product = await getProduct(id);
        
        // Format category
        let categoryDisplay = 'Unknown';
        switch(product.category) {
            case 'constructional': categoryDisplay = 'Constructional'; break;
            case 'external': categoryDisplay = 'External'; break;
            case 'decorative': categoryDisplay = 'Decorative'; break;
        }
        
        // Format batch codes
        const batchCodesHtml = product.batchCodes && product.batchCodes.length > 0
            ? `
                <div class="mt-2">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch/Codes:</h4>
                    <ul class="list-disc list-inside pl-2 text-sm text-gray-600 dark:text-gray-400">
                        ${product.batchCodes.map(code => `<li>${code}</li>`).join('')}
                    </ul>
                </div>
            `
            : '<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">No batch codes defined</p>';
        
        // Create modal content
        const content = `
            <div class="space-y-4">
                <div>
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</h4>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">${product.name}</p>
                </div>
                <div class="flex justify-between">
                    <div>
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Category</h4>
                        <p class="text-md text-gray-900 dark:text-white">${categoryDisplay}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Price</h4>
                        <p class="text-md text-gray-900 dark:text-white">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
                ${batchCodesHtml}
                ${product.createdAt ? `
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t dark:border-gray-700">
                    Created: ${product.createdAt.toDate().toLocaleString()}
                </div>
                ` : ''}
                ${product.updatedAt ? `
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Last Updated: ${product.updatedAt.toDate().toLocaleString()}
                </div>
                ` : ''}
            </div>
        `;
        
        // Show modal
        showModal(`Product Details: ${product.name}`, content, {
            size: 'md',
            footer: isAdmin() ? `
                <button data-id="${product.id}" class="edit-product-btn px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-300">
                    Edit Product
                </button>
            ` : null
        }).getElement().querySelector('.edit-product-btn')?.addEventListener('click', () => {
            closeModal(modal.id);
            editProduct(product.id);
        });
        
    } catch (error) {
        console.error('Error loading product:', error);
        showToast('Error loading product details', 'error');
    }
};

/**
 * Open product modal for adding/editing
 * @param {Object} product - Product to edit (null for new product)
 */
const openProductModal = async (productId = null) => {
    try {
        let product = null;
        
        if (productId) {
            // Load product data
            product = await getProduct(productId);
            editingProduct = product;
        } else {
            editingProduct = null;
        }
        
        const isRtl = document.body.classList.contains('rtl');
        const categories = getProductCategories();
        
        // Create categories options
        const categoriesOptions = categories.map(category => 
            `<option value="${category.id}" ${product && product.category === category.id ? 'selected' : ''}>
                ${category.name}
            </option>`
        ).join('');
        
        // Create form HTML
        const formHTML = `
            <form id="product-form" class="space-y-4">
                <input type="hidden" id="product-id" value="${product ? product.id : ''}">
                <div>
                    <label for="product-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'الفئة' : 'Category'}
                    </label>
                    <select id="product-category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 
                           dark:bg-gray-700 dark:text-white text-base" required>
                        <option value="">${isRtl ? 'اختر الفئة' : 'Select Category'}</option>
                        ${categoriesOptions}
                    </select>
                </div>
                <div>
                    <label for="product-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'اسم المنتج' : 'Product Name'}
                    </label>
                    <input type="text" id="product-name" value="${product ? product.name : ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           dark:bg-gray-700 dark:text-white text-base" required>
                </div>
                <div>
                    <label for="product-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'السعر' : 'Price'}
                    </label>
                    <input type="number" step="0.01" min="0" id="product-price" value="${product ? product.price : ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 
                           dark:bg-gray-700 dark:text-white text-base" required>
                </div>
                
                <!-- Batch/Codes Section -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ${isRtl ? 'الباتش/الكود' : 'Batch/Codes'}
                    </label>
                    <div id="batch-codes-container" class="space-y-2">
                        <!-- Batch/codes will be added here -->
                    </div>
                    <button type="button" id="add-batch-code" 
                            class="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700 
                            dark:text-primary-400 dark:hover:text-primary-300">
                        <i class="fas fa-plus-circle ${isRtl ? 'ml-1' : 'mr-1'}"></i> 
                        ${isRtl ? 'إضافة باتش/كود' : 'Add Batch/Code'}
                    </button>
                </div>
            </form>
        `;
        
        // Show modal
        const modal = showModal(
            product ? (isRtl ? 'تعديل المنتج' : 'Edit Product') : (isRtl ? 'إضافة منتج جديد' : 'Add New Product'), 
            formHTML, 
            {
                size: 'md',
                footer: `
                    <button type="button" id="cancel-product-form" 
                            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white 
                            rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none 
                            focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-300">
                        ${isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" form="product-form"
                            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 
                            focus:outline-none focus:ring-2 focus:ring-primary-500 
                            focus:ring-offset-2 transition-colors duration-300">
                        ${isRtl ? 'حفظ' : 'Save'}
                    </button>
                `
            }
        );
        
        const modalElement = modal.getElement();
        const batchCodesContainer = modalElement.querySelector('#batch-codes-container');
        const addBatchCodeBtn = modalElement.querySelector('#add-batch-code');
        const productForm = modalElement.querySelector('#product-form');
        
        // Add batch code fields
        const addBatchCode = (value = '') => {
            const index = batchCodesContainer.querySelectorAll('.batch-code-field').length;
            const field = document.createElement('div');
            field.className = 'flex items-center space-x-2 batch-code-field';
            field.innerHTML = `
                <input type="text" name="batchCode[${index}]" value="${value}" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-base" 
                    placeholder="${isRtl ? 'أدخل الباتش/الكود' : 'Enter batch code'}">
                <button type="button" class="remove-batch-code text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add event listener to remove button
            field.querySelector('.remove-batch-code').addEventListener('click', function() {
                field.remove();
            });
            
            batchCodesContainer.appendChild(field);
        };
        
        // Add existing batch codes
        if (product && product.batchCodes && product.batchCodes.length > 0) {
            product.batchCodes.forEach(code => addBatchCode(code));
        } else {
            // Add empty batch code field
            addBatchCode();
        }
        
        // Add batch code button event
        addBatchCodeBtn.addEventListener('click', () => addBatchCode());
        
        // Cancel button event
        modalElement.querySelector('#cancel-product-form').addEventListener('click', () => modal.close());
        
        // Form submit event
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(productForm);
                const productId = formData.get('product-id');
                const category = modalElement.querySelector('#product-category').value;
                const name = modalElement.querySelector('#product-name').value;
                const price = parseFloat(modalElement.querySelector('#product-price').value);
                
                // Get batch codes
                const batchCodeInputs = modalElement.querySelectorAll('.batch-code-field input');
                const batchCodes = Array.from(batchCodeInputs)
                    .map(input => input.value.trim())
                    .filter(code => code !== '');
                
                const productData = {
                    category,
                    name,
                    price,
                    batchCodes
                };
                
                if (productId) {
                    // Update existing product
                    await updateProduct(productId, productData);
                    showToast('Product updated successfully', 'success');
                } else {
                    // Add new product
                    await addProduct(productData);
                    showToast('Product added successfully', 'success');
                }
                
                // Close modal and reload products
                modal.close();
                loadProducts();
            } catch (error) {
                console.error('Error saving product:', error);
                showToast('Error saving product: ' + error.message, 'error');
            }
        });
        
    } catch (error) {
        console.error('Error opening product modal:', error);
        showToast('Error opening product form', 'error');
    }
};

/**
 * Edit a product
 * @param {string} id - Product ID
 */
const editProduct = async (id) => {
    try {
        openProductModal(id);
    } catch (error) {
        console.error('Error editing product:', error);
        showToast('Error loading product for editing', 'error');
    }
};

/**
 * Delete product handler
 * @param {string} id - Product ID
 */
const deleteProductHandler = async (id) => {
    try {
        const confirmed = await showConfirmation(
            'Are you sure you want to delete this product? This action cannot be undone.',
            {
                title: 'Delete Product',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
                icon: 'warning'
            }
        );
        
        if (confirmed) {
            await deleteProduct(id);
            showToast('Product deleted successfully', 'success');
            loadProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product', 'error');
    }
};

/**
 * Toggle filters panel
 */
const toggleFiltersPanel = () => {
    productFiltersPanel.classList.toggle('hidden');
};

/**
 * Apply filters
 */
const applyFilters = () => {
    activeProductFilters = {
        category: filterCategory.value,
        priceMin: filterPriceMin.value,
        priceMax: filterPriceMax.value,
        search: productSearchInput.value.trim().toLowerCase()
    };
    
    loadProducts();
};

/**
 * Reset filters
 */
const resetFilters = () => {
    filterCategory.value = '';
    filterPriceMin.value = '';
    filterPriceMax.value = '';
    productSearchInput.value = '';
    
    activeProductFilters = {
        category: '',
        priceMin: '',
        priceMax: '',
        search: ''
    };
    
    loadProducts();
};

/**
 * Load next page of products
 */
const loadNextProductsPage = () => {
    loadProducts(false);
};

/**
 * Load previous page of products
 */
const loadPreviousProductsPage = () => {
    loadProducts(true);
};

/**
 * Update pagination information
 * @param {number} startItem - Start item number
 * @param {number} itemCount - Number of items in current page
 */
const updatePagination = async (startItem, itemCount) => {
    paginationStart.textContent = startItem;
    
    const endItem = startItem + itemCount - 1;
    paginationEnd.textContent = endItem;
    
    // This is a simplified approach - in a real app, you might want to get the actual total count
    try {
        // For demo purposes, show a simulated count
        paginationTotal.textContent = '100+';
    } catch (error) {
        console.error('Error getting total count:', error);
        paginationTotal.textContent = '...';
    }
};

/**
 * Export products handler
 */
const exportProductsHandler = async () => {
    try {
        showToast('Preparing export...', 'info');
        
        // Get all products (limited to 1000 for performance reasons)
        const result = await getProducts({
            pageSize: 1000,
            ...activeProductFilters
        });
        
        if (result.documents.length === 0) {
            showToast('No products to export', 'warning');
            return;
        }
        
        // Generate CSV
        const csvContent = exportProductsToCSV(result.documents);
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast(`${result.documents.length} products exported successfully`, 'success');
    } catch (error) {
        console.error('Error exporting products:', error);
        showToast('Error exporting products', 'error');
    }
};