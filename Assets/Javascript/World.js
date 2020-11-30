function init(){

  var margin = {top: 60, right: 20, bottom: 30, left: 100},
  width = 1280 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Adjust parsing of data to properly show tooltip
var parseDate = d3.timeParse("%Y"),
  bisectDate = d3.bisector(function(d) { return d.Year; }).left,
  formatValue = d3.format("0.2s"),
  formatCurrency = function(d) { return formatValue(d) + " Billion"; };

var x = d3.scaleTime()
.range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom()
  .scale(x);

var yAxis = d3.axisLeft()
  .scale(y);

var line = d3.line()
  .x(function(d) { return x(d.Year); })
  .y(function(d) { return y(d.World); });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../Datasets/WorldPopulation.csv", function(error, data) {
if (error) throw error;
console.log(data);

data.forEach(function(d) {
  d.Year = parseDate(d.Year);
  d.World = +d.World;
});

x.domain(d3.extent(data, function(d) { return d.Year; }));
y.domain(d3.extent(data, function(d) { return d.World; }));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Unemployment Rate (%)");

// Start Animation on Click
d3.select("#start").on("click", function() {
  var path = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  // Variable to Hold Total Length
  var totalLength = path.node().getTotalLength();

  // Set Properties of Dash Array and Dash Offset and initiate Transition
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
   .transition() // Call Transition Method
    .duration(6000) // Set Duration timing (ms)
    .ease(d3.easeLinear) // Set Easing option
    .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

  // Create SVG for Tooltip and Circle on Mouseover
  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  // Append a circle to show on Mouseover
  focus.append("circle")
      .attr("r", 4.5);

  // Append text to show on Mouseover
  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  // Append overlay rectangle as container for Circle and Tooltips
  // that allows user to hover anywhere on graphic
  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  // Mousemove function that sets location and changes properties of Focus SVG
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.World) + ")");
    focus.select("text").text(formatCurrency(d.World));
  }
});

// Reset Animation
d3.select("#reset").on("click", function() {
  d3.select(".line").remove();
});
});

  }
  window.onload = init;