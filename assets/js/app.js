/**
 * HCP-ERP Core Application Module
 * Manages application initialization, routing, and UI interactions
 */

// Global application state
const appState = {
    isMenuOpen: false,
    notificationsOpen: false,
    userMenuOpen: false,
    currentModule: getCurrentModule(),
    isLoading: false
};

// Initialize application on document ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core components
    initApp();
    
    // Handle sidebar toggle on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // User menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', function() {
            toggleUserMenu();
        });
        
        // Close user menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = userMenuBtn.contains(event.target) || userMenu.contains(event.target);
            if (!isClickInside && appState.userMenuOpen) {
                toggleUserMenu();
            }
        });
    }
    
    // Notification panel toggle
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    
    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', function() {
            toggleNotifications();
        });
        
        if (closeNotifications) {
            closeNotifications.addEventListener('click', function() {
                toggleNotifications();
            });
        }
    }
    
    // Initialize page-specific functionality
    initPageFunctions();
});

/**
 * Initialize the application
 */
function initApp() {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize Firebase services
    initFirebaseAuth();
    
    // Set active navigation based on current page
    setActiveNavigation();
    
    // Initialize task management if on dashboard
    if (isCurrentPage('index.html') || isCurrentPage('/')) {
        initTaskManagement();
    }
}

/**
 * Initialize Firebase Authentication
 */
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        handleAuthStateChanged(user);
    });
}

/**
 * Handle Firebase authentication state changes
 * @param {Object|null} user - Firebase user object or null if signed out
 */
function handleAuthStateChanged(user) {
    const currentPath = window.location.pathname;
    const publicPages = ['login.html', 'register.html', 'forgot-password.html'];
    
    const isPublicPage = publicPages.some(page => currentPath.includes(page));
    
    if (user) {
        // User is signed in
        updateUserUI(user);
        
        // If on login page, redirect to dashboard
        if (isPublicPage) {
            window.location.href = 'index.html';
        }
        
        // Load user-specific data
        loadUserData(user);
    } else {
        // User is signed out
        // If not on public page, redirect to login
        if (!isPublicPage) {
            window.location.href = 'login.html';
        }
    }
}

/**
 * Update UI with user information
 * @param {Object} user - Firebase user object
 */
