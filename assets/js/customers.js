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
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
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
