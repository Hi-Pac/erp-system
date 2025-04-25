// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// HCP ERP Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDjszR5bbHZeJDUowuer3S-Stx6cKHLOc",
    authDomain: "hcp-erp-1b930.firebaseapp.com",
    projectId: "hcp-erp-1b930",
    storageBucket: "hcp-erp-1b930.firebasestorage.app",
    messagingSenderId: "1037329690081",
    appId: "1:1037329690081:web:6659b5f072cb63b43436a0",
    measurementId: "G-DMT14M43MY"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export the Firebase services for use in other modules
export { app, auth, db, analytics };