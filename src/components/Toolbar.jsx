import { useRef, useState, useContext } from "react";
import * as d3 from "d3";
import YearMetric from "../toolbar/YearMetrics";
import DonorAnalysis from "../toolbar/DonorAnalysis";
import CategoryAnalysis from "../toolbar/CategoryAnalysis";
import ROIAnalysis from "../toolbar/ROIAnalysis";
import FitAnalysis from "../toolbar/FitAnalysis";
import DotLink from "./DotLink";

import { DataContext } from "../views/Layout";
3;

// const data = await d3.json("/data.json");

// const structured = await d3.json("/structured.json");
// const fitScores = await d3.json("/fitScores.json");
// const fits = await d3.json("/fits.json");
// const inputs = await d3.json("/inputs.json");

export default function Toolbar({ expanded, year, country, metric }) {
  const { data, fits, fitScores, global, inputs, ROIs, structured } =
    useContext(DataContext);
  const countries = data.countries;

  const [page, setPage] = useState(0);
  const [prevCountry, setPrevCountry] = useState(null);
  if (country != prevCountry) {
    setPrevCountry(country);
    setPage(0);
  }

  const pages = [
    <YearMetric key={0} country={country} metric={metric} />,
    <DonorAnalysis key={1} country={country} countries={countries} />,
    <CategoryAnalysis
      key={2}
      country={country}
      countries={countries}
      structured={structured}
    />,
    <ROIAnalysis
      key={3}
      country={country}
      countries={countries}
      structured={structured}
      // linreg={linreg}
    />,
    <FitAnalysis
      key={4}
      country={country}
      fitScores={fitScores}
      fits={fits}
      countries={countries}
      inputs={inputs}
    />,
  ];

  const menuRef = useRef(null);

  if (expanded) {
    menuRef.current.scrollTop = 0;
  }

  return (
    <div
      className={`toolbar bg-[#0D1117] relative overflow-scroll ${
        expanded ? "expanded" : ""
      }`}
      ref={menuRef}
    >
      <div className="tool-contents text-right">
        <div className="sticky top-[0] bg-[#0D1116] border-b-[1px] border-[#2F353D] z-3">
          <h1 className="text-[40px] leading-[50px] text-[white] pt-[10px]">
            <span className="text-[#A371F7]">{country}</span>, {year}
          </h1>
          <h1>
            {country && countries[country]
              ? countries[country]["Income group"]
              : ""}
          </h1>
          <div className="flex justify-end gap-[10px] w-[100%] mb-[10px] mt-[4px]">
            {pages.map((item, index) => {
              function navigate() {
                setPage(index);
              }

              return (
                <DotLink
                  key={index}
                  id={index}
                  page={page}
                  navigate={navigate}
                />
              );
            })}
          </div>
        </div>
        <div className="mb-[100px]">{pages[page]}</div>
      </div>
    </div>
  );
}
