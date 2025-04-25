const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Access Firestore database
const db = admin.firestore();

// Create a user record in Firestore when a new user is created in Authentication
exports.createUserRecord = functions.auth.user().onCreate((user) => {
  return db.collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    role: 'user', // Default role
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

// Clean up user data when a user is deleted
exports.cleanupUserData = functions.auth.user().onDelete((user) => {
  return db.collection('users').doc(user.uid).delete();
});

// Automatically add timestamps to documents
exports.addTimestamps = functions.firestore
  .document('{collection}/{docId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    // Skip if already has timestamp
    if (data.createdAt) {
      return null;
    }
    
    return snap.ref.update({
      createdAt: now,
      updatedAt: now
    });
  });

// Update timestamp on document update
exports.updateTimestamp = functions.firestore
  .document('{collection}/{docId}')
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    
    // Skip if same updatedAt timestamp
    if (data.updatedAt && data.updatedAt.isEqual(previousData.updatedAt)) {
      return null;
    }
    
    return change.after.ref.update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

// Generate invoice numbers
exports.generateInvoiceNumber = functions.firestore
  .document('invoices/{invoiceId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Skip if already has invoice number
    if (data.invoiceNumber) {
      return null;
    }
    
    // Get current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Get counter document
    const counterRef = db.collection('counters').doc('invoices');
    
    // Transaction to get and update counter
    return db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      // Calculate new counter value
      let counter = 1;
      if (counterDoc.exists) {
        const counterData = counterDoc.data();
        if (counterData.year === year && counterData.month === month) {
          counter = counterData.value + 1;
        }
      }
      
      // Update counter
      transaction.set(counterRef, {
        year,
        month,
        value: counter
      });
      
      // Generate invoice number (e.g., INV-2023-04-0001)
      const invoiceNumber = `INV-${year}-${month}-${String(counter).padStart(4, '0')}`;
      
      // Update invoice document
      transaction.update(snap.ref, { invoiceNumber });
      
      return invoiceNumber;
    });
  });

// Send notification on new orders
exports.notifyNewOrder = functions.firestore
  .document('invoices/{invoiceId}')
  .onCreate(async (snap, context) => {
    const invoice = snap.data();
    
    // Get admin users
    const adminsSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .get();
    
    // No admin users found
    if (adminsSnapshot.empty) {
      return null;
    }
    
    // Prepare notification data
    const notification = {
      title: 'New Order',
      message: `Order ${invoice.invoiceNumber || context.params.invoiceId} has been created`,
      type: 'invoice',
      referenceId: context.params.invoiceId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    };
    
    // Add notification for each admin
    const notifications = [];
    adminsSnapshot.forEach(adminDoc => {
      notifications.push(
        db.collection('users').doc(adminDoc.id)
          .collection('notifications')
          .add(notification)
      );
    });
    
    return Promise.all(notifications);
  });