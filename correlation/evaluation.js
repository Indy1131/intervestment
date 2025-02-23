const tf = require("@tensorflow/tfjs-node");
const countryDatasets = require("./preprocess");
const train = require("./train");

const normalize = (values) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((val) => (val - min) / (max - min));
};

(async () => {
  const countryModels = await train();
  for (const country in countryModels) {
    const model = countryModels[country];
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

    const testFeatures = tf.tensor2d(normalizedSpending.map((val) => [val]));
    const testLabels = tf.tensor2d(outputs);

    const predictions = model.predict(testFeatures);

    const calculateRSquared = (actual, predicted) => {
      const actualMean = actual.mean();
      const totalSumOfSquares = actual.sub(actualMean).square().sum();
      const residualSumOfSquares = actual.sub(predicted).square().sum();
      const rSquared = tf
        .scalar(1)
        .sub(residualSumOfSquares.div(totalSumOfSquares));
      return rSquared;
    };

    const rSquaredGdp = calculateRSquared(
      testLabels.slice([0, 0], [-1, 1]),
      predictions.slice([0, 0], [-1, 1])
    );
    const rSquaredUnemployment = calculateRSquared(
      testLabels.slice([0, 1], [-1, 1]),
      predictions.slice([0, 1], [-1, 1])
    );
    const rSquaredHdi = calculateRSquared(
      testLabels.slice([0, 2], [-1, 1]),
      predictions.slice([0, 2], [-1, 1])
    );
    const rSquaredLes = calculateRSquared(
      testLabels.slice([0, 3], [-1, 1]),
      predictions.slice([0, 3], [-1, 1])
    );
    const rSquaredPsis = calculateRSquared(
      testLabels.slice([0, 4], [-1, 1]),
      predictions.slice([0, 4], [-1, 1])
    );
    const rSquaredEnergy = calculateRSquared(
      testLabels.slice([0, 5], [-1, 1]),
      predictions.slice([0, 5], [-1, 1])
    );

    console.log(`R² for ${country}:`);
    console.log(`GDP: ${rSquaredGdp.dataSync()}`);
    console.log(`Unemployment: ${rSquaredUnemployment.dataSync()}`);
    console.log(`HDI: ${rSquaredHdi.dataSync()}`);
    console.log(`LE: ${rSquaredLes.dataSync()}`);
    console.log(`PSI: ${rSquaredPsis.dataSync()}`);
    console.log(`Energy: ${rSquaredEnergy.dataSync()}`);

    const overallRSquared = tf
      .stack([
        rSquaredGdp,
        rSquaredUnemployment,
        rSquaredHdi,
        rSquaredLes,
        rSquaredPsis,
        rSquaredEnergy,
      ])
      .mean();
    const correlationScore = overallRSquared.mul(100).dataSync(); // Scale to [0, 100]

    console.log(`Correlation Score for ${country}: ${correlationScore}`);
  }
})();
