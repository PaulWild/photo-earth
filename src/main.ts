import "./style.css";
import * as d3 from "d3";
import * as d3Geo from "d3-geo-projection";
import { data } from "./uk";
import worldMap from "./world-med-res.json" assert { type: "json" };

var width = document.querySelector("svg")!.clientWidth;
var height = document.querySelector("svg")!.clientHeight;
const svg = d3
  .select("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg.select("svg .map");
const g2 = svg.select("svg .hex");

const projection = d3Geo
  .geoCylindricalEqualArea()
  .fitSize([width, height], worldMap)
  .scale(3000)
  .center([-4, 51]);

const path = d3.geoPath().projection(projection);

drawMap();
drawHexes();

var drag = d3.drag().on("drag", dragged);
var zoom = d3.zoom().on("zoom", zoomed);

// @ts-expect-error
svg.call(drag);
// @ts-expect-error
svg.call(zoom);

function drawMap() {
  g.selectAll("path")
    // @ts-expect-error
    .data(worldMap.features)
    .enter()
    .append("path")
    // @ts-expect-error
    .attr("d", path);
}

function drawHexes() {
  g2.selectAll("path")
    .data(data.geometries)
    .enter()
    .insert("path")
    .attr("fill", (d) => `url(#${d.properties.id})`)
    .attr("d", path);

  g2.selectAll("def")
    .data(data.geometries)
    .enter()
    .append("defs")
    .append("pattern")

    .attr("id", (d) => d.properties.id)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("patternUnits", "objectBoundingBox")
    .attr("patternContentUnits", "objectBoundingBox")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .append("image")
    .attr(
      "xlink:href",
      (d) => `https://placedog.net/100/100?id=${d.properties.id}`
    )
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("width", 1)
    .attr("height", 1);
}

function dragged(event: { dx: number; dy: number }) {
  var dx = event.dx / 50;
  var dy = event.dy / 50;

  var currentCenter = projection.center();
  projection.center([currentCenter[0] - dx, currentCenter[1] + dy]);
  // @ts-expect-error
  g.selectAll("path").attr("d", path);
  // @ts-expect-error
  g2.selectAll("path").attr("d", path);
}

function zoomed(event: { sourceEvent: { wheelDelta: number } }) {
  projection.scale(
    bind(projection.scale() + event.sourceEvent.wheelDelta * 10, 100, 10000)
  );

  // @ts-expect-error
  g.selectAll("path").attr("d", path);
  // @ts-expect-error
  g2.selectAll("path").attr("d", path);
}

function bind(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
