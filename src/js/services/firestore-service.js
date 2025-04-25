import { db } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getCurrentUser } from '../auth/auth.js';

/**
 * Get a document from a collection by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Document data
 */
export const getDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error(`Document not found in ${collectionName}`);
        }
    } catch (error) {
        console.error(`Error getting document from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Get documents from a collection with filtering, sorting, and pagination
 * @param {string} collectionName - Collection name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Query results and pagination info
 */
export const getDocuments = async (collectionName, options = {}) => {
    try {
        const {
            filters = [],
            sortField = 'createdAt',
            sortDirection = 'desc',
            pageSize = 10,
            startAfterDoc = null
        } = options;
        
        let constraints = [];
        
        // Add filters
        filters.forEach(filter => {
            if (filter.field && filter.operator && filter.value !== undefined) {
                constraints.push(where(filter.field, filter.operator, filter.value));
            }
        });
        
        // Add sorting
        constraints.push(orderBy(sortField, sortDirection));
        
        // Add pagination
        if (startAfterDoc) {
            constraints.push(startAfter(startAfterDoc));
        }
        
        constraints.push(limit(pageSize));
        
        // Execute query
        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        
        // Process results
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return {
            documents,
            lastVisible: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
            hasMore: querySnapshot.docs.length === pageSize
        };
    } catch (error) {
        console.error(`Error getting documents from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Add a document to a collection
 * @param {string} collectionName - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<string>} - Document ID
 */
export const addDocument = async (collectionName, data) => {
    try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        // Add metadata
        const documentData = {
            ...data,
            createdAt: serverTimestamp(),
            createdBy: currentUser.uid
        };
        
        const docRef = await addDoc(collection(db, collectionName), documentData);
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Update a document in a collection
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
    try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        // Add metadata
        const documentData = {
            ...data,
            updatedAt: serverTimestamp(),
            updatedBy: currentUser.uid
        };
        
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, documentData);
    } catch (error) {
        console.error(`Error updating document in ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Delete a document from a collection
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Error deleting document from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Get a user's role from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} - User role
 */
export const getUserRole = async (userId) => {
    try {
        const userDoc = await getDocument('users', userId);
        return userDoc.role || null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
};

/**
 * Set a user's role in Firestore
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<void>}
 */
export const setUserRole = async (userId, role) => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            await updateDoc(docRef, { role });
        } else {
            await setDoc(docRef, { 
                role,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error setting user role:', error);
        throw error;
    }
};