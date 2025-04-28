/**
 * HCP-ERP Firebase Configuration
 * Contains Firebase initialization and configuration settings
 */

// Your Firebase configuration
// Replace with your actual Firebase project config
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD7O1-SFhY3XUc4ZL2MWo83nl-DfvGq3LI",
    authDomain: "erp-system-24f05.firebaseapp.com",
    projectId: "erp-system-24f05",
    storageBucket: "erp-system-24f05.firebasestorage.app",
    messagingSenderId: "1015081257227",
    appId: "1:1015081257227:web:ab95b6dbe9b678ef4cba0e",
    measurementId: "G-3VH3396ZDG"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore settings
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Enable offline persistence (for better UX when connection is lost)
db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.warn('Firebase persistence not supported in this browser');
    }
  });

/**
 * Current user utility function
 * @returns {Object|null} Firebase user object or null if not authenticated
 */
function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Current user ID utility function
 * @returns {string|null} User ID or null if not authenticated
 */
function getCurrentUserId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

/**
 * Check if user has admin role
 * @returns {Promise<boolean>} Promise that resolves to true if user is admin
 */
async function isUserAdmin() {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data().role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if current user has a specific role
 * @param {string} role - Role to check for
 * @returns {Promise<boolean>} Promise that resolves to true if user has the role
 */
async function hasUserRole(role) {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data().role === role;
    }
    return false;
  } catch (error) {
    console.error('Error checking role status:', error);
    return false;
  }
}
