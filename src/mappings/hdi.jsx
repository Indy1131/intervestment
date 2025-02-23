import * as d3 from "d3";

let countries = null;

let year = 2000;

let percent_increases = null;
let colorScale = null;

function setYear(newYear, datasets) {
  countries = datasets.data.countries

  year = newYear;

  percent_increases = {};
  const all_increases = Object.keys(countries).map((country) => {
    if (
      !countries[country].years[year]
      // !countries[country].years[year - 1]
    ) {
      return 0;
    } else {
      // const prevTotal = countries[country].years[year - 1].outputs.HDI;
      const currentTotal = countries[country].years[year].outputs.HDI;

      // const percent_increase = ((currentTotal - prevTotal) / prevTotal) * 100;
      percent_increases[country] = currentTotal;

      return currentTotal;
      // return percent_increase;
    }
  });

  colorScale = d3
    .scaleLinear(["#121E2E", "#D29922"])
    .domain([.3, 1])
    .clamp(true);
}

function fill(d) {
  const country = d.properties.name;
  if (!percent_increases[country]) {
    return "black";
  }
  return colorScale(percent_increases[country]);
}

export default {
  setYear: setYear,
  fill: fill,
};
