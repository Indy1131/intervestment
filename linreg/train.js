const data = require("../../data/final.json");
const math = require("mathjs");
const fs = require("fs");

const normalize = (values) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((val) => (val - min) / (max - min));
};

const global = { years: {} };

for (const countryName in data.countries) {
  const country = data.countries[countryName];
  for (const year in country.years) {
    const outputs = country.years[year].outputs;
    if (isNaN(year) || year < 2000 || year > 2023 || !outputs) {
      continue;
    }

    if (!global.years[year]) {
      global.years[year] = { outputs: {} };
    }

    for (const stat of Object.keys(outputs)) {
      if (!global.years[year].outputs[stat]) {
        global.years[year].outputs[stat] = [outputs[stat], 1];
      } else {
        global.years[year].outputs[stat] = [
          global.years[year].outputs[stat][0] + outputs[stat],
          global.years[year].outputs[stat][1] + 1,
        ];
      }
    }
  }
}

for (const year of Object.keys(global.years)) {
  for (const stat of Object.keys(global.years[year].outputs)) {
    global.years[year].outputs[stat] =
      global.years[year].outputs[stat][0] / global.years[year].outputs[stat][1];
  }
}
const { r2s, slopes, intercepts } = trainModelsForCountry(global);

let globalR2Mean = 0;
let globalSlopeMean = 0;
let globalInterceptMean = 0;
for (const key of Object.keys(r2s)) {
  globalR2Mean += r2s[key];
  globalSlopeMean += slopes[key];
  globalInterceptMean += intercepts[key];
}

globalR2Mean /= Object.keys(r2s).length;
globalSlopeMean /= Object.keys(r2s).length;
globalInterceptMean /= Object.keys(r2s).length;

const globalStats = {
  r2: globalR2Mean,
  slope: globalSlopeMean,
  intercept: globalInterceptMean,
  rawR2: r2s,
};

const globalJson = JSON.stringify(globalStats, null, 2);

fs.writeFileSync("global.json", globalJson);

// Train models for each statistic
function trainModelsForCountry(countryData) {
  const years = Object.keys(countryData.years)
    .map(Number)
    .filter((year) => year >= 2000 && year < 2024);
  const stats = ["GDP", "unemployment", "HDI", "le", "psi", "energy"];
  const rSquaredValues = {};
  const slopes = {};
  const intercepts = {};

  for (const stat of stats) {
    const validYears = years.filter(
      (year) => countryData.years[year]?.outputs?.[stat] !== undefined
    );

    const validData = normalize(
      validYears.map((year) => countryData.years[year].outputs[stat])
    );

    const xMean = math.mean(validYears);
    const yMean = math.mean(validData);

    const numerator = math.sum(
      validYears.map((x, i) => (x - xMean) * (validData[i] - yMean))
    );
    const denominator = math.sum(years.map((x) => Math.pow(x - xMean, 2)));
    let m = numerator / denominator;
    const b = yMean - m * xMean;

    const yPred = validYears.map((x) => m * x + b);

    const ssTotal = math.sum(validData.map((y) => Math.pow(y - yMean, 2)));
    const ssResidual = math.sum(
      validData.map((y, i) => Math.pow(y - yPred[i], 2))
    );
    let r2 = 1 - ssResidual / ssTotal;

    if (stat != "unemployment") {
      if (m < 0) {
        r2 = 0;
      }
    } else {
      if (m > 0) {
        r2 = 0;
      }
    }

    slopes[stat] = m;
    rSquaredValues[stat] = r2;
    intercepts[stat] = b;
  }

  return { r2s: rSquaredValues, slopes: slopes, intercepts: intercepts };
}

const structured = {};

const processed = Object.keys(data.countries).map((name) => {
  const country = data.countries[name];
  const validYears = Object.keys(country.years).filter(
    (year) => year >= 2000 && year < 2024
  );

  const validSpending = validYears.map((year) => {
    if (country.years[year].total_amount) {
      return country.years[year].total_amount;
    } else {
      return 0;
    }
  });

  let r2 = 0;
  let slope = 0;
  let raw = {};
  try {
    const { r2s, slopes } = trainModelsForCountry(data.countries[name]);
    // console.log(slopes);
    let meanr2 = 0;
    let meanSlope = 0;

    for (const key of Object.keys(r2s)) {
      meanr2 += r2s[key];
      meanSlope += slopes[key];
    }

    meanr2 /= Object.keys(r2s).length;
    slope /= Object.keys(r2s).length;

    // console.log(slopes);
    r2 = meanr2;
    slope = meanSlope;
    raw = r2s;
  } catch (e) {
    // console.log(e);
    r2 = 0;
    slope = 0;
  }

  const output = {
    spending: math.sum(validSpending),
    r2: r2,
    slope: slope,
    adjustedR2: Math.abs(r2 - globalR2Mean) / globalR2Mean,
    adjustedSlope: Math.abs(slope - globalSlopeMean) / globalSlopeMean,
    rawR2: raw,
  };

  structured[name] = output;

  return {
    country: name,
    ...output,
  };
});

const sorted = processed.sort((a, b) => a.spending - b.spending);

console.log("BEGIN");

// console.log(structured);

const sortedJson = JSON.stringify(sorted, null, 2);
const structuredJson = JSON.stringify(structured, null, 2);

fs.writeFileSync("structured.json", structuredJson);
fs.writeFileSync("linreg.json", sortedJson);
