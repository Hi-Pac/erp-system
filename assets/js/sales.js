// assets/js/sales.js
const db = firebase.firestore();
const ordersTableBody = getEl('#ordersTableBody');
const orderForm       = getEl('#orderForm');
const addOrderBtn     = getEl('#addOrderBtn');
let editOrderId = null;

// 1. Load existing orders
function loadOrders() {
  ordersTableBody.innerHTML = '';
  db.collection('sales')
    .orderBy('date', 'desc')
    .get()
    .then(snap => {
      snap.forEach(doc => {
        const d = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="p-2">${new Date(d.date.seconds*1000).toLocaleDateString()}</td>
          <td class="p-2">${d.customer}</td>
          <td class="p-2">${d.total}</td>
          <td class="p-2">${d.status}</td>
          <td class="p-2 space-x-2">
            <button onclick="openEditOrder('${doc.id}','${d.date.seconds}','${d.customer}','${d.total}','${d.status}')"
                    class="text-blue-600">Edit</button>
            <button onclick="deleteOrder('${doc.id}')" class="text-red-600">Delete</button>
          </td>`;
        ordersTableBody.appendChild(row);
      });
    });
}

// 2. Show modal to add new order
addOrderBtn.addEventListener('click', () => {
  editOrderId = null;
  getEl('#orderModalTitle').innerText = 'New Order';
  orderForm.reset();
  toggleModal('orderModal');
});

// 3. Submit handler (create or update)
orderForm.addEventListener('submit', e => {
  e.preventDefault();
  const date     = firebase.firestore.Timestamp.fromDate(new Date(getEl('#orderDate').value));
  const customer = getEl('#orderCustomer').value;
  const total    = parseFloat(getEl('#orderTotal').value);
  const status   = getEl('#orderStatus').value;

  const payload = { date, customer, total, status };
  const col     = db.collection('sales');

  const action = editOrderId
    ? col.doc(editOrderId).update(payload)
    : col.add(payload);

  action.then(() => {
    toggleModal('orderModal');
    loadOrders();
  });
});

// 4. Helpers for edit/delete
window.openEditOrder = (id, dateSec, cust, tot, stat) => {
  editOrderId = id;
  getEl('#orderModalTitle').innerText = 'Edit Order';
  getEl('#orderDate').value       = new Date(Number(dateSec)*1000).toISOString().substr(0,10);
  getEl('#orderCustomer').value   = cust;
  getEl('#orderTotal').value      = tot;
  getEl('#orderStatus').value     = stat;
  toggleModal('orderModal');
};

window.deleteOrder = id =>
  db.collection('sales').doc(id).delete().then(loadOrders);

// 5. Initial load
loadOrders();
