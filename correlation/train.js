const tf = require("@tensorflow/tfjs-node");
const countryDatasets = require("./preprocess");

const normalize = (values) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((val) => (val - min) / (max - min));
};

async function train(specific) {
  const countryModels = {};
  for (const country in countryDatasets) {
    if (specific !== undefined && country != specific) {
      continue;
    }

    const dataset = countryDatasets[country];

    const spending = dataset.map((entry) => entry.spending);
    const gdps = dataset.map((entry) => entry.GDP);
    const unemployments = dataset.map((entry) => entry.unemployment);
    const hdis = dataset.map((entry) => entry.HDI);
    const les = dataset.map((entry) => entry.le);
    const psis = dataset.map((entry) => entry.psi);
    const energys = dataset.map((entry) => entry.energy);

    const normalizedSpending = normalize(spending);
    const normalizedGdps = normalize(gdps);
    const normalizedUnemployments = normalize(unemployments);
    const normalizedHdis = normalize(hdis);
    const normalizedLes = normalize(les);
    const normalizedPsis = normalize(psis);
    const normalizedEnergys = normalize(energys);

    const outputs = normalizedGdps.map((gdp, index) => [
      gdp,
      normalizedUnemployments[index],
      normalizedHdis[index],
      normalizedLes[index],
      normalizedPsis[index],
      normalizedEnergys[index],
    ]);

    const trainFeatures = tf.tensor2d(normalizedSpending.map((val) => [val]));
    const trainLabels = tf.tensor2d(outputs);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 6, inputShape: [1] })); // Output layer with 6 units

    // Compile the model
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });


    console.log(`Training model for ${country}...`);
    await model.fit(trainFeatures, trainLabels, {
      epochs: 100,
      batchSize: Math.min(32, trainFeatures.shape[0]), // Avoid batch size errors
      validationSplit: .5,
      verbose: 0,
    });

    countryModels[country] = model;
  }
  return countryModels;
}

module.exports = train;
