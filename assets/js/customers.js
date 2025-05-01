// customers.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const customerTableBody = document.getElementById("customer-table-body");
const addCustomerBtn = document.getElementById("add-customer-btn");

// Load Customers
async function loadCustomers() {
  const querySnapshot = await getDocs(collection(db, "customers"));
  customerTableBody.innerHTML = ""; // Clear table
  querySnapshot.forEach((doc) => {
    const customer = doc.data();
    const row = `
      <tr>
        <td class="p-4">${customer.name}</td>
        <td class="p-4">${customer.email}</td>
        <td class="p-4">${customer.phone}</td>
        <td class="p-4">
          <button class="text-red-500 delete-btn" data-id="${doc.id}">Delete</button>
        </td>
      </tr>
    `;
    customerTableBody.innerHTML += row;
  });

  // Attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "customers", id));
      loadCustomers();
    });
  });
}

// Add Customer
addCustomerBtn.addEventListener("click", async () => {
  const name = prompt("Enter Customer Name:");
  const email = prompt("Enter Customer Email:");
  const phone = prompt("Enter Customer Phone:");
  if (name && email && phone) {
    await addDoc(collection(db, "customers"), { name, email, phone });
    loadCustomers();
  }
});

// Initial Load
loadCustomers();
