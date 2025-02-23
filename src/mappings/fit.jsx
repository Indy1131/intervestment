import * as d3 from "d3";

const fitScores = await d3.json("/fitScores.json");
// console.log(finalScores);

const colorScale = d3
  .scaleLinear(["#b80f36", "#D29922", "#c9ac2a", "#3FBA50"])
  .domain([40, 65, 70, 90])
  .clamp(true);

function setYear() {
  return;
}

function fill(d) {
  const country = d.properties.name;
  if (!fitScores[country]) {
    return "black";
  }
  return colorScale(fitScores[country]);
}

export default {
  setYear: setYear,
  fill: fill,
};
