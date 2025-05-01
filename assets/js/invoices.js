// invoices.js

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
const invoiceTableBody = document.getElementById("invoice-table-body");
const addInvoiceBtn = document.getElementById("add-invoice-btn");

// Load Invoices
async function loadInvoices() {
  const querySnapshot = await getDocs(collection(db, "invoices"));
  invoiceTableBody.innerHTML = ""; // Clear table
  querySnapshot.forEach((doc) => {
    const invoice = doc.data();
    const row = `
      <tr>
        <td class="p-4">${doc.id}</td>
        <td class="p-4">${invoice.customer}</td>
        <td class="p-4">${invoice.amount}</td>
        <td class="p-4">${invoice.date}</td>
        <td class="p-4">
          <button class="text-red-500 delete-btn" data-id="${doc.id}">Delete</button>
        </td>
      </tr>
    `;
    invoiceTableBody.innerHTML += row;
  });

  // Attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "invoices", id));
      loadInvoices();
    });
  });
}

// Add Invoice
addInvoiceBtn.addEventListener("click", async () => {
  const customer = prompt("Enter Customer Name:");
  const amount = prompt("Enter Invoice Amount:");
  const date = new Date().toISOString().split("T")[0]; // Current Date
  if (customer && amount) {
    await addDoc(collection(db, "invoices"), { customer, amount, date });
    loadInvoices();
  }
});

// Initial Load
loadInvoices();
