import * as d3 from "d3";

const data = await d3.json("/data.json");
const countries = data.countries;

const ROIs = await d3.json("/ROIs.json");

// console.log(finalScores);

const colorScale = d3
  .scaleLinear(["#b80f36", "#D29922", "#c9ac2a", "#3FBA50"])
  .domain([40, 65, 70, 85])
  .clamp(true);

function setYear() {
  return;
}

function fill(d) {
  const country = d.properties.name;
  if (!ROIs[country]) {
    return "black";
  }
  return colorScale(ROIs[country]);
}

export default {
  setYear: setYear,
  fill: fill,
};
