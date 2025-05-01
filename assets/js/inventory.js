// inventory.js

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
const inventoryTableBody = document.getElementById("inventory-table-body");
const addItemBtn = document.getElementById("add-item-btn");

// Load Inventory Items
async function loadInventoryItems() {
  const querySnapshot = await getDocs(collection(db, "inventory"));
  inventoryTableBody.innerHTML = ""; // Clear table
  querySnapshot.forEach((doc) => {
    const item = doc.data();
    const row = `
      <tr>
        <td class="p-4">${item.name}</td>
        <td class="p-4">${item.quantity}</td>
        <td class="p-4">${item.price}</td>
        <td class="p-4">
          <button class="text-red-500 delete-btn" data-id="${doc.id}">Delete</button>
        </td>
      </tr>
    `;
    inventoryTableBody.innerHTML += row;
  });

  // Attach delete event listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "inventory", id));
      loadInventoryItems();
    });
  });
}

// Add Inventory Item
addItemBtn.addEventListener("click", async () => {
  const name = prompt("Enter Item Name:");
  const quantity = prompt("Enter Quantity:");
  const price = prompt("Enter Price:");
  if (name && quantity && price) {
    await addDoc(collection(db, "inventory"), { name, quantity, price });
    loadInventoryItems();
  }
});

// Initial Load
loadInventoryItems();
