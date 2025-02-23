import spending from "./spending";
import spending_relative from "./spending_relative";
import gdp from "./gdp";
import unemployment from "./unemployment";
import hdi from "./hdi";
import le from "./le";
import psi from "./psi";
import energy from "./energy";
import literacy from "./literacy";
import education from "./education";
import global from "./global";
import ROI from "./ROI";
import fit from "./fit";

export default {
  content: function (metric, country) {
    try {
      const node = this[metric].content(country);
      return node;
    } catch {
      return <h1>There is no data for this country at the specified year.</h1>;
    }
  },
  spending: {
    setYear: spending.setYear,
    fill: spending.fill,
    content: spending.content,
  },
  spending_relative: {
    setYear: spending_relative.setYear,
    fill: spending_relative.fill,
  },
  gdp: {
    setYear: gdp.setYear,
    fill: gdp.fill,
  },
  unemployment: {
    setYear: unemployment.setYear,
    fill: unemployment.fill,
  },
  hdi: {
    setYear: hdi.setYear,
    fill: hdi.fill,
  },
  le: {
    setYear: le.setYear,
    fill: le.fill,
  },
  psi: {
    setYear: psi.setYear,
    fill: psi.fill,
  },
  energy: {
    setYear: energy.setYear,
    fill: energy.fill,
  },
  literacy: {
    setYear: literacy.setYear,
    fill: literacy.fill,
  },
  education: {
    setYear: education.setYear,
    fill: education.fill,
  },
  global: {
    setYear: global.setYear,
    fill: global.fill,
  },
  ROI: {
    setYear: ROI.setYear,
    fill: ROI.fill,
  },
  fit: {
    setYear: fit.setYear,
    fill: fit.fill,
  },
};
