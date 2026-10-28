let transactions = [];

const form = document.getElementById('transaction-form');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const clearBtn = document.getElementById('clear-btn');
const filterSelect = document.getElementById('filter');
const transactionList = document.getElementById('transaction-list');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const currentBalanceEl = document.getElementById('current-balance');

function showPopup(message) {
  alert(message);
}

function formatLKR(amount) {
  return `LKR ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
  }
}

function calculateTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((t) => {
    if (t.type === 'Income') {
      totalIncome += t.amount;
    } else if (t.type === 'Expense') {
      totalExpenses += t.amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  totalIncomeEl.textContent = formatLKR(totalIncome);
  totalExpensesEl.textContent = formatLKR(totalExpenses);
  currentBalanceEl.textContent = formatLKR(balance);
}

function renderTable() {
  const filterValue = filterSelect.value;
  transactionList.innerHTML = '';

  const filteredTransactions = transactions.filter((t) => {
    if (filterValue === 'All') return true;
    return t.type === filterValue;
  });

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">No transactions found.</td></tr>`;
    return;
  }

  filteredTransactions.forEach((t) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td><span class="badge ${t.type.toLowerCase()}">${t.type}</span></td>
      <td>${t.category}</td>
      <td>${formatLKR(t.amount)}</td>
      <td>
        <button type="button" class="btn btn-delete" data-id="${t.id}">Delete</button>
      </td>
    `;

    const deleteBtn = row.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(t.id);
        showPopup('Transaction deleted successfully!');
      }
    });

    transactionList.appendChild(row);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const type = typeInput.value;
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();
  const date = dateInput.value;

  if (!description || !category || !date || isNaN(amount) || amount <= 0) {
    showPopup('Please fill out all required fields with valid details. Amount must be greater than zero.');
    return;
  }

  const newTransaction = {
    id: Date.now().toString(),
    type,
    description,
    amount,
    category,
    date
  };

  transactions.push(newTransaction);
  saveToLocalStorage();
  updateUI();
  form.reset();
  showPopup('Transaction added successfully!');
});

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveToLocalStorage();
  updateUI();
}

clearBtn.addEventListener('click', () => {
  form.reset();
  showPopup('Form cleared.');
});

filterSelect.addEventListener('change', renderTable);

function updateUI() {
  calculateTotals();
  renderTable();
}

function init() {
  loadFromLocalStorage();
  updateUI();
}

init();