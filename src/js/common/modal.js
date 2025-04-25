/**
 * Create and show a modal
 * @param {string} title - Modal title
 * @param {string|HTMLElement} content - Modal content (HTML string or element)
 * @param {Object} options - Modal options
 * @returns {Object} - Modal controller with close method
 */
export const showModal = (title, content, options = {}) => {
    const modalContainer = document.getElementById('modal-container');
    
    if (!modalContainer) {
        console.error('Modal container not found');
        return null;
    }
    
    // Default options
    const defaultOptions = {
        size: 'md', // sm, md, lg, xl
        closeable: true,
        backdrop: true,
        footer: null,
        onClose: null,
        id: 'modal-' + Date.now()
    };
    
    // Merge options
    const modalOptions = { ...defaultOptions, ...options };
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = modalOptions.id;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center';
    
    // Set max width based on size
    let maxWidth = 'max-w-md';
    switch (modalOptions.size) {
        case 'sm': maxWidth = 'max-w-sm'; break;
        case 'lg': maxWidth = 'max-w-lg'; break;
        case 'xl': maxWidth = 'max-w-xl'; break;
        case 'full': maxWidth = 'max-w-full mx-4'; break;
    }
    
    // Build modal HTML
    modal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 ${modalOptions.backdrop ? 'modal-backdrop' : ''}"></div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-hidden z-10 relative">
            <div class="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${title}</h3>
                ${modalOptions.closeable ? `
                    <button class="modal-close text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
            <div class="p-6 overflow-y-auto max-h-[70vh]">
                ${typeof content === 'string' ? content : ''}
            </div>
            ${modalOptions.footer ? `
                <div class="px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-3">
                    ${modalOptions.footer}
                </div>
            ` : ''}
        </div>
    `;
    
    // Add to container
    modalContainer.appendChild(modal);
    
    // If content is an element, append it to the modal body
    if (content instanceof HTMLElement) {
        modal.querySelector('.p-6').appendChild(content);
    }
    
    // Add close button event listener
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeModal(modal.id, modalOptions.onClose);
        });
    }
    
    // Add backdrop click event
    if (modalOptions.backdrop && modalOptions.closeable) {
        const backdrop = modal.querySelector('.modal-backdrop');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(modal.id, modalOptions.onClose);
            }
        });
    }
    
    // Add keydown event for ESC key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && modalOptions.closeable) {
            closeModal(modal.id, modalOptions.onClose);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Return controller
    return {
        close: () => closeModal(modal.id, modalOptions.onClose),
        getElement: () => document.getElementById(modal.id)
    };
};

/**
 * Close a modal by ID
 * @param {string} id - Modal ID
 * @param {Function} onClose - On close callback
 */
export const closeModal = (id, onClose = null) => {
    const modal = document.getElementById(id);
    
    if (modal) {
        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown);
        
        // Execute onClose callback if provided
        if (typeof onClose === 'function') {
            onClose();
        }
        
        // Remove modal from DOM
        modal.remove();
    }
};

/**
 * Show a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Object} options - Confirmation options
 * @returns {Promise} - Resolves with true (confirm) or false (cancel)
 */
export const showConfirmation = (message, options = {}) => {
    return new Promise((resolve) => {
        const defaultOptions = {
            title: 'Confirm Action',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            confirmButtonClass: 'bg-primary-600 hover:bg-primary-700 text-white',
            cancelButtonClass: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white',
            icon: 'question' // question, warning, info, error
        };
        
        const confirmOptions = { ...defaultOptions, ...options };
        
        // Set icon
        let iconHtml = '';
        let iconClass = '';
        
        switch (confirmOptions.icon) {
            case 'warning':
                iconHtml = '<i class="fas fa-exclamation-triangle"></i>';
                iconClass = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
                break;
            case 'info':
                iconHtml = '<i class="fas fa-info-circle"></i>';
                iconClass = 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
                break;
            case 'error':
                iconHtml = '<i class="fas fa-exclamation-circle"></i>';
                iconClass = 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
                break;
            case 'question':
            default:
                iconHtml = '<i class="fas fa-question-circle"></i>';
                iconClass = 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300';
                break;
        }
        
        // Create footer with buttons
        const footer = `
            <button id="cancel-button" class="px-4 py-2 rounded-md ${confirmOptions.cancelButtonClass}">
                ${confirmOptions.cancelText}
            </button>
            <button id="confirm-button" class="px-4 py-2 rounded-md ${confirmOptions.confirmButtonClass}">
                ${confirmOptions.confirmText}
            </button>
        `;
        
        // Create content with icon
        const content = `
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconClass} mb-4">
                    ${iconHtml}
                </div>
                <p class="text-gray-700 dark:text-gray-300">${message}</p>
            </div>
        `;
        
        // Show modal
        const modal = showModal(confirmOptions.title, content, {
            size: 'sm',
            footer,
            closeable: true,
            onClose: () => resolve(false)
        });
        
        // Add button event listeners
        const modalElement = modal.getElement();
        modalElement.querySelector('#cancel-button').addEventListener('click', () => {
            modal.close();
            resolve(false);
        });
        
        modalElement.querySelector('#confirm-button').addEventListener('click', () => {
            modal.close();
            resolve(true);
        });
    });
};