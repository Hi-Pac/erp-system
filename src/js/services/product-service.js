import { 
    getDocuments, 
    getDocument, 
    addDocument, 
    updateDocument,
    deleteDocument 
} from './firestore-service.js';

const COLLECTION_NAME = 'products';

/**
 * Get products with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Query results and pagination info
 */
export const getProducts = async (options = {}) => {
    const { category, priceMin, priceMax, search, ...otherOptions } = options;
    
    // Build filters array
    const filters = [];
    
    if (category) {
        filters.push({
            field: 'category',
            operator: '==',
            value: category
        });
    }
    
    if (priceMin !== undefined && priceMin !== null) {
        filters.push({
            field: 'price',
            operator: '>=',
            value: parseFloat(priceMin)
        });
    }
    
    if (priceMax !== undefined && priceMax !== null) {
        filters.push({
            field: 'price',
            operator: '<=',
            value: parseFloat(priceMax)
        });
    }
    
    // For text search, we need client-side filtering as Firestore doesn't support full-text search
    const result = await getDocuments(COLLECTION_NAME, {
        filters,
        sortField: 'name',
        sortDirection: 'asc',
        ...otherOptions
    });
    
    // Client-side text search filtering if search term is provided
    if (search) {
        const searchLower = search.toLowerCase();
        result.documents = result.documents.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            (product.batchCodes && product.batchCodes.some(code => 
                code.toLowerCase().includes(searchLower)
            ))
        );
    }
    
    return result;
};

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product data
 */
export const getProduct = async (id) => {
    return await getDocument(COLLECTION_NAME, id);
};

/**
 * Add a new product
 * @param {Object} productData - Product data
 * @returns {Promise<string>} - New product ID
 */
export const addProduct = async (productData) => {
    // Validate required fields
    if (!productData.name || !productData.category || productData.price === undefined) {
        throw new Error('Product name, category, and price are required');
    }
    
    // Ensure price is a number
    productData.price = parseFloat(productData.price);
    
    // Ensure batchCodes is an array
    if (!productData.batchCodes) {
        productData.batchCodes = [];
    }
    
    return await addDocument(COLLECTION_NAME, productData);
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Promise<void>}
 */
export const updateProduct = async (id, productData) => {
    // Ensure price is a number if provided
    if (productData.price !== undefined) {
        productData.price = parseFloat(productData.price);
    }
    
    await updateDocument(COLLECTION_NAME, id, productData);
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
    await deleteDocument(COLLECTION_NAME, id);
};

/**
 * Get product categories
 * @returns {Array<string>} - Array of category names
 */
export const getProductCategories = () => {
    return [
        { id: 'constructional', name: 'Constructional' },
        { id: 'external', name: 'External' },
        { id: 'decorative', name: 'Decorative' }
    ];
};

/**
 * Export products to CSV
 * @param {Array<Object>} products - Products array
 * @returns {string} - CSV content
 */
export const exportProductsToCSV = (products) => {
    if (!products || products.length === 0) {
        return null;
    }
    
    // CSV header
    let csvContent = 'Name,Category,Batch/Code,Price\n';
    
    // Add rows
    products.forEach(product => {
        // Format category for display
        let categoryDisplay = 'Unknown';
        switch(product.category) {
            case 'constructional': categoryDisplay = 'Constructional'; break;
            case 'external': categoryDisplay = 'External'; break;
            case 'decorative': categoryDisplay = 'Decorative'; break;
        }
        
        // Format batch codes
        const batchCodesDisplay = product.batchCodes && product.batchCodes.length > 0
            ? product.batchCodes.join(', ')
            : 'N/A';
        
        // Escape fields for CSV
        const escapedName = `"${product.name.replace(/"/g, '""')}"`;
        const escapedCategory = `"${categoryDisplay}"`;
        const escapedBatchCodes = `"${batchCodesDisplay.replace(/"/g, '""')}"`;
        const price = `$${product.price.toFixed(2)}`;
        
        csvContent += `${escapedName},${escapedCategory},${escapedBatchCodes},${price}\n`;
    });
    
    return csvContent;
};

/**
 * Add sample products (for demo/testing)
 * @returns {Promise<void>}
 */
export const addSampleProducts = async () => {
    const sampleProducts = [
        {
            name: 'Ultra Premium Satin',
            category: 'decorative',
            price: 129.99,
            batchCodes: ['DCST-001', 'DCST-002', 'DCST-003']
        },
        {
            name: 'Weather Shield Exterior',
            category: 'external',
            price: 149.99,
            batchCodes: ['EXWS-001', 'EXWS-002']
        },
        {
            name: 'Concrete Foundation Base',
            category: 'constructional',
            price: 89.99,
            batchCodes: ['CNCR-001', 'CNCR-002', 'CNCR-003', 'CNCR-004']
        },
        {
            name: 'Premium Emulsion Flat',
            category: 'decorative',
            price: 115.50,
            batchCodes: ['DCFL-001', 'DCFL-002']
        },
        {
            name: 'Waterproof Membrane',
            category: 'constructional',
            price: 199.99,
            batchCodes: ['CNWM-001']
        }
    ];
    
    const addPromises = sampleProducts.map(product => addProduct(product));
    await Promise.all(addPromises);
};