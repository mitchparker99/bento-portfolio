import { onMount } from "solid-js";
import * as d3 from "d3";
import worldData from "../lib/world.json";

const GlobeComponent = () => {
  let mapContainer: HTMLDivElement | undefined;

  const visitedCountries = [
    "France",
    "Japan",
    "Italy",
    "UK",
    "Turkey",
    "Iceland",
    "Australia",
    "Indonesia",
    "Doha",
    "Germany",
  ];

  onMount(() => {
    if (!mapContainer) return;

    const width = mapContainer.clientWidth;
    const height = 1000;
    const sensitivity = 150;
    const rotationSpeed = 0.01;
    let rotationAngle = 0;

    let projection = d3
      .geoOrthographic()
      .scale(350)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let pathGenerator = d3.geoPath().projection(projection);

    let svg = d3
      .select(mapContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("circle")
      .attr("fill", "lightblue")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", initialScale);

    let map = svg.append("g");

    map.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", (d: any) => pathGenerator(d as any))
      .attr("fill", (d: { properties: { name: string } }) =>
        visitedCountries.includes(d.properties.name) ? "#FFC300" : "#4CAF50"
      )
      .style("stroke", "#222")
      .style("stroke-width", 0.5)
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("opacity", 0.8);
      });

    d3.timer(() => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      map.selectAll("path").attr("d", (d: any) => pathGenerator(d as any));
      rotationAngle += rotationSpeed;
      if (Math.abs(rotate[0]) > 180) {
        projection.rotate([rotate[0] - 360 * Math.sign(rotate[0]), rotate[1]]);
      }
    }, 50);
  });

  return (
    <div class="flex flex-col justify-center items-center w-full h-full">
      <div class="w-full" ref={mapContainer}></div>
    </div>
  );
};

export default GlobeComponent;
