/**
 * HCP-ERP Authentication Module
 * Handles user login, registration, and session management using Firebase Auth
 */

// Ensure document is loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication state
    initAuth();
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength meter
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
    }
    
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const logoutBtnMenu = document.getElementById('logoutBtnMenu');
    if (logoutBtnMenu) {
        logoutBtnMenu.addEventListener('click', handleLogout);
    }
    
    // Social login handlers
    const googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
        googleLogin.addEventListener('click', () => handleSocialLogin('google'));
    }
    
    const microsoftLogin = document.getElementById('microsoftLogin');
    if (microsoftLogin) {
        microsoftLogin.addEventListener('click', () => handleSocialLogin('microsoft'));
    }
    
    const googleSignup = document.getElementById('googleSignup');
    if (googleSignup) {
        googleSignup.addEventListener('click', () => handleSocialLogin('google'));
    }
    
    const microsoftSignup = document.getElementById('microsoftSignup');
    if (microsoftSignup) {
        microsoftSignup.addEventListener('click', () => handleSocialLogin('microsoft'));
    }
});

/**
 * Initialize authentication state and redirect if needed
 */
function initAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('login.html');
        const isRegisterPage = currentPath.includes('register.html');
        const isAuthPage = isLoginPage || isRegisterPage;
        
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            updateUserInfo(user);
            
            // If on login/register page, redirect to dashboard
            if (isAuthPage) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // If not on login/register page, redirect to login
            if (!isAuthPage && !currentPath.includes('forgot-password.html')) {
                window.location.href = 'login.html';
            }
        }
    });
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    const errorMsg = document.getElementById('errorMsg');
    
    // Set persistence based on remember me checkbox
    const persistence = rememberMe 
        ? firebase.auth.Auth.Persistence.LOCAL 
        : firebase.auth.Auth.Persistence.SESSION;
    
    // Clear previous errors
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
    
    // Disable form and show loading state
    toggleLoginFormLoading(true);
    
    // Set persistence then sign in
    firebase.auth().setPersistence(persistence)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .then(() => {
            // Login successful, redirect will happen in onAuthStateChanged
            console.log('Login successful');
        })
        .catch((error) => {
            // Handle errors
            console.error('Login error:', error);
            errorMsg.textContent = getAuthErrorMessage(error.code);
            errorMsg.classList.remove('hidden');
            toggleLoginFormLoading(false);
        });
}

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    const errorMsg = document.getElementById('errorMsg');
    
    // Clear previous errors
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
    
    // Validate inputs
    if (password !== confirmPassword) {
        errorMsg.textContent = translationService.translate('passwords-dont-match');
        errorMsg.classList.remove('hidden');
        return;
    }
    
    if (!termsAccepted) {
        errorMsg.textContent = translationService.translate('terms-required');
        errorMsg.classList.remove('hidden');
        return;
    }
    
    // Disable form and show loading state
    toggleRegisterFormLoading(true);
    
    // Create user
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Save additional user info to Firestore
            const user = userCredential.user;
            
            // Update profile with display name
            return user.updateProfile({
                displayName: `${firstName} ${lastName}`
            }).then(() => {
                // Save user data to Firestore
                return firebase.firestore().collection('users').doc(user.uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    company: company,
                    role: 'user',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        })
        .then(() => {
            // Registration successful, redirect will happen in onAuthStateChanged
            console.log('Registration successful');
        })
        .catch((error) => {
            // Handle errors
            console.error('Registration error:', error);
            errorMsg.textContent = getAuthErrorMessage(error.code);
            errorMsg.classList.remove('hidden');
            toggleRegisterFormLoading(false);
        });
}

/**
 * Handle social login (Google, Microsoft)
 * @param {string} provider - The provider to use ('google' or 'microsoft')
 */