function updateUserUI(user) {
    // Update user avatar
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
        } else {
            // Generate avatar from name or email
            const displayName = user.displayName || user.email.split('@')[0];
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0062cc&color=fff`;
        }
        userAvatar.alt = user.displayName || user.email;
    }
    
    // Update other user-related UI elements if needed
}

/**
 * Load user-specific data from Firestore
 * @param {Object} user - Firebase user object
 */
function loadUserData(user) {
    // Get user document from Firestore
    firebase.firestore().collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Store user role for permission checks
                appState.userRole = userData.role;
                
                // Apply role-based UI customizations
                applyRoleBasedUI(userData.role);
                
                // Load notifications
                loadNotifications(user.uid);
                
                // Load tasks if on dashboard
                if (isCurrentPage('index.html') || isCurrentPage('/')) {
                    loadTasks(user.uid);
                }
            } else {
                console.warn('No user data found in Firestore');
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
}

/**
 * Apply role-based UI customizations
 * @param {string} role - User role
 */
function applyRoleBasedUI(role) {
    // Hide UI elements based on user role
    const adminOnlyElements = document.querySelectorAll('[data-role="admin"]');
    const managerOnlyElements = document.querySelectorAll('[data-role="manager"]');
    const salesOnlyElements = document.querySelectorAll('[data-role="sales"]');
    const inventoryOnlyElements = document.querySelectorAll('[data-role="inventory"]');
    const accountingOnlyElements = document.querySelectorAll('[data-role="accounting"]');
    
    // Hide elements that don't match the user's role
    // Admin can see everything
    if (role !== 'admin') {
        adminOnlyElements.forEach(el => {
            el.classList.add('hidden');
        });
        
        if (role !== 'manager') {
            managerOnlyElements.forEach(el => {
                el.classList.add('hidden');
            });
        }
        
        if (role !== 'sales' && role !== 'manager') {
            salesOnlyElements.forEach(el => {
                el.classList.add('hidden');
            });
        }
        
        if (role !== 'inventory' && role !== 'manager') {
            inventoryOnlyElements.forEach(el => {
                el.classList.add('hidden');
            });
        }
        
        if (role !== 'accounting' && role !== 'manager') {
            accountingOnlyElements.forEach(el => {
                el.classList.add('hidden');
            });
        }
    }
}

/**
 * Load notifications from Firestore
 * @param {string} userId - User ID
 */
function loadNotifications(userId) {
    firebase.firestore().collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get()
        .then(snapshot => {
            const notificationBadge = document.getElementById('notificationBadge');
            if (notificationBadge) {
                const count = snapshot.size;
                
                if (count > 0) {
                    notificationBadge.textContent = count;
                    notificationBadge.classList.remove('hidden');
                } else {
                    notificationBadge.classList.add('hidden');
                }
            }
            
            // Update notification panel content if it exists
            updateNotificationPanel(snapshot.docs);
        })
        .catch(error => {
            console.error('Error loading notifications:', error);
        });
}

/**
 * Update notification panel with notification data
 * @param {Array} notifications - Array of notification documents
 */
function updateNotificationPanel(notifications) {
    const panel = document.querySelector('#notificationPanel .overflow-y-auto');
    if (!panel) return;
    
    // Clear existing notifications
    panel.innerHTML = '';
    
    if (notifications.length === 0) {
        // No notifications
        panel.innerHTML = `
            <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                <i class="fas fa-bell-slash text-2xl mb-2"></i>
                <p>${translationService.translate('no-notifications')}</p>
            </div>
        `;
        return;
    }
    
    // Create notification list
    const ul = document.createElement('ul');
    ul.className = 'divide-y divide-gray-200 dark:divide-gray-700';
    
    // Add notifications to list
    notifications.forEach(doc => {
        const notification = doc.data();
        const li = document.createElement('li');
        li.className = 'p-4 hover:bg-gray-50 dark:hover:bg-gray-700';
        
        let iconClass = '';
        switch (notification.type) {
            case 'success':
                iconClass = 'bg-green-100 dark:bg-green-900 rounded-full p-1';
                iconClass += ' text-green-600 dark:text-green-400';
                iconClass += ' fas fa-check-circle';
                break;
            case 'warning':
                iconClass = 'bg-yellow-100 dark:bg-yellow-900 rounded-full p-1';
                iconClass += ' text-yellow-600 dark:text-yellow-400';
                iconClass += ' fas fa-exclamation-triangle';
                break;
            case 'error':
                iconClass = 'bg-red-100 dark:bg-red-900 rounded-full p-1';
                iconClass += ' text-red-600 dark:text-red-400';
                iconClass += ' fas fa-exclamation-circle';
                break;
            default:
                iconClass = 'bg-blue-100 dark:bg-blue-900 rounded-full p-1';
                iconClass += ' text-blue-600 dark:text-blue-400';
                iconClass += ' fas fa-info-circle';
        }
        
        // Format notification time
        const timeAgo = formatTimeAgo(notification.createdAt?.toDate() || new Date());
        
        li.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="${iconClass}"></i>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                        ${notification.title}
                    </p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${notification.message}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${timeAgo}</p>
                </div>
                <button class="mark-read-btn ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" data-id="${doc.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add mark as read functionality
        li.querySelector('.mark-read-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            markNotificationAsRead(doc.id);
        });
        
        // Add click handler to go to notification link if provided
        if (notification.link) {
            li.addEventListener('click', () => {
                // Mark as read
                markNotificationAsRead(doc.id);
                // Navigate to link
                window.location.href = notification.link;
            });
        }
        
        ul.appendChild(li);
    });
    
    panel.appendChild(ul);
    
    // Add view all button
    const viewAllDiv = document.createElement('div');
    viewAllDiv.className = 'p-4 text-center';
    viewAllDiv.innerHTML = `
        <a href="#" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
            ${translationService.translate('view-all-notifications')}
        </a>
    `;
    panel.appendChild(viewAllDiv);
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification document ID
 */
function markNotificationAsRead(notificationId) {
    firebase.firestore().collection('notifications').doc(notificationId).update({
        read: true,
        readAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // Reload notifications
        loadNotifications(getCurrentUserId());
    })
    .catch(error => {
        console.error('Error marking notification as read:', error);
        showNotification('Failed to mark notification as read', 'error');
    });
}

/**
 * Format relative time (e.g., "5 minutes ago")
 * @param {Date} date - Date to format
 * @returns {string} Formatted relative time
 */
function formatTimeAgo(date) {
    if (!date) return '';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    // Time intervals in seconds
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    // Get current language for translation
    const lang = localStorage.getItem('hcp-erp-language') || 'en';
    
    // Time unit translations
    const timeUnits = {
        en: {
            year: ['year', 'years'],
            month: ['month', 'months'],
            week: ['week', 'weeks'],
            day: ['day', 'days'],
            hour: ['hour', 'hours'],
            minute: ['minute', 'minutes'],
            second: ['second', 'seconds'],
            ago: 'ago',
            just_now: 'just now'
        },
        ar: {
            year: ['سنة', 'سنوات'],
            month: ['شهر', 'شهور'],
            week: ['أسبوع', 'أسابيع'],
            day: ['يوم', 'أيام'],
            hour: ['ساعة', 'ساعات'],
            minute: ['دقيقة', 'دقائق'],
            second: ['ثانية', 'ثواني'],
            ago: 'مضت',
            just_now: 'الآن'
        }
    };
    
    const units = timeUnits[lang] || timeUnits.en;
    
    // Very recent
    if (seconds < 5) return units.just_now;
    
    // Find the appropriate interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        
        if (interval >= 1) {
            // Format with correct plural form
            const unitStr = interval === 1 ? units[unit][0] : units[unit][1];
            
            // Format based on language
            if (lang === 'ar') {
                return `${unitStr} ${interval} ${units.ago}`;
            } else {
                return `${interval} ${unitStr} ${units.ago}`;
            }
        }
    }
    
    return units.just_now;
}

/**
 * Initialize tasks if on dashboard
 */
function initTaskManagement() {
    // Task list click handlers
    const tasksList = document.getElementById('tasksList');
    if (tasksList) {
        tasksList.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox') {
                const checkbox = e.target;
                const taskId = checkbox.dataset.id;
                const taskLabel = checkbox.parentElement.querySelector('label');
                
                // Toggle completed state in UI
                if (checkbox.checked) {
                    taskLabel.classList.add('line-through', 'text-gray-400');
                } else {
                    taskLabel.classList.remove('line-through', 'text-gray-400');
                }
                
                // Update task in Firestore if task has an ID
                if (taskId) {
                    updateTaskStatus(taskId, checkbox.checked);
                }
            }
        });
    }
    
    // Add task modal functionality
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    
    if (addTaskBtn && addTaskModal) {
        // Open modal
        addTaskBtn.addEventListener('click', function() {
            addTaskModal.classList.remove('hidden');
            document.getElementById('taskTitle').focus();
        });
        
        // Close modal
        cancelTaskBtn.addEventListener('click', function() {
            addTaskModal.classList.add('hidden');
            document.getElementById('addTaskForm').reset();
        });
        
        // Save task
        saveTaskBtn.addEventListener('click', function() {
            const title = document.getElementById('taskTitle').value.trim();
            const dueDate = document.getElementById('taskDueDate').value;
            const priority = document.getElementById('taskPriority').value;
            const notes = document.getElementById('taskNotes').value.trim();
            
            if (!title) {
                showNotification(translationService.translate('task-title-required'), 'error');
                return;
            }
            
            // Add task to Firestore
            addNewTask(title, dueDate, priority, notes);
            
            // Close modal and reset form
            addTaskModal.classList.add('hidden');
            document.getElementById('addTaskForm').reset();
        });
    }
}

/**
 * Load tasks from Firestore
 * @param {string} userId - User ID
 */
function loadTasks(userId) {
    firebase.firestore().collection('tasks')
        .where('userId', '==', userId)
        .orderBy('dueDate', 'asc')
        .limit(5)
        .get()
        .then(snapshot => {
            const tasksList = document.getElementById('tasksList');
            if (!tasksList) return;
            
            // Clear existing tasks
            tasksList.innerHTML = '';
            
            // Add tasks to list
            snapshot.forEach(doc => {
                const task = doc.data();
                addTaskToList(tasksList, doc.id, task);
            });
            
            // If no tasks, show message
            if (snapshot.empty) {
                tasksList.innerHTML = `
                    <li class="py-3 text-center text-gray-500 dark:text-gray-400">
                        <i class="fas fa-tasks mb-2"></i>
                        <p>${translationService.translate('no-tasks')}</p>
                    </li>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
            showNotification('Failed to load tasks', 'error');
        });
}

