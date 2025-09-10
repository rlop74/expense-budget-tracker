/*
Add/remove expenses.
Store/retrieve from localStorage.
Calculate totals dynamically.
*/



/* 
monthly net income
*/

const newIncome = document.getElementById("newIncome");
const updateIncomeBtn = document.getElementById("updateIncomeBtn");
const resetIncomeBtn = document.getElementById("resetIncomeBtn");
let monthlyIncome = document.getElementById("monthlyIncome");
const currentIncome = localStorage.getItem("currentIncome"); // localStorage for monthlyIncome

if (currentIncome != null) {
    monthlyIncome.textContent = "Monthly Income: $" + currentIncome; // display new monthly income
}

// update new monthly income
updateIncomeBtn.addEventListener("click", () => {
    const newIncomeValue = newIncome.value;
    localStorage.setItem("currentIncome", newIncomeValue);
});

// reset monthly income
resetIncomeBtn.addEventListener("click", () => {
    monthlyIncome.textContent = "Monthly Income: ";
    localStorage.removeItem("currentIncome");
})


/* 
expenses
*/

const monthlyExpenseName = document.getElementById("monthlyExpenseName");
const monthlyExpenseAmount = document.getElementById("monthlyExpenseAmount");
const monthlyExpenseBtn = document.getElementById("monthlyExpenseBtn");
const monthlyExpensesList = document.getElementById("monthlyExpensesList");

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // parse the expenses localStorage key
renderExpenses();

// render expenses
function renderExpenses() {
    monthlyExpensesList.innerHTML = "" // clear before re-rendering
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = `${exp.name} - $${exp.amount} (${exp.date})`;
        monthlyExpensesList.appendChild(li);
    })
}

// add expenses
monthlyExpenseBtn.addEventListener("click", () => {
    const today = new Date();
    // create expense object
    let expense = {
        name: monthlyExpenseName.value,
        amount: monthlyExpenseAmount.value,
        date: today.toDateString()
    }

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
})

// daily expenses


// spendings
