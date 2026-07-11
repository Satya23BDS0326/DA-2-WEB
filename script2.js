let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");

const ctx = document.getElementById("expense-chart").getContext("2d");
let chart;

function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;

  if (!name || isNaN(amount)) return alert("Please fill all fields!");

  const expense = {
    id: Date.now(),
    name,
    amount,
    category
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenses();
}

function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;
  const categoryMap = {};

  expenses.forEach((exp) => {
    total += exp.amount;
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.name} - ₹${exp.amount} <em>(${exp.category})</em>
      <button onclick="deleteExpense(${exp.id})">❌</button>
    `;
    expenseList.appendChild(li);
  });

  totalAmount.textContent = total;

  // Chart update
  updateChart(categoryMap);
}

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  saveExpenses();
  renderExpenses();
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateChart(data) {
  const categories = Object.keys(data);
  const values = Object.values(data);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        data: values,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#81C784", "#BA68C8"
        ]
      }]
    }
  });
}

document.getElementById("toggle-mode").onclick = () => {
  document.body.classList.toggle("dark");
};

renderExpenses();