function handleSocialLogin(provider) {
    let authProvider;
    
    if (provider === 'google') {
        authProvider = new firebase.auth.GoogleAuthProvider();
    } else if (provider === 'microsoft') {
        authProvider = new firebase.auth.OAuthProvider('microsoft.com');
    } else {
        console.error('Unsupported provider:', provider);
        return;
    }
    
    firebase.auth().signInWithPopup(authProvider)
        .then((result) => {
            // Social login successful, check if new user
            const isNewUser = result.additionalUserInfo.isNewUser;
            const user = result.user;
            
            if (isNewUser) {
                // Save new user data to Firestore
                return firebase.firestore().collection('users').doc(user.uid).set({
                    firstName: user.displayName.split(' ')[0],
                    lastName: user.displayName.split(' ').slice(1).join(' '),
                    email: user.email,
                    company: '',
                    role: 'user',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    authProvider: provider
                });
            }
        })
        .catch((error) => {
            // Handle errors
            console.error('Social login error:', error);
            const errorMsg = document.getElementById('errorMsg');
            if (errorMsg) {
                errorMsg.textContent = getAuthErrorMessage(error.code);
                errorMsg.classList.remove('hidden');
            }
        });
}

/**
 * Handle user logout
 */
function handleLogout() {
    firebase.auth().signOut()
        .then(() => {
            // Sign-out successful, redirect to login page
            window.location.href = 'login.html';
        })
        .catch((error) => {
            // An error happened
            console.error('Logout error:', error);
        });
}

/**
 * Update UI with user information
 * @param {Object} user - Firebase user object
 */
function updateUserInfo(user) {
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
        } else {
            // Generate avatar from name
            const displayName = user.displayName || user.email.split('@')[0];
            userAvatar.src = `https://ui-avatars.com/api/?name=${displayName.replace(/\s+/g, '+')}&background=0062cc&color=fff`;
        }
    }
    
    // Fetch additional user data from Firestore if needed
    firebase.firestore().collection('users').doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                // Update UI with user role or other data
                console.log('User data:', userData);
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}

/**
 * Check password strength and update meter
 */
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const meter = document.getElementById('passwordStrength');
    
    if (!meter) return;
    
    // Remove all classes
    meter.classList.remove('weak', 'medium', 'strong');
    
    if (password.length === 0) {
        meter.style.width = '0';
        return;
    }
    
    // Check strength
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Set meter width and class
    if (strength < 3) {
        meter.classList.add('weak');
        meter.style.width = '33%';
    } else if (strength < 5) {
        meter.classList.add('medium');
        meter.style.width = '66%';
    } else {
        meter.classList.add('strong');
        meter.style.width = '100%';
    }
}

/**
 * Toggle loading state for login form
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function toggleLoginFormLoading(isLoading) {
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const inputs = document.querySelectorAll('#loginForm input');
    
    if (isLoading) {
        submitBtn.innerHTML = `<span class="spinner"></span> <span data-lang="logging-in">${translationService.translate('logging-in')}...</span>`;
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = `<i class="fas fa-sign-in-alt mr-2"></i> <span data-lang="login-button">${translationService.translate('login-button')}</span>`;
        inputs.forEach(input => input.disabled = false);
        submitBtn.disabled = false;
    }
}

/**
 * Toggle loading state for register form
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function toggleRegisterFormLoading(isLoading) {
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const inputs = document.querySelectorAll('#registerForm input, #registerForm select');
    
    if (isLoading) {
        submitBtn.innerHTML = `<span class="spinner"></span> <span data-lang="registering">${translationService.translate('registering')}...</span>`;
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = `<i class="fas fa-user-plus mr-2"></i> <span data-lang="register-button">${translationService.translate('register-button')}</span>`;
        inputs.forEach(input => input.disabled = false);
        submitBtn.disabled = false;
    }
}

/**
 * Get user-friendly error message for authentication errors
 * @param {string} errorCode - Firebase auth error code
 * @returns {string} User-friendly error message
 */
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': translationService.translate('error-email-in-use'),
        'auth/invalid-email': translationService.translate('error-invalid-email'),
        'auth/operation-not-allowed': translationService.translate('error-operation-not-allowed'),
        'auth/weak-password': translationService.translate('error-weak-password'),
        'auth/user-disabled': translationService.translate('error-user-disabled'),
        'auth/user-not-found': translationService.translate('error-user-not-found'),
        'auth/wrong-password': translationService.translate('error-wrong-password'),
        'auth/too-many-requests': translationService.translate('error-too-many-attempts'),
        'auth/network-request-failed': translationService.translate('error-network-issue')
    };
    
    return errorMessages[errorCode] || translationService.translate('error-unknown');
}
