/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export const showToast = (message, type = 'info', duration = 5000) => {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-md shadow-md flex items-center justify-between max-w-xs fade-in`;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            toast.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-500', 'text-white');
            break;
        case 'info':
        default:
            toast.classList.add('bg-blue-500', 'text-white');
            break;
    }
    
    // Add icon based on type
    let icon = 'info-circle';
    switch(type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
    }
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${icon} mr-2"></i>
            <span>${message}</span>
        </div>
        <button class="ml-4 text-white hover:text-gray-200 focus:outline-none">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add close button event listener
    toast.querySelector('button').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
};

/**
 * Remove a toast element with animation
 * @param {HTMLElement} toast - The toast element to remove
 */
const removeToast = (toast) => {
    if (toast.parentNode) {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }
};