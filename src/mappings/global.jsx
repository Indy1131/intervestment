import * as d3 from "d3";

const fitScores = await d3.json("/fitScores.json");
const ROIs = await d3.json("/ROIs.json");

const finalScores = {};

Object.keys(fitScores).map((country) => {
  const finalScore = (Number(fitScores[country]) + Number(ROIs[country])) / 2;
  finalScores[country] = finalScore;
  return finalScore;
});

const colorScale = d3
  .scaleLinear(["#b80f36", "#D29922", "#c9ac2a", "#3FBA50"])
  .domain([40, 65, 70, 90])
  .clamp(true);

function setYear() {
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
