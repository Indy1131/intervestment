import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Line({ data, yDomain = [0, 1], showReg, noLine }) {
  const svgRef = useRef();
  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 700;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const allYears = data.flatMap((dataset) =>
      dataset.values.map((d) => d.name)
    );

    const xScale = d3
      .scaleLinear()
      .domain([d3.quantile(allYears, 0), d3.quantile(allYears, 0.8)])
      .range([0, svgWidth]);

    const yScale = d3
      .scalePow()
      .exponent(1)
      .domain(yDomain)
      .nice()
      .range([svgHeight, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const line = d3
      .line()
      .x((d) => xScale(d.name))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    if (!noLine) {
      svg
        .selectAll(".line")
        .data(data)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", (d) => color(d.name))
        .attr("stroke-width", 2)
        .attr("d", (d) => line(d.values));
    }

    data.forEach((dataset) => {
      svg
        .selectAll(`.dot-${dataset.name}`)
        .data(dataset.values)
        .join("circle")
        .attr("class", `dot-${dataset.name}`)
        .attr("cx", (d) => xScale(d.name))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", color(dataset.name))
        .on("mouseover", (event, d) => console.log(d));
    });

    const m = 1.7652516531122193e-11;
    const b = 0.512106184526206;

    const x1 = 0,
      x2 = 188797563335;

    const y1 = b;
    const y2 = m * x2 + b;

    if (showReg) {
      svg
        .append("line")
        .attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2))
        .attr("stroke", "#5B4991")
        .attr("stroke-width", 2);
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    svg.append("g").call(d3.axisLeft(yScale).ticks(5));
  }, [data, noLine, showReg]);

  return <svg ref={svgRef}></svg>;
}
