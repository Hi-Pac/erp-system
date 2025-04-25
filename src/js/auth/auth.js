import { auth } from '../services/firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { showToast } from '../common/toast.js';
import { getUserRole } from '../services/firestore-service.js';

// Current authenticated user
let currentUser = null;

// Authentication state observer
const initAuth = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    onAuthStateChanged(auth, async (user) => {
        loadingScreen.classList.add('hidden');
        
        if (user) {
            // User is signed in
            currentUser = user;
            
            // Fetch user role and store it
            try {
                const userRole = await getUserRole(user.uid);
                if (userRole) {
                    sessionStorage.setItem('userRole', userRole);
                    document.getElementById('user-role').textContent = formatRoleName(userRole);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
            
            // Update UI
            document.getElementById('user-name').textContent = user.displayName || user.email;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            // Initialize application
            window.dispatchEvent(new CustomEvent('app:authenticated'));
        } else {
            // User is signed out
            currentUser = null;
            sessionStorage.removeItem('userRole');
            
            // Update UI
            loginScreen.classList.remove('hidden');
            mainApp.classList.add('hidden');
            
            // Display login form
            renderLoginForm();
        }
    });
};

// Format role name for display
const formatRoleName = (role) => {
    switch(role) {
        case 'admin': return 'Administrator';
        case 'supervisor': return 'Supervisor';
        case 'user': return 'Standard User';
        default: return role;
    }
};

// Render login form
const renderLoginForm = () => {
    const loginScreen = document.getElementById('login-screen');
    
    loginScreen.innerHTML = `
        <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 fade-in">
            <div class="flex justify-center mb-6">
                <h1 class="text-2xl font-bold text-primary-600">HCP ERP</h1>
            </div>
            <h2 class="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">Login to your account</h2>
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-gray-700 dark:text-gray-300 mb-1" for="email">Email</label>
                    <input id="email" type="email" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" required>
                </div>
                <div>
                    <label class="block text-gray-700 dark:text-gray-300 mb-1" for="password">Password</label>
                    <input id="password" type="password" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" required>
                </div>
                <div id="login-error" class="text-red-500 text-sm hidden"></div>
                <button type="submit" class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Login
                </button>
                <div class="text-sm text-center mt-2">
                    <a href="#" id="forgot-password" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">Forgot Password?</a>
                </div>
            </form>
            <div class="flex justify-between items-center mt-6">
                <button id="toggle-theme" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">
                    <i class="fas fa-moon dark:hidden"></i>
                    <i class="fas fa-sun hidden dark:block"></i>
                </button>
                <div>
                    <button id="lang-ar" class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">العربية</button>
                    <span class="text-gray-500">|</span>
                    <button id="lang-en" class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500">English</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('forgot-password').addEventListener('click', handleForgotPassword);
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
};

// Handle login form submission
const handleLogin = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');
    
    loginError.classList.add('hidden');
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Login successful - onAuthStateChanged will handle the UI update
    } catch (error) {
        // Handle errors
        loginError.textContent = getAuthErrorMessage(error.code);
        loginError.classList.remove('hidden');
    }
};

// Handle forgot password
const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        showToast('Please enter your email address first', 'error');
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent. Check your inbox.', 'success');
    } catch (error) {
        showToast(getAuthErrorMessage(error.code), 'error');
    }
};

// Handle logout
const handleLogout = async () => {
    try {
        await signOut(auth);
        // Sign-out successful - onAuthStateChanged will handle the UI update
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error signing out. Please try again.', 'error');
    }
};

// Get auth error message
const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many failed login attempts. Please try again later.';
        case 'auth/email-already-in-use':
            return 'Email already in use.';
        case 'auth/weak-password':
            return 'Password is too weak.';
        default:
            return 'An error occurred. Please try again.';
    }
};

// Toggle theme (dark/light mode)
const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
};

// Set language
const setLanguage = (lang) => {
    localStorage.setItem('language', lang);
    document.body.classList.toggle('rtl', lang === 'ar');
    window.dispatchEvent(new CustomEvent('language:changed', { detail: { language: lang } }));
};

// Get current authenticated user
const getCurrentUser = () => {
    return currentUser;
};

// Get user role
const getUserRole = () => {
    return sessionStorage.getItem('userRole') || 'user';
};

// Check if user is admin
const isAdmin = () => {
    return getUserRole() === 'admin';
};

// Create a new user (Admin function)
const createUser = async (email, password, displayName, role) => {
    try {
        // Check if current user is admin
        if (!isAdmin()) {
            throw new Error('Only administrators can create users');
        }

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, { displayName });
        
        // Save user role in Firestore
        await setUserRole(user.uid, role);
        
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Export authentication functions
export {
    initAuth,
    handleLogin,
    handleLogout,
    getCurrentUser,
    getUserRole,
    isAdmin,
    createUser,
    toggleTheme,
    setLanguage
};