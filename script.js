/*
Add/remove expenses.
Store/retrieve from localStorage.
Calculate totals dynamically.
*/



/*********************************
        monthly net income card
**********************************/

const newIncome = document.getElementById("newIncome");
const updateIncomeBtn = document.getElementById("updateIncomeBtn");
const resetIncomeBtn = document.getElementById("resetIncomeBtn");
let monthlyIncome = document.getElementById("monthlyIncome");
const currentIncome = localStorage.getItem("currentIncome") || 0; // localStorage for monthlyIncome

// display new monthly income if currentIncome != null, otherwise display current innerHTML
monthlyIncome.textContent = "Monthly Income: $" + currentIncome;

// update new monthly income
updateIncomeBtn.addEventListener("click", () => {
    const newIncomeValue = newIncome.value;
    localStorage.setItem("currentIncome", newIncomeValue);
    monthlyIncome.textContent = "Monthly Income: $" + newIncomeValue;
    calculateRemainingBalance();
});

// reset monthly income
resetIncomeBtn.addEventListener("click", () => {
    monthlyIncome.textContent = "Monthly Income: $0";
    localStorage.removeItem("currentIncome");
    calculateRemainingBalance();
})

/*********************************
        reset all button
*********************************/
const resetAllBtn = document.getElementById("resetAllBtn");

resetAllBtn.addEventListener("click", () => {
    // clear local storage
    localStorage.clear();

    // clear in-memory data
    expenses = [];
    savings = [];

    // clear lists
    renderExpenses();
    renderSavings();
    calculateRemainingBalance(); // refresh balance display
    monthlyIncome.textContent = "Monthly Income: $0";
})


/********************************* 
            expenses
**********************************/

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expensesList = document.getElementById("expensesList");
const totalExpenses = document.getElementById("totalExpenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // parse the "expenses" localStorage key or return a list if parse is invalid
renderExpenses();


// render expenses
function renderExpenses() {
    expensesList.innerHTML = "" // clear before re-rendering
    let expensesSum = 0;
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerHTML = `${exp.name} - $${exp.amount}<br/><small>${exp.date}</small>`;
        expensesSum += parseFloat(exp.amount);
        expensesList.appendChild(li);
    })
    totalExpenses.textContent = "Total Expenses: $" + expensesSum.toString();
}

// add expenses
addExpenseBtn.addEventListener("click", () => {
    const today = new Date();
    // create expense object
    let expense = {
        name: expenseName.value,
        amount: expenseAmount.value,
        date: today.toDateString(),
        time: today.toTimeString(),
    }

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    calculateRemainingBalance();
})

/*********************************
            savings
**********************************/
const addSavingsBtn = document.getElementById("addSavingsBtn");
const savingsAmount = document.getElementById("savingsAmount");
const totalSavings = document.getElementById("totalSavings");
const savingsList = document.getElementById("savingsList");

let savings = JSON.parse(localStorage.getItem("savings")) || [];
renderSavings();

function renderSavings() {
    savingsList.innerHTML = ""; // clear before re-rendering
    let savingsSum = 0;
    savings.forEach(contribution => {
        savingsSum += parseFloat(contribution.amount);

        const li = document.createElement("li");
        li.innerHTML = `$${contribution.amount}<br><small>${contribution.date}</small>`;
        savingsList.appendChild(li);
    })
    totalSavings.textContent = `Total Savings: $${savingsSum.toString()}`;
}

addSavingsBtn.addEventListener("click", () => {
    const today = new Date();
    let contribution = {
        amount: savingsAmount.value,
        date: today.toDateString(),
    }
    savings.push(contribution);
    localStorage.setItem("savings", JSON.stringify(savings));
    renderSavings();
    calculateRemainingBalance();
})


/*********************************
        remaining balance
**********************************/

const remainingBalance = document.getElementById("remainingBalance");

function calculateRemainingBalance() {
    let expensesSum = 0;
    let currentIncome = JSON.parse(localStorage.getItem("currentIncome")) || 0;
    expenses.forEach(exp => {
        expensesSum += parseFloat(exp.amount);
    })
    let savingsSum = 0;
    savings.forEach(contribution => {
        savingsSum += parseFloat(contribution.amount);
    })
    let diff = parseFloat(currentIncome) - (expensesSum + savingsSum);

    if (Number.isNaN(diff)) {
        remainingBalance.textContent = "Safe to spend: ";
    } else {
        remainingBalance.textContent = "Safe to spend: $" + diff;
    }
}

calculateRemainingBalance();