/********************************************************************************************************
                                        currency converter
********************************************************************************************************/

// parse and get "rates" localStorage
let rates = JSON.parse(localStorage.getItem("rates"));

async function fetchCurrencies() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();

        // stringify and store data.rates in localStorage
        localStorage.setItem("rates", JSON.stringify(data.rates));

        return data.rates;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

const currencyRates = document.getElementById("currencyRates");
let selectedCurrency = localStorage.getItem("selectedCurrency") || "USD";

function listCurrencies() {
    const currencies = fetchCurrencies();

    // used data as currencies return involves async
    currencies.then((data) => {
        // loop through data object (rates), grab the key and display both keys and its values
        for (currency in data) {
            const option = document.createElement("option")
            option.setAttribute("value", currency);
            option.textContent = `${currency}: ${data[currency]}`;
            currencyRates.appendChild(option);
        }
        currencyRates.value = selectedCurrency; // set value to last chosen rate
    });
}

// event listener for when the currency rate dropdown is changed/updated
currencyRates.addEventListener("change", () => {
        const currencyValue = currencyRates.value;
        localStorage.setItem("selectedCurrency", currencyValue);
        updateUI();
});


/********************************************************************************************************
                                    monthly net income card
********************************************************************************************************/

const newIncomeInput = document.getElementById("newIncomeInput");
const updateIncomeBtn = document.getElementById("updateIncomeBtn");
const resetIncomeBtn = document.getElementById("resetIncomeBtn");
let monthlyIncome = document.getElementById("monthlyIncome");

// localStorage for monthlyIncome, store 0 if currentIncome === null, otherwise store value from "currentIncome" localStorage
let currentIncome = localStorage.getItem("currentIncome") || 0;

// update new monthly income event listener
updateIncomeBtn.addEventListener("click", () => {
    const newIncomeValue = newIncomeInput.value;
    // if New Monthly Net Income is empty, alert the user and exit the code
    if (!newIncomeValue) {
        alert("Please fill out required fields");
        return;
    } else {
        // update "currentIncome" localStorage with new income
        localStorage.setItem("currentIncome", newIncomeValue);
        newIncomeInput.value = "";
        updateUI();
    }
});

function renderIncome() {
    // get most recent income and currency rate change from localStorage
    currentIncome = localStorage.getItem("currentIncome") || 0;
    selectedCurrency = localStorage.getItem("selectedCurrency");

    // convert currentIncome (USD) to selectedCurrency value
    let convertedIncome = rates[selectedCurrency] * parseFloat(currentIncome);

    // display income with correct currency
    monthlyIncome.textContent = `Monthly Income: ${convertedIncome.toLocaleString()} ${selectedCurrency}`;
};

// reset monthly income
resetIncomeBtn.addEventListener("click", () => {
    localStorage.removeItem("currentIncome");
    currentIncome = localStorage.getItem("currentIncome") || 0;
    updateUI();
})

/********************************************************************************************************
                                        reset all button
********************************************************************************************************/

const resetAllBtn = document.getElementById("resetAllBtn");

resetAllBtn.addEventListener("click", () => {
    // clear local storage except monthly income
    localStorage.removeItem("expenses");
    localStorage.removeItem("savings")

    // clear in-memory data
    expenses = [];
    savings = [];

    // clear lists in the UI
    updateUI();
})

/********************************************************************************************************
                                            expenses
********************************************************************************************************/

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expensesList = document.getElementById("expensesList");
const totalExpenses = document.getElementById("totalExpenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // parse the "expenses" localStorage key or return a list if parse is invalid


// render expenses
function renderExpenses() {
    expensesList.innerHTML = "" // clear before re-rendering
    
    let expensesSum = 0;

    // loop through the expenses storage, display them and add event to remove on click
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerHTML = `${exp.name} - $${exp.amount}<br/><small>${exp.date}</small><br /><small>${exp.category}</small>`;
        expensesSum += parseFloat(exp.amount);
        expensesList.appendChild(li);

        // add event to each item to remove on click
        li.addEventListener("click", () => {
            expensesList.removeChild(li);
            const index = expenses.indexOf(exp);
            expenses.splice(index, 1);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            updateUI();
        })
    })
    // round off decimal place to 2
    expensesSum = Math.round(expensesSum * 100) / 100;

    // convert and display expenses
    let selectedCurrency = localStorage.getItem("selectedCurrency");
    let convertedExpenses = expensesSum * rates[selectedCurrency];
    totalExpenses.textContent = `Total Expenses: ${convertedExpenses} ${selectedCurrency}`;
    return expensesSum;
}

// add expenses
addExpenseBtn.addEventListener("click", () => {
    // if any of the required values in the condition below is empty, alert user and exit code
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

    // push added expense to expenses storage/array, update storage, clear input boxes values
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseName.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";
    categoryInput.value = "";
    updateUI();
})

// add expense category 
const categoryInput = document.getElementById("categoryInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");
let categoryStorage = JSON.parse(localStorage.getItem("expenseCategory")) || ["Automotive", "Bills & Utilities", "Education", "Entertainment", "Food & Drinks", "Gas", "Groceries", "Health & Wellness", "Home", "Shopping"];

