import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function Pie({ data, width, height }) {
  const [label, setLabel] = useState(null);
  const [labelColor, setLabelColor] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + 500)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`); 

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pieData = pie(data);

    svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.name)) // Use d.data.name for consistent coloring
      .on("mouseover", (event, d) => {
        setLabel(d.data.value.toFixed(2));
        setLabelColor(color(d.data.name)); // Use d.data.name instead of d.index
      })
      .on("mouseout", () => {
        setLabel(null);
        setLabelColor(null);
      });

    // Add legend
    const legend = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width}, 20)`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => color(d.data.name)); // Use d.data.name for consistent coloring

    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text((d) => d.data.name)
      .attr("font-size", "12px")
      .attr("fill", "white");
  }, [data]);

  return (
    <div
      style={{ width: "100%", height: height + 60 }}
      className="relative p-[10px] flex items-center overflow-visible "
    >
      <div
        className="absolute left-[230px] top-0 text-[30px]"
        style={{ color: labelColor ? labelColor : "" }}
      >
        {label ? label + "%" : ""}
      </div>
      <svg ref={svgRef} width={width} height={height} className=""></svg>
    </div>
  );
}