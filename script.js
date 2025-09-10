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
const totalExpenses = document.getElementById("totalExpenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // parse the expenses localStorage key
renderExpenses();

// render expenses
function renderExpenses() {
    monthlyExpensesList.innerHTML = "" // clear before re-rendering
    let expensesSum = 0;
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = `${exp.name} - $${exp.amount} (${exp.date})`;
        expensesSum += parseInt(exp.amount);
        monthlyExpensesList.appendChild(li);
        totalExpenses.textContent = "Total Expenses: $" + expensesSum.toString();

    })
}

// add expenses
monthlyExpenseBtn.addEventListener("click", () => {
    const today = new Date();
    // create expense object
    let expense = {
        name: monthlyExpenseName.value,
        amount: monthlyExpenseAmount.value,
        date: today.toDateString(),
        time: today.toTimeString(),
    }

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
})

/* 
remaining balance
*/
const remainingBalance = document.getElementById("remainingBalance");

function calculateRemainingBalance() {
    let totalExpenses = 0;
    expenses.forEach(exp => {
        totalExpenses += parseInt(exp.amount);
    })
    let diff = parseInt(currentIncome) - totalExpenses
    remainingBalance.textContent = "Safe to spend: $" + diff;
}

calculateRemainingBalance();

/*
reset all button
*/

resetAllBtn.addEventListener("click", () => {
    localStorage.clear();
})