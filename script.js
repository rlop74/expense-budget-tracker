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
let currentIncome = localStorage.getItem("currentIncome") || 0; // localStorage for monthlyIncome

// display new monthly income if currentIncome != null, otherwise display current innerHTML
monthlyIncome.textContent = `Monthly Income: ${parseFloat(currentIncome).toLocaleString()} USD`;

// update new monthly income
updateIncomeBtn.addEventListener("click", () => {
    const newIncomeValue = newIncome.value;
    if (!newIncomeValue) {
        alert("Please fill out required fields");
        return;
    }

    localStorage.setItem("currentIncome", newIncomeValue);
    monthlyIncome.textContent = `Monthly Income: ${parseFloat(newIncomeValue).toLocaleString()} USD`;
    newIncome.value = "";
    updateUI();
});

function updateIncome() {
    monthlyIncome.textContent = `Monthly Income: ${parseFloat(currentIncome).toLocaleString()} USD`;
}

// reset monthly income
resetIncomeBtn.addEventListener("click", () => {
    monthlyIncome.textContent = "Monthly Income: 0 USD";
    localStorage.removeItem("currentIncome");
    updateUI();
})

/*********************************
        reset all button
*********************************/
const resetAllBtn = document.getElementById("resetAllBtn");

resetAllBtn.addEventListener("click", () => {
    // clear local storage except monthly income
    localStorage.removeItem("expenses");
    localStorage.removeItem("savings")

    // clear in-memory data
    expenses = [];
    savings = [];

    // clear lists
    updateUI();
})

/********************************* 
            expenses
**********************************/

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
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
        li.innerHTML = `${exp.name} - $${exp.amount}<br/><small>${exp.date}</small><br /><small>${exp.category}</small>`;
        expensesSum += parseFloat(exp.amount);
        expensesList.appendChild(li);

        // add function to remove on click
        li.addEventListener("click", () => {
            expensesList.removeChild(li);
            const index = expenses.indexOf(exp);
            expenses.splice(index, 1);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            updateUI();
        })
    })
    expensesSum = Math.round(expensesSum * 100) / 100; // round off decimal place to 2
    totalExpenses.textContent = `Total Expenses: ${expensesSum} USD`;
    return expensesSum;
}

// add expenses
addExpenseBtn.addEventListener("click", () => {
    if (!expenseName.value || !expenseAmount.value || !expenseCategory.value) {
        alert("Please fill out required fields");
        return;
    }
    
    const today = new Date();
    // create expense object
    let expense = {
        name: expenseName.value,
        amount: expenseAmount.value,
        category: expenseCategory.value,
        date: today.toDateString(),
        time: today.toTimeString(),
    }

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseName.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";
    updateUI();
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
        li.innerHTML = `$${contribution.amount}<br><small>${contribution.date}</small><br> -`;
        savingsList.appendChild(li);

        li.addEventListener("click", () => {
            savingsList.removeChild(li);
            const index = savings.indexOf(contribution);
            savings.splice(index, 1);
            localStorage.setItem("savings", JSON.stringify(savings));
            updateUI();
        })
    })
    savingsSum = Math.round(savingsSum * 100) / 100; // round off decimal place to 2
    totalSavings.textContent = `Total Savings: ${savingsSum.toLocaleString()} USD`;
    return savingsSum;
}

addSavingsBtn.addEventListener("click", () => {
    if (!savingsAmount.value) {
        alert("Please fill out required fields");
        return;
    }
    const today = new Date();
    let contribution = {
        amount: savingsAmount.value,
        date: today.toDateString(),
    }
    savings.push(contribution);
    localStorage.setItem("savings", JSON.stringify(savings));
    savingsAmount.value = "";
    updateUI();
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
    diff = Math.round(diff * 100) / 100; // round off decimal place to 2

    if (Number.isNaN(diff)) {
        remainingBalance.textContent = "Safe to spend: ";
    } else {
        remainingBalance.textContent = `Safe to spend: ${diff.toLocaleString()} USD`;
    }
    return diff;
}

calculateRemainingBalance();

/********************************* 
            chart
**********************************/

const mainChart = document.getElementById('mainChart');
let chartInstance;

function renderChart(expensesSum, safeToSpend, savingsSum) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(mainChart, {
    type: 'doughnut',
    data: {
        labels: ['Expense', 'Safe to spend', 'Savings'],
        datasets: [{
        label: 'Amount',
        data: [expensesSum, safeToSpend, savingsSum],
        borderWidth: 1,
        backgroundColor: [
            '#8A3033',
            '#2081C3',
            '#7A8450'
        ]
        }]
    },
    });
}

/********************************* 
        currency converter
**********************************/

async function fetchCurrencies() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        const rates = data.rates
        return rates
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

const currencyRates = document.getElementById("currencyRates");
let selectedCurrency = localStorage.getItem("selectedCurrency") || "USD";

function listCurrencies() {
    const currencies = fetchCurrencies();
    currencies.then((data) => {
        for (currency in data) {
            const option = document.createElement("option")
            option.setAttribute("value", currency);
            option.textContent = `${currency}: ${data[currency]}`;
            currencyRates.appendChild(option);
        }
    currencyRates.value = "USD"; // reset value everytime function is called
    });
}

currencyRates.addEventListener("change", async () => {
    const rates = await fetchCurrencies();
    const selectedRate = currencyRates.value;
    const currencyRate = rates[selectedRate];

    // monthly income card update
    const currentIncome = localStorage.getItem("currentIncome") || 0;
    const updatedIncome = currencyRate * parseFloat(currentIncome);
    monthlyIncome.textContent = `Monthly Income: ${updatedIncome.toLocaleString()} ${selectedRate}`;

    // expenses card update
    const currentExpenses = renderExpenses();
    const updatedExpenses = parseFloat(currentExpenses) * currencyRate;
    totalExpenses.textContent = `Total Expenses: ${updatedExpenses.toLocaleString()} ${selectedRate}`;

    // savings card update
    const currentSavings = renderSavings();
    const updatedSavings = parseFloat(currentSavings) * currencyRate;
    totalSavings.textContent = `Total Savings: ${updatedSavings.toLocaleString()} ${selectedRate}`

    // safeToSpend card update
    const diff = calculateRemainingBalance();
    const safeToSpend = diff * currencyRate;
    remainingBalance.textContent = `Safe to spend: ${safeToSpend.toLocaleString()} ${selectedRate}`;
})

/********************************* 
            update UI
**********************************/

function updateUI() {
    listCurrencies();
    updateIncome();
    const savingsSum = renderSavings();
    const expensesSum = renderExpenses();
    const safeToSpend = calculateRemainingBalance();
    renderChart(expensesSum, safeToSpend, savingsSum);
}

updateUI();