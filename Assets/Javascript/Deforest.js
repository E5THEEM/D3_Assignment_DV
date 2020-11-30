function init()
{

  // d3.select("#MAP").on("click", function() {
  // // The svg
  var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2])
var path = d3.geoPath()
  .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeReds[5];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
  .domain([1.0, 6.0, 11.0, 26.0, 101.0, 201.0])
  .range(colorScheme);

// Legend
var g = svg.append("g")
  .attr("class", "legendThreshold")
  .attr("transform", "translate(20,20)");
g.append("text")
  .attr("class", "caption")
  .attr("x", 0)
  .attr("y", -6)
  .text("Forest %");
  
var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
var legend = d3.legendColor()
  .labels(function (d) { return labels[d.i]; })
  .shapePadding(2)
  .scale(colorScale);
svg.select(".legendThreshold")
  .call(legend);

// Load external data and boot
d3.queue()
  .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
  .defer(d3.csv, "../Datasets/forestarea.csv", function(d) { data.set(d.code, +d.forest); })
  .await(ready);

function ready(error, topo) {
  if (error) throw error;

  // Draw the map
  svg.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(topo.features)
      .enter().append("path")
          .attr("fill", function (d){
              // Pull data for this country
              d.forest = data.get(d.id) || 0;
              // Set the color
              return colorScale(d.forest);
          })
          .attr("d", path);
  };
}
window.onload = init;