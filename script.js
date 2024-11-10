let expenses = [];
let darkModeEnabled = false;
let editIndex = null; // Track the index of the expense being edited

document.getElementById("expense-form").addEventListener("submit", addExpense);
document.getElementById("search-bar").addEventListener("input", searchExpenses);
document.getElementById("filter-category").addEventListener("change", filterExpenses);
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);

const predefinedCategories = ["Food", "Travel", "Shopping", "Entertainment"];

function addExpense(event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("filter-category").value;

    if (name && amount && date) {
        if (editIndex !== null) {
            // Update existing expense
            expenses[editIndex] = { name, amount, date, category };
            editIndex = null; // Reset edit index
        } else {
            // Add new expense
            const expense = { name, amount, date, category };
            expenses.push(expense);
        }
        updateExpenseList();
        updateTotalAmount();
        updateCategoryTotals();
    }

    document.getElementById("expense-form").reset();
}

function updateExpenseList(filteredExpenses = expenses) {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = '';

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.name} - $${expense.amount} - ${expense.date} - ${expense.category}
                        <button onclick="editExpense(${index})">Edit</button>
                        <button onclick="deleteExpense(${index})">Delete</button>`;
        expenseList.appendChild(li);
    });
}

function updateTotalAmount() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById("total-amount").innerText = total.toFixed(2);
}

function updateCategoryTotals() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const categoryList = document.getElementById("category-totals");
    categoryList.innerHTML = '';
    for (let category in categoryTotals) {
        const li = document.createElement('li');
        li.innerHTML = `${category}: $${categoryTotals[category].toFixed(2)}`;
        categoryList.appendChild(li);
    }
}

function updateCategoryFilter() {
    const filterSelect = document.getElementById("filter-category");
    filterSelect.innerHTML = '<option value="All">All Categories</option>';

    predefinedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        filterSelect.appendChild(option);
    });
}

function searchExpenses(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredExpenses = expenses.filter(expense =>
        expense.name.toLowerCase().includes(searchTerm)
    );
    updateExpenseList(filteredExpenses);
}

function filterExpenses(event) {
    const category = event.target.value;
    if (category === "All") {
        updateExpenseList();
    } else {
        const filteredExpenses = expenses.filter(expense => expense.category === category);
        updateExpenseList(filteredExpenses);
    }
}

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle("dark-mode", darkModeEnabled);
    document.querySelector(".container").classList.toggle("dark-mode", darkModeEnabled);
    const inputs = document.querySelectorAll("input, button");
    inputs.forEach(input => input.classList.toggle("dark-mode", darkModeEnabled));
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById("expense-name").value = expense.name;
    document.getElementById("expense-amount").value = expense.amount;
    document.getElementById("expense-date").value = expense.date;
    document.getElementById("filter-category").value = expense.category;

    editIndex = index; // Set index for editing
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseList();
    updateTotalAmount();
    updateCategoryTotals();
}

// Initialize the filter with predefined categories
updateCategoryFilter();
