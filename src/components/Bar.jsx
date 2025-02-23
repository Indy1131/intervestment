import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Bar({ data, width, height }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .selectAll("*")
      .remove(); // Clear previous render

    const chart = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Scales
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, svgHeight])
      .padding(0.3);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([0, svgWidth]);

    // Draw Bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.name))
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.value))
      .attr("fill", (d) => colorScale(d.name));

    // Labels next to bars
    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("x", (d) => xScale(d.value) + 5)
      .text((d) => d.name)
      .attr("font-size", "12px")
      .attr("fill", "white")
      .attr("alignment-baseline", "middle");

    // X Axis with units
    chart
      .append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat((d) => `${d}`));

  }, [data]);

  return <svg ref={svgRef}></svg>;
}
