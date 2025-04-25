// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// HCP ERP Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7O1-SFhY3XUc4ZL2MWo83nl-DfvGq3LI",
  authDomain: "erp-system-24f05.firebaseapp.com",
  projectId: "erp-system-24f05",
  storageBucket: "erp-system-24f05.firebasestorage.app",
  messagingSenderId: "1015081257227",
  appId: "1:1015081257227:web:ab95b6dbe9b678ef4cba0e",
  measurementId: "G-3VH3396ZDG"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export the Firebase services for use in other modules
export { app, auth, db, analytics };
