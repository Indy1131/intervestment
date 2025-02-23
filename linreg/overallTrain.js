const linreg = require("./linreg.json");
const math = require("mathjs");

let spending = [];
const r2s = [];

// Filter and prepare data
for (const country of linreg) {
  if (
    country.spending &&
    country.r2 &&
    country.spending != 0 &&
    country.spending < 10000000000 &&
    country.r2 > 0.2
  ) {
    spending.push(country.spending);
    r2s.push(country.r2);
  }
}

// Normalize spending (optional, but recommended for large values)
// const spendingMin = math.min(spending);
// const spendingMax = math.max(spending);
// spending = spending.map(
//   (val) => (val - spendingMin) / (spendingMax - spendingMin)
// );

// Calculate means
const xMean = math.mean(spending); // Mean of X (spending)
const yMean = math.mean(r2s); // Mean of Y (r2s)

// Calculate slope (m) and intercept (b)
const numerator = math.sum(
  spending.map((x, i) => (x - xMean) * (r2s[i] - yMean))
);
const denominator = math.sum(spending.map((x) => Math.pow(x - xMean, 2)));
const m = numerator / denominator; // Slope
const b = yMean - m * xMean; // Intercept

// Calculate predicted values
const yPred = spending.map((x) => m * x + b);

// Calculate R²
const ssTotal = math.sum(r2s.map((y) => Math.pow(y - yMean, 2)));
const ssResidual = math.sum(r2s.map((y, i) => Math.pow(y - yPred[i], 2)));
const r2 = 1 - ssResidual / ssTotal;

console.log();

console.log("Slope (m):", m);
console.log("Intercept (b):", b);
console.log("R²:", r2);