/**
 * Add a task to the task list
 * @param {HTMLElement} tasksList - Tasks list container
 * @param {string} taskId - Task document ID
 * @param {Object} task - Task data
 */
function addTaskToList(tasksList, taskId, task) {
    const li = document.createElement('li');
    li.className = 'py-3';
    
    const dueDateFormatted = task.dueDate ? formatDate(task.dueDate.toDate(), 'short') : '';
    
    // Determine priority class and text
    let priorityClass, priorityText;
    switch (task.priority) {
        case 'high':
            priorityClass = 'text-red-500 dark:text-red-400';
            priorityText = translationService.translate('high');
            break;
        case 'medium':
            priorityClass = 'text-yellow-500 dark:text-yellow-400';
            priorityText = translationService.translate('medium');
            break;
        case 'low':
            priorityClass = 'text-blue-500 dark:text-blue-400';
            priorityText = translationService.translate('low');
            break;
        default:
            priorityClass = 'text-gray-500 dark:text-gray-400';
            priorityText = translationService.translate('normal');
    }
    
    // Set completed class if task is completed
    const completedClass = task.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300';
    
    li.innerHTML = `
        <div class="flex items-center">
            <input type="checkbox" data-id="${taskId}" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" ${task.completed ? 'checked' : ''}>
            <label class="ml-3 text-sm ${completedClass}">
                ${task.title}
            </label>
        </div>
        <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span><i class="far fa-calendar mr-1"></i> ${dueDateFormatted}</span>
            <span class="${priorityClass}"><i class="fas fa-star mr-1"></i> ${priorityText}</span>
        </div>
    `;
    
    tasksList.appendChild(li);
}

