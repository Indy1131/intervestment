import * as d3 from "d3";

let fitScores = null;
let ROIs = null;

const finalScores = {};

const colorScale = d3
  .scaleLinear(["#b80f36", "#D29922", "#c9ac2a", "#3FBA50"])
  .domain([40, 65, 70, 90])
  .clamp(true);

function setYear(year, datasets) {
  fitScores = datasets.fitScores;
  ROIs = datasets.ROIs;

  Object.keys(fitScores).map((country) => {
    const finalScore = (Number(fitScores[country]) + Number(ROIs[country])) / 2;
    finalScores[country] = finalScore;
    return finalScore;
  });

  return;
}

function fill(d) {
  const country = d.properties.name;
  if (!finalScores[country]) {
    return "black";
  }
  return colorScale(finalScores[country]);
}

export default {
  setYear: setYear,
  fill: fill,
};
