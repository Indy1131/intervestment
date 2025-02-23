const tf = require("@tensorflow/tfjs-node");
const data = require("../../data/final.json");

const outputs = ["GDP", "unemployment", "HDI", "le", "psi", "energy"];

let spending = [];
let result = [];

const countries = data.countries;
for (const countryName of Object.keys(countries)) {
  const country = countries[countryName];
  const years = country.years;
  for (const yearNumber of Object.keys(years)) {
    const year = years[yearNumber];

    if (!year.total_amount || year.total_amount == 0) continue;

    const stats = {};
    for (const stat of outputs) {
      if (!year.outputs[stat] || year.outputs[stat] == 0) {
        break;
      }

      stats[stat] = year.outputs[stat];
    }

    if (Object.keys(stats).length == outputs.length) {
      spending.push(year.total_amount);
      result.push(stats);
    }
  }
}

function removeOutliersBasedOnX(xCoords, yCoords) {
  // Function to calculate the percentile
  function percentile(arr, p) {
    arr.sort((a, b) => a - b);
    const index = (p / 100) * (arr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return arr[lower];
    return arr[lower] + (index - lower) * (arr[upper] - arr[lower]);
  }

  // Calculate Q1 (25th percentile) and Q3 (75th percentile) for x
  const Q1_x = percentile(xCoords, 25);
  const Q3_x = percentile(xCoords, 75);

  // Calculate IQR for x
  const IQR_x = Q3_x - Q1_x;

  // Debug: Log the calculated percentiles and IQRs
  console.log("Q1_x:", Q1_x, "Q3_x:", Q3_x, "IQR_x:", IQR_x);

  // Define the lower and upper bounds for x
  const lowerBound_x = Q1_x - 1.5 * IQR_x;
  const upperBound_x = Q3_x + 1.5 * IQR_x;

  // Debug: Log the bounds for x
  console.log("Lower Bound x:", lowerBound_x, "Upper Bound x:", upperBound_x);

  // Filter out points that are outside the bounds based only on x values
  const filteredPoints = xCoords
    .map((x, index) => ({ x, y: yCoords[index] })) // Combine x and y into an object
    .filter(({ x }) => x >= lowerBound_x && x <= upperBound_x); // Filter based on x

  // Debug: Log the filtered points
  console.log("Filtered Points based on x:", filteredPoints);

  // Unzip the filtered points back into x and y arrays
  const filteredX = filteredPoints.map((p) => p.x);
  const filteredY = filteredPoints.map((p) => p.y);

  return { filteredX, filteredY };
}

console.log(spending);
const { filteredX, filteredY } = removeOutliersBasedOnX(spending, result);
console.log(filteredX);

spending = filteredX;
result = filteredY;

const maxSpending = Math.max(...spending);
const normalizedSpending = spending.map((s) => s / maxSpending);

const maxValues = Object.keys(result[0]).reduce((acc, key) => {
  acc[key] = Math.max(...result.map((r) => r[key]));
  return acc;
}, {});

const normalizedStats = result.map((r) =>
  Object.keys(r).map((key) => r[key] / maxValues[key])
);

console.log(normalizedStats)

// Convert to tensors
const xs = tf.tensor2d(normalizedStats); // [num_samples, num_features]
const ys = tf.tensor2d(normalizedSpending, [spending.length, 1]);

const model = tf.sequential();

model.add(tf.layers.dense({ inputShape: [6], units: 32, activation: "relu" }));
model.add(tf.layers.dense({ units: 64, activation: "relu" }));
model.add(tf.layers.dense({ units: 32, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "linear" })); // Output is spending

model.compile({
  optimizer: tf.train.adam(),
  loss: "meanSquaredError",
  metrics: ["mse"],
});

// (async () => {
//   await model.fit(xs, ys, {
//     epochs: 150,
//     batchSize: 4,
//     verbose: 1,
//   });

//   console.log("Training complete!");
//   const newStats = tf.tensor2d([
//     [
//       2.0 / maxValues["GDP"],
//       4.0 / maxValues["unemployment"],
//       0.8 / maxValues["HDI"],
//       78 / maxValues["le"],
//       0.9 / maxValues["psi"],
//       4000 / maxValues["energy"],
//     ],
//   ]);

//   const prediction = model.predict(newStats);
//   prediction.print();
//   await model.save("file://./need-model");
// })();
