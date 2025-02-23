import * as d3 from "d3";
import Line from "../components/Line";
import Pie from "../components/Pie";
import Bar from "../components/Bar";

export default function CategoryAnalysis({ country, countries, structured }) {
  function normalize(data) {
    const arr = Object.keys(data).map((d) => data[d].value);

    const min = d3.min(arr);
    const max = d3.max(arr);

    for (const key of Object.keys(data)) {
      data[key].value = (data[key].value - min) / (max - min);
    }

    return data;
  }

  const gdpTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000 ? countries[country].years[year].outputs.GDP : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(gdpTimeline);

  const unemploymentTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000
            ? countries[country].years[year].outputs.unemployment
            : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(unemploymentTimeline);

  const hdiTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000 ? countries[country].years[year].outputs.HDI : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(hdiTimeline);

  const leTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000 ? countries[country].years[year].outputs.le : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(leTimeline);

  const psiTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000 ? countries[country].years[year].outputs.psi : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(psiTimeline);

  const energyTimeline = Object.keys(countries[country].years)
    .map((year) => {
      return {
        name: year,
        value:
          year >= 2000
            ? countries[country].years[year].outputs.energy
            : undefined,
      };
    })
    .filter((year) => year.value !== undefined);
  normalize(energyTimeline);

  let orgSum = 0;

  const orgs = [];
  const rawR2 = structured[country].rawR2;

  for (const val of Object.keys(rawR2)) {
    orgSum += 1 - rawR2[val];
  }

  const points = {
    "Economic Growth": 0,
    "Commodity Assistance": 0,
    "Administrative Costs": 0,
    Governance: 0,
    Humanitarian: 0,
    Infrastructure: 0,
    "Health and Population": 0,
    Agriculture: 0,
  };

  const pairings = {
    GDP: ["Economic Growth"],
    unemployment: ["Economic Growth", "Commodity Assistance"],
    HDI: [
      "Infrastructure",
      "Commodity Assistance",
      "Humanitarian",
      "Agriculture",
      "Health and Population",
    ],
    le: ["Health and Population", "Humanitarian", "Commodity Assistance"],
    psi: ["Infrastructure", "Governance", "Administrative Costs"],
    energy: ["Infrastructure", "Economic Growth"],
  };

  for (const val of Object.keys(rawR2)) {
    for (const cat of pairings[val]) {
      points[cat] += rawR2[val] == 0 ? 0 : 1 - rawR2[val];
    }
    orgs.push({
      name: val,
      value: rawR2[val] == 0 ? 0.001 : rawR2[val] / orgSum,
    });
  }

  const recommended = Object.keys(points).map((key) => {
    return { name: key, value: points[key] };
  });

  const stabilityScore = (structured[country].r2 * 100).toFixed(2);

  return (
    <>
      <h2 className="text-[40px]">Category Analysis</h2>
      <h2 className="text-[20px] my-[10px]">Normalized Metrics over Time</h2>
      <div className="backdrop">
        <Line
          data={[
            // { name: "Spending", values: timeline },
            { name: "GDP", values: gdpTimeline },
            { name: "Unemployment", values: unemploymentTimeline },
            { name: "HDI", values: hdiTimeline },
            { name: "Life Expectancy", values: leTimeline },
            { name: "Political Stability Index", values: psiTimeline },
            { name: "Energy Consumption", values: energyTimeline },
          ]}
        />
      </div>
      <h2 className="text-[20px] my-[10px]">Summary of Metric Stability</h2>
      <div className="backdrop">
        <Bar data={orgs} height={250} width={700} />
      </div>
      <h2 className="text-[20px] my-[10px]">
        Recommended Category Target Distributions
      </h2>
      <div className="backdrop">
        <Pie data={recommended} height={250} width={300} />
      </div>
      <h1 className="mt-[20px]">Output Stability Score</h1>
      <h1 className="text-green-400 text-[40px]">{stabilityScore}</h1>
    </>
  );
}
