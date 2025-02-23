const data = require("../../data/final.json");

const countries = data.countries;

for (const country in countries) {
  console.log(country);
}
