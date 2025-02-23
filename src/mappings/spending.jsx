import * as d3 from "d3";
import Pie from "../components/Pie";
import Bar from "../components/Bar";
// import Line from "../components/Line";
// import CommonData from "../components/CommonData";

const data = await d3.json("/data.json");
const countries = data.countries;

let year = 2000;
let total_amounts = null;
let country_amounts = null;

let colorScale = null;

function setYear(newYear) {
  year = newYear;

  country_amounts = [];

  total_amounts = Object.keys(countries)
    .map((country) => {
      if (!countries[country].years[year]) {
        return 0;
      } else {
        country_amounts.push({
          name: country,
          value: countries[country].years[year].total_amount,
        });
        return countries[country].years[year].total_amount;
      }
    })
    .filter((amount) => amount > 0);

  country_amounts.sort((a, b) => b.value - a.value);
  country_amounts = country_amounts.slice(0, 10);

  colorScale = d3
    .scaleSequential(["#121E2E", "#A371F7"])
    .domain([d3.min(total_amounts), d3.quantile(total_amounts, 0.98)])
    .clamp(true);
}

function fill(d) {
  const country = d.properties.name;
  if (!countries[country] || !countries[country].years[year]) {
    return "black";
  }
  const total = countries[country].years[year].total_amount;
  return total != 0 ? colorScale(total) : "black";
}

function content(country) {
  const yearData = countries[country].years[year];
  const total = yearData.total_amount;

  const orgs = Object.keys(yearData.amount_per_org).map((org) => {
    return { name: [org], value: (yearData.amount_per_org[org] / total) * 100 };
  });

  const categories = Object.keys(yearData.amount_per_category).map(
    (category) => {
      return {
        name: [category],
        value: (yearData.amount_per_category[category] / total) * 100,
      };
    }
  );

  const percent = (total / d3.sum(total_amounts)) * 100;

  return (
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-[#7EE787] text-[30px] pt-[10px]">
        {new Intl.NumberFormat("USD", {
          style: "currency",
          currency: "USD",
        }).format(total)}{" "}
        sent
      </h2>
      <h2 className="text-[#A371F7] text-[30px]">
        {percent.toFixed(5)}% of the total budget
      </h2>
      <hr className="border-[#2F353D] my-[10px]" />
      <h2 className="text-[20px]">Comparison to Countries with Top Spending</h2>
      <div className="backdrop">
        <Bar data={country_amounts} width={700} height={400} />
      </div>
      <h2 className="text-[20px]">Donor Distribution</h2>
      <div className="backdrop">
        <Pie data={orgs} height={250} width={300} />
      </div>
      <h2 className="text-[20px]">Spending Category Distribution</h2>
      <div className="backdrop">
        <Pie data={categories} height={250} width={300} />
      </div>
    </div>
  );
}

export default {
  setYear: setYear,
  fill: fill,
  content: content,
};