/**
 * Add a new task to Firestore
 * @param {string} title - Task title
 * @param {string} dueDate - Task due date
 * @param {string} priority - Task priority
 * @param {string} notes - Task notes
 */
function addNewTask(title, dueDate, priority, notes) {
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('You must be logged in to add tasks', 'error');
        return;
    }
    
    const task = {
        title: title,
        dueDate: dueDate ? firebase.firestore.Timestamp.fromDate(new Date(dueDate)) : null,
        priority: priority,
        notes: notes,
        completed: false,
        userId: userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    firebase.firestore().collection('tasks').add(task)
        .then(docRef => {
            showNotification(translationService.translate('task-added'), 'success');
            
            // Reload tasks
            loadTasks(userId);
        })
        .catch(error => {
            console.error('Error adding task:', error);
            showNotification(translationService.translate('failed-add-task'), 'error');
        });
}

/**
 * Update task status in Firestore
 * @param {string} taskId - Task document ID
 * @param {boolean} completed - Whether task is completed
 */
function updateTaskStatus(taskId, completed) {
    firebase.firestore().collection('tasks').doc(taskId).update({
        completed: completed,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // Task updated successfully
    })
    .catch(error => {
        console.error('Error updating task:', error);
        showNotification(translationService.translate('failed-update-task'), 'error');
    });
}

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        // Open sidebar
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        appState.isMenuOpen = true;
    } else {
        // Close sidebar
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        appState.isMenuOpen = false;
    }
}

/**
 * Close sidebar
 */
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    appState.isMenuOpen = false;
}

/**
 * Toggle user menu
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    
    if (userMenu.classList.contains('hidden')) {
        // Open menu
        userMenu.classList.remove('hidden');
        appState.userMenuOpen = true;
    } else {
        // Close menu
        userMenu.classList.add('hidden');
        appState.userMenuOpen = false;
    }
}

/**
 * Toggle notifications panel
 */
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    
    if (panel.classList.contains('translate-x-full')) {
        // Open panel
        panel.classList.remove('translate-x-full');
        appState.notificationsOpen = true;
    } else {
        // Close panel
        panel.classList.add('translate-x-full');
        appState.notificationsOpen = false;
    }
}

/**
 * Set active navigation item based on current page
 */
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove active classes from all links first
        link.classList.remove('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-100');
        link.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-50', 'dark:hover:bg-gray-700', 'hover:text-gray-900', 'dark:hover:text-white');
        
        // Check if this link matches the current page
        if (href && (currentPath.endsWith(href) || currentPath.includes(href))) {
            // Add active classes
            link.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-50', 'dark:hover:bg-gray-700', 'hover:text-gray-900', 'dark:hover:text-white');
            link.classList.add('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-100');
        }
    });
}

/**
 * Check if the current page matches a given page name
 * @param {string} pageName - Page name to check against
 * @returns {boolean} True if current page matches
 */
function isCurrentPage(pageName) {
    const path = window.location.pathname;
    return path.endsWith(pageName) || path === pageName || 
           (pageName === '/' && (path.endsWith('/index.html') || path.endsWith('/')));
}

/**
 * Get current module name from URL
 * @returns {string} Current module name
 */
function getCurrentModule() {
    const path = window.location.pathname;
    
    // Check if in a module
    if (path.includes('/modules/')) {
        const moduleParts = path.split('/modules/');
        if (moduleParts.length > 1) {
            // Extract module name without .html
            return moduleParts[1].replace('.html', '');
        }
    }
    
    // Default to dashboard if not in a specific module
    return 'dashboard';
}

/**
 * Initialize page-specific functions
 */
function initPageFunctions() {
    // Check which page we're on and init appropriate functions
    if (isCurrentPage('index.html') || isCurrentPage('/')) {
        // Dashboard specific initializations
    } else if (isCurrentPage('modules/customers.html')) {
        // Customer module initializations
    } else if (isCurrentPage('modules/sales.html')) {
        // Sales module initializations
    } else if (isCurrentPage('modules/inventory.html')) {
        // Inventory module initializations
    } else if (isCurrentPage('modules/invoices.html')) {
        // Invoices module initializations
    } else if (isCurrentPage('modules/suppliers.html')) {
        // Suppliers module initializations
    } else if (isCurrentPage('modules/reports.html')) {
        // Reports module initializations
    } else if (isCurrentPage('modules/users.html')) {
        // Users module initializations
    }
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    // This will be handled by the Firebase onAuthStateChanged in initFirebaseAuth
}
