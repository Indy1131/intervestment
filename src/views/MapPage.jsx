import { useState } from "react";
import Map from "../components/Map";

const MIN_YEAR = 1960;
const MAX_YEAR = 2024;

export default function MapPage() {
  const [metric, setMetric] = useState("spending");
  const [year, setYear] = useState(2020);

  function changeYear(e) {
    setYear(e.target.value);
  }

  function changeMetric(e) {
    setMetric(e.target.value);
  }

  return (
    <>
      <div className="w-[100vw] flex items-center justify-center sticky top-[0] bg-[black] border-[#2F353D] border-b-[1px] z-40 box-border p-[10px]">
        <h2 className="text-[60px] w-[200px] text-center">{year}</h2>

        <form className="flex flex-col gap-[16px] items-center border-[1px] border-[#2E343D] py-[20px] px-[40px] rounded-[8px] bg-[#0D1117]">
          <div className="flex items-center gap-[10px]">
            <h1 className="text-[10px] text-[#585E66]">{MIN_YEAR}</h1>
            <input
              name="year"
              type="range"
              className="w-[500px] appearance-none bg-[#19212F] rounded-[60px] border-[1px] border-[#224981] h-[8px]"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={changeYear}
            />
            <h1 className="text-[10px] text-[#585E66]">{MAX_YEAR}</h1>
          </div>
          <div className="flex gap-[10px] items-center">
            <select
              onChange={changeMetric}
              className="border-[#2E343D] border-[1px] bg-[#151A23] text-[#9198A1] p-[6px] rounded-[4px] w-[600px]"
            >
              <option disabled>Federal Spending</option>
              <option value="spending">Percent of Foreign Budget</option>
              <option value="spending_relative">Change in Spending</option>
              <option disabled>Analysis</option>
              <option value="ROI">ROI Scores</option>
              <option value="fit">Fit Scores</option>
              <option disabled>Economic Predictors</option>
              <option value="gdp">
                Gross Domestic Product (GDP) Per Capita
              </option>
              <option value="unemployment">Unemployment Rate</option>
              <option disabled>Public Health Predictors</option>
              <option value="hdi">Human Development Index (HDI)</option>
              <option value="le">Life Expectancy at Birth</option>
              <option disabled>Stability Predictors</option>
              <option value="psi">Political Stability Index (PSI)</option>
              <option value="energy">Energy Consumption (TWh)</option>
              <option disabled>Educaction Predictors</option>
              <option value="literacy">Literacy Rate</option>
              <option value="education">
                Percent of People (15yrs+) with No Education
              </option>
            </select>
            {/* <input
              placeholder="Budget in Billions of USD"
              className="bg-[#151A23] text-[#9198A1] w-[300px] p-[4px] border-[#2E343D] border-[1px] rounded-[4px]"
            ></input> */}
            <button
              type="button"
              onClick={() => setMetric("global")}
              className="box-border bg-[#3081F7] p-[4px] px-[10px] rounded-[4px] hover:bg-[transparent] border-[#3081F7] border-[1px] hover:text-[#3081F7] transition-all cursor-pointer"
            >
              Perform Global Analysis
            </button>
          </div>
        </form>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <Map year={year} metric={metric} />
      </div>
    </>
  );
}