addCategoryBtn.addEventListener("click", () => {
    // create and add option element with contents to expenseCategory
    const option = document.createElement("option");
    option.setAttribute("value", categoryInput.value);
    option.textContent = categoryInput.value;
    expenseCategory.appendChild(option);

    // save option to localStorage
    categoryStorage.push(categoryInput.value);
    localStorage.setItem("expenseCategory", JSON.stringify(categoryStorage));

    // clear category input
    categoryInput.value = "";

    updateUI();
})

// reset expense category
const resetCategoryBtn = document.getElementById("resetCategoryBtn");

resetCategoryBtn.addEventListener("click", () => {
    localStorage.removeItem("expenseCategory");
    updateUI();
})

function renderExpensesList() {
    // calling categoryStorage whenever re-rendering is useful for when resetting the category list
    categoryStorage = JSON.parse(localStorage.getItem("expenseCategory")) || ["Automotive", "Bills & Utilities", "Education", "Entertainment", "Food & Drinks", "Gas", "Groceries", "Health & Wellness", "Home", "Shopping"];
    // clear before re-rendering
    expenseCategory.innerHTML = `<option value="">Please Select...</option>`;
    // sort alphabetically before displaying
    categoryStorage.sort();

    // create element and store expense categories
    categoryStorage.forEach(category => {
        // create element
        const option = document.createElement("option");
        option.setAttribute("value", category);
        option.textContent = category;

        // display elements
        expenseCategory.appendChild(option);
    })
}

/********************************************************************************************************
                                                savings
********************************************************************************************************/
const addSavingsBtn = document.getElementById("addSavingsBtn");
const savingsAmount = document.getElementById("savingsAmount");
const totalSavings = document.getElementById("totalSavings");
const savingsList = document.getElementById("savingsList");

let savings = JSON.parse(localStorage.getItem("savings")) || [];
// renderSavings(); // commented as this is already in the updateUI function

function renderSavings() {
    savingsList.innerHTML = ""; // clear before re-rendering

    let savingsSum = 0;
    // loop through the savings array, display them and add event to remove on click
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
    
    // round off decimal place to 2
    savingsSum = Math.round(savingsSum * 100) / 100;
    
    // convert and display savings
    let selectedCurrency = localStorage.getItem("selectedCurrency");
    let convertedSavings = savingsSum * rates[selectedCurrency];
    totalSavings.textContent = `Total Savings: ${convertedSavings.toLocaleString()} ${selectedCurrency}`;
    return savingsSum;
}

addSavingsBtn.addEventListener("click", () => {
    // alert user if savings input box is empty and exit code
    if (!savingsAmount.value) {
        alert("Please fill out required fields");
        return;
    }

    // create object for savings
    const today = new Date();
    let contribution = {
        amount: savingsAmount.value,
        date: today.toDateString(),
    }

    // push new savings to savings array/storage and clear savings input box
    savings.push(contribution);
    localStorage.setItem("savings", JSON.stringify(savings));
    savingsAmount.value = "";
    
    // call update UI to update everything that's needed including the savings breakdown
    updateUI();
})


/********************************************************************************************************
                                        remaining balance
********************************************************************************************************/

const remainingBalance = document.getElementById("remainingBalance");

function calculateRemainingBalance() {
    const expensesSum = renderExpenses(); // grab returned value of renderExpenses which is the sum of all expenses
    const savingsSum = renderSavings(); // grab returned value of renderExpenses which is the sum of all savings

    // calculate and round off difference to 2 decimal places
    let diff = parseFloat(currentIncome) - (expensesSum + savingsSum);
    diff = Math.round(diff * 100) / 100;

    // prevents error if the difference is NaN
    if (Number.isNaN(diff)) {
        remainingBalance.textContent = "Safe to spend: ";
    } else {
        let selectedCurrency = localStorage.getItem("selectedCurrency");
        let convertedDiff = diff * rates[selectedCurrency];
        remainingBalance.textContent = `Safe to spend: ${convertedDiff.toLocaleString()} ${selectedCurrency}`;
    }
    return diff;
}

/********************************************************************************************************
                                                chart
********************************************************************************************************/

// reference: https://www.chartjs.org/docs/latest/getting-started/#create-a-chart
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

/********************************************************************************************************
                                       ☀️ dark mode 🌙
********************************************************************************************************/

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const body = document.body;
let theme = localStorage.getItem("theme") || "light";

// if-else for initial page load to update background and textContent
if (theme === "dark") {
    body.classList.toggle("dark");
    toggleThemeBtn.textContent = "🌙";
} else {
    toggleThemeBtn.textContent = "☀️";
}

toggleThemeBtn.addEventListener("click", () => {
    theme = localStorage.getItem("theme") // get current theme from localStorage
    body.classList.toggle("dark"); // toggle dark class

    // update textContent and localStorage for every click
    if (theme === "light") {
        localStorage.setItem("theme", "dark");
        toggleThemeBtn.textContent = "🌙"
        return;
    }
    localStorage.setItem("theme", "light");
    toggleThemeBtn.textContent = "☀️";
})

/********************************************************************************************************
                                                update UI
********************************************************************************************************/

function updateUI() {
    listCurrencies();
    renderIncome();
    renderExpensesList();
    const savingsSum = renderSavings();
    const expensesSum = renderExpenses();
    const safeToSpend = calculateRemainingBalance();
    renderChart(expensesSum, safeToSpend, savingsSum);
}

updateUI();