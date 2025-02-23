import { useEffect, useRef, useState, useContext } from "react";
import * as d3 from "d3";
import metrics from "../mappings/metrics";
import Toolbar from "./Toolbar";
import { DataContext } from "../views/Layout";

const width = 5000;
const height = 5000;

export default function Map({ year, metric }) {
  const datasets = useContext(DataContext);

  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const prevMetric = useRef(null);
  const svgRef = useRef();
  const zoomRef = useRef(null);

  function clearCountry() {
    d3.select(country.node).classed("selected", false);
    setExpanded(false);
  }

  useEffect(() => {
    async function getData() {
      try {
        const svg = d3
          .select("#heatmap")
          .attr("width", width)
          .attr("height", height);

        const response = await d3.json("/world.json");
        metrics[metric].setYear(year, datasets);

        const projection = d3
          .geoEquirectangular()
          .scale(600)
          .translate([width / 2, height / 2 + 300]);

        const path = d3.geoPath().projection(projection);

        svg.selectAll("*").remove();

        const defs = svg.append("defs");
        defs
          .append("radialGradient")
          .attr("id", "glowGradient")
          .attr("cx", "0.5")
          .attr("cy", "0.5")
          .attr("r", "0.5")
          .selectAll("stop")
          .data([
            { offset: "0%", color: "#0e223b", opacity: 1 },
            { offset: "20%", color: "black", opacity: 0 },
          ])
          .enter()
          .append("stop")
          .attr("offset", (d) => d.offset)
          .attr("stop-color", (d) => d.color)
          .attr("stop-opacity", (d) => d.opacity);

        const g = svg.append("g");

        g.append("rect")
          .attr("id", "background")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "url(#glowGradient)");

        g.selectAll("path")
          .data(response.features) // Each state in the GeoJSON data
          .enter()
          .append("path")
          .attr("d", path) // Draw the shape of each state
          .attr("fill", (d) => {
            if (prevMetric.current == metric) {
              return metrics[metric].fill(d);
            } else {
              return "black";
            }
          })
          .classed("transition", true)
          .attr("stroke", "#224981")
          .attr("stroke-width", 1)
          .on("mouseover", (event) => {
            d3.select(event.currentTarget).raise();
            d3.select(event.currentTarget).classed("highlight", true);
          })
          .on("mouseout", (event) => {
            d3.select(event.currentTarget).classed("highlight", false);
          })
          .on("click", (event, d) => {
            const country = d.properties.name;

            const [x, y] = path.centroid(d);
            const translate = [width / 2 - x, height / 2 - y];

            svg.interrupt();

            svg
              .transition()
              .duration(750)
              .call(
                zoomRef.current.transform,
                d3.zoomIdentity.translate(translate[0], translate[1])
              );
            d3.select(event.currentTarget).raise().classed("selected", true);

            setExpanded(true);

            setCountry({ name: country, node: event.currentTarget });
          });

        if (prevMetric.current != prevMetric) {
          g.selectAll("path")
            .data(response.features)
            .interrupt()
            .transition()
            .duration(70)
            .attr("fill", (d) => {
              return metrics[metric].fill(d);
            });
          prevMetric.current = metric;
          setExpanded(false);
        }

        g.attr("transform", d3.zoomTransform(svg.node()));
        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 3]) // Min and max zoom levels
          .on("zoom", (event) => {
            g.attr("transform", event.transform); // Apply transformation
          });
        svg.call(zoom); // Attach zoom behavior to the SVG
        zoomRef.current = zoom;

        d3.select(g.node()).on("mousemove", function (event) {
          let [x, y] = d3.pointer(event, g.node());
          x = Math.min(Math.max(x, 400), width - 400);
          y = Math.min(Math.max(y, 400), height - 400);
          svg
            .select("#glowGradient")
            .attr("cx", x / height) // Normalize x to [0, 1]
            .attr("cy", y / width); // Normalize y to [0, 1]
        });
      } catch (error) {
        console.log(error);
        setError("Error loading heatmap");
      }
    }
    getData();
  }, [year, metric]);

  if (error) return <h1>{error}</h1>;

  function resetView() {
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity);
    clearCountry();
  }

  return (
    <>
      <div className="items-center justify-center flex-1 overflow-hidden relative flex">
        <button
          onClick={resetView}
          className="text-[#585E66] z-50 absolute top-[24px] left-[24px] bg-[black] border-[1px] border-[#2E343D] py-[4px] px-[8px] rounded-[4px]"
        >
          Center View
        </button>
        <div
          className={`map-container ${expanded ? "container-disabled" : ""}`}
          onClick={() => {
            clearCountry();
          }}
        ></div>
        <svg
          id="heatmap"
          height="100%"
          width="100%"
          ref={svgRef}
          className=" absolute"
        ></svg>
      </div>
      <div className="z-5 flex max-h-[100%]">
        <Toolbar
          expanded={expanded}
          year={year}
          country={country ? country.name : ""}
          metric={metric}
        />
      </div>
    </>
  );
}
