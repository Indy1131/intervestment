const data = require("../../data/final.json");

const countries = data.countries;

// Function to calculate growth rate over a fixed interval
function calculateGrowthRate(currentValue, previousValue, interval) {
  if (previousValue === 0 || currentValue === 0) return 0; // Avoid division by zero

  return (currentValue - previousValue) / previousValue / interval;
}

// Function to find the closest previous year with data
function findPreviousYear(country, year, metric) {
  const years = countries[country].years;
  let prevYear = year - 1;
  let gap = 0;

  while (gap <= 50 && (!years[prevYear] || !years[prevYear].outputs[metric])) {
    prevYear -= 1;
    gap += 1;
  }

  return gap > 50 ? null : prevYear;
}

// Function to calculate cumulative aid over a rolling window
function calculateCumulativeAid(country, year, window) {
  const years = countries[country].years;
  let total = 0;
  let count = 0;

  for (let i = 0; i < window; i++) {
    const y = year - i;
    if (years[y] && years[y].total_amount !== undefined) {
      total += years[y].total_amount;
      count += 1;
    }
  }

  return count === 0 ? 0 : total / count; // Return average over the window
}

const countryDatasets = {};
for (const country in countries) {
  const dataset = [];
  const years = countries[country].years;

  for (const year in years) {
    const entry = years[year];

    if (entry.total_amount !== undefined) {
      const inputs = { spending: entry.total_amount };

      // Calculate growth rates for outputs
      const prevYearGDP = findPreviousYear(country, year, "GDP");
      const prevYearUnemployment = findPreviousYear(
        country,
        year,
        "unemployment"
      );
      const prevYearHDI = findPreviousYear(country, year, "HDI");
      const prevYearLE = findPreviousYear(country, year, "le");
      const prevYearPSI = findPreviousYear(country, year, "psi");
      const prevYearEnergy = findPreviousYear(country, year, "energy");

      inputs.GDP =
        prevYearGDP && entry.outputs.GDP
          ? calculateGrowthRate(
              entry.outputs.GDP,
              years[prevYearGDP].outputs.GDP,
              year - prevYearGDP
            )
          : 0;
      inputs.unemployment =
        prevYearUnemployment && entry.outputs.unemployment
          ? calculateGrowthRate(
              entry.outputs.unemployment,
              years[prevYearUnemployment].outputs.unemployment,
              year - prevYearUnemployment
            )
          : 0;
      inputs.HDI = prevYearHDI && entry.outputs.HDI
        ? calculateGrowthRate(
            entry.outputs.HDI,
            years[prevYearHDI].outputs.HDI,
            year - prevYearHDI
          )
        : 0;
      inputs.le = prevYearLE && entry.outputs.le
        ? calculateGrowthRate(
            entry.outputs.le,
            years[prevYearLE].outputs.le,
            year - prevYearLE
          )
        : 0;
      inputs.psi = prevYearPSI && entry.outputs.psi
        ? calculateGrowthRate(
            entry.outputs.psi,
            years[prevYearPSI].outputs.psi,
            year - prevYearPSI
          )
        : 0;
      inputs.energy = prevYearEnergy && entry.outputs.energy
        ? calculateGrowthRate(
            entry.outputs.energy,
            years[prevYearEnergy].outputs.energy,
            year - prevYearEnergy
          )
        : 0;

      // Calculate cumulative aid over a 3-year window
      inputs.cumulative_aid = calculateCumulativeAid(country, year, 3);

      // Add external features (e.g., war indicator)
      inputs.war = entry.war || 0; // Assuming `war` is a binary feature
      dataset.push(inputs);
    }
  }

  if (dataset.length > 0) {
    countryDatasets[country] = dataset;
  }
}

module.exports = countryDatasets;
