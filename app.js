const initialInvestmentInput = document.getElementById("initial-investment");
const monthlyContributionInput = document.getElementById("monthly-contribution");
const monthlyReturnInput = document.getElementById("monthly-return");
const investmentPeriodInput = document.getElementById("investment-period");
const calculateButton = document.getElementById("calculate-button");

const feedbackBox = document.getElementById("feedback");
const finalBalanceText = document.getElementById("final-balance");
const totalInvestedText = document.getElementById("total-invested");
const totalProfitText = document.getElementById("total-profit");
const roiResultText = document.getElementById("roi-result");
const averageGainText = document.getElementById("average-gain");
const projectionTableBody = document.getElementById("projection-table-body");

function showMessage(message) {
  feedbackBox.textContent = message;
  feedbackBox.classList.remove("hidden");
}

function hideMessage() {
  feedbackBox.textContent = "";
  feedbackBox.classList.add("hidden");
}

function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function formatPercentage(value) {
  return `${Number(value).toFixed(2)}%`;
}

function getInputValues() {
  return {
    initialInvestment: Number(initialInvestmentInput.value),
    monthlyContribution: Number(monthlyContributionInput.value),
    monthlyReturn: Number(monthlyReturnInput.value),
    investmentPeriod: Number(investmentPeriodInput.value)
  };
}

function validateInputs(values) {
  const {
    initialInvestment,
    monthlyContribution,
    monthlyReturn,
    investmentPeriod
  } = values;

  if (
    Number.isNaN(initialInvestment) ||
    Number.isNaN(monthlyContribution) ||
    Number.isNaN(monthlyReturn) ||
    Number.isNaN(investmentPeriod)
  ) {
    showMessage("Please fill in all fields with valid numbers.");
    return false;
  }

  if (initialInvestment < 0) {
    showMessage("Initial investment cannot be negative.");
    return false;
  }

  if (monthlyContribution < 0) {
    showMessage("Monthly contribution cannot be negative.");
    return false;
  }

  if (monthlyReturn < 0) {
    showMessage("Monthly return cannot be negative.");
    return false;
  }

  if (investmentPeriod <= 0) {
    showMessage("Investment period must be greater than zero.");
    return false;
  }

  hideMessage();
  return true;
}

function runInvestmentSimulation(values) {
  const {
    initialInvestment,
    monthlyContribution,
    monthlyReturn,
    investmentPeriod
  } = values;

  const monthlyRate = monthlyReturn / 100;
  const totalInvested = initialInvestment + (monthlyContribution * investmentPeriod);

  let currentBalance = initialInvestment;
  const projection = [];

  for (let month = 1; month <= investmentPeriod; month += 1) {
    const startBalance = currentBalance;
    const balanceAfterContribution = startBalance + monthlyContribution;
    const interest = balanceAfterContribution * monthlyRate;
    const endBalance = balanceAfterContribution + interest;

    projection.push({
      month,
      startBalance,
      contribution: monthlyContribution,
      interest,
      endBalance
    });

    currentBalance = endBalance;
  }

  const finalBalance = currentBalance;
  const totalProfit = finalBalance - totalInvested;
  const roi = totalInvested === 0 ? 0 : (totalProfit / totalInvested) * 100;
  const averageMonthlyGain = investmentPeriod === 0 ? 0 : totalProfit / investmentPeriod;

  return {
    totalInvested,
    finalBalance,
    totalProfit,
    roi,
    averageMonthlyGain,
    projection
  };
}

function updateSummaryCards(results) {
  const {
    totalInvested,
    finalBalance,
    totalProfit,
    roi,
    averageMonthlyGain
  } = results;

  finalBalanceText.textContent = formatCurrency(finalBalance);
  totalInvestedText.textContent = formatCurrency(totalInvested);
  totalProfitText.textContent = formatCurrency(totalProfit);
  roiResultText.textContent = formatPercentage(roi);
  averageGainText.textContent = formatCurrency(averageMonthlyGain);

  totalProfitText.classList.remove("positive", "negative");
  roiResultText.classList.remove("positive", "negative");

  if (totalProfit > 0) {
    totalProfitText.classList.add("positive");
    roiResultText.classList.add("positive");
  } else if (totalProfit < 0) {
    totalProfitText.classList.add("negative");
    roiResultText.classList.add("negative");
  }
}

function renderProjectionTable(projection) {
  if (!projection.length) {
    projectionTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Run a simulation to see the monthly projection.</td>
      </tr>
    `;
    return;
  }

  projectionTableBody.innerHTML = projection
    .map((item) => {
      return `
        <tr>
          <td>${item.month}</td>
          <td>${formatCurrency(item.startBalance)}</td>
          <td>${formatCurrency(item.contribution)}</td>
          <td>${formatCurrency(item.interest)}</td>
          <td>${formatCurrency(item.endBalance)}</td>
        </tr>
      `;
    })
    .join("");
}

function handleCalculation() {
  const values = getInputValues();

  if (!validateInputs(values)) {
    return;
  }

  const results = runInvestmentSimulation(values);
  updateSummaryCards(results);
  renderProjectionTable(results.projection);
}

calculateButton.addEventListener("click", handleCalculation);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleCalculation();
  }
});

handleCalculation();