const fs = require("fs").promises;
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const output = {};

async function getScore(current) {
  try {
    const data = JSON.parse(await fs.readFile("./data.json", "utf8"));
    const countries = data.countries;

    let year = 2022;
    while (
      (!countries[current].years[year] ||
        !countries[current].years[year].outputs ||
        JSON.stringify(Object.keys(countries[current].years[year].outputs)) !=
          JSON.stringify([
            "GDP",
            "unemployment",
            "HDI",
            "le",
            "psi",
            "energy",
          ]) ||
        countries[current].years[year].outputs.GDP == 0 ||
        countries[current].years[year].outputs.unemployment == 0 ||
        countries[current].years[year].outputs.HDI == 0 ||
        countries[current].years[year].outputs.le == 0 ||
        countries[current].years[year].outputs.psi == 0 ||
        countries[current].years[year].outputs.energy == 0) &&
      year > 2000
    ) {
      year--;
    }
    const currentOutputs = { ...countries[current].years[year].outputs };

    const globalOutputs = {
      GDP: { min: Infinity, max: 0 },
      unemployment: { min: Infinity, max: 0 },
      HDI: { min: Infinity, max: 0 },
      le: { min: Infinity, max: 0 },
      psi: { min: Infinity, max: 0 },
      energy: { min: Infinity, max: 0 },
    };

    for (const countryName of Object.keys(countries)) {
      const current = countries[countryName];
      if (current.years[year] && current.years[year].outputs) {
        for (const stat of Object.keys(current.years[year].outputs)) {
          const currentStat = current.years[year].outputs[stat];
          if (globalOutputs[stat] && currentStat != 0) {
            globalOutputs[stat].min = Math.min(
              globalOutputs[stat].min,
              currentStat
            );
            globalOutputs[stat].max = Math.max(
              globalOutputs[stat].max,
              currentStat
            );
          }
        }
      }
    }
    for (const stat of Object.keys(currentOutputs)) {
      currentOutputs[stat] =
        (currentOutputs[stat] - globalOutputs[stat].min) /
        (globalOutputs[stat].max - globalOutputs[stat].min);
    }

    output[current] = currentOutputs;

    const modelPath = `file://${path.resolve(
      __dirname,
      "need-model/model.json"
    )}`;
    const loadedModel = await tf.loadLayersModel(modelPath);
    const inputArray = Object.values(currentOutputs);
    const inputTensor = tf.tensor2d([inputArray]);

    const prediction = await loadedModel.predict(inputTensor);
    const final = await prediction.data().then((predictedValue) => {
      const spendingPrediction = predictedValue[0];
      return spendingPrediction;
    });

    return final;
  } catch (e) {
    return undefined;
  }
}

const fits = {};

async function getData() {
  let min = Infinity;
  let max = 0;
  let sum = 0;
  let items = 0;
  const data = JSON.parse(await fs.readFile("./data.json", "utf8"));
  const countries = data.countries;

  for (const countryName of Object.keys(countries)) {
    const curr = await getScore(countryName);
    if (curr) {
      min = Math.min(curr, min);
      max = Math.max(curr, max);
      sum += curr;
      fits[countryName] = curr;
      items++;
    }
  }

  console.log(output);

  await fs.writeFile("./inputs", JSON.stringify(output, null, 2));

  fits["mean"] = sum / items;

  // await fs.writeFile("./fits.json", JSON.stringify(fits, null, 2));
  // console.log("Fits saved to fits.json");
}

getData();
