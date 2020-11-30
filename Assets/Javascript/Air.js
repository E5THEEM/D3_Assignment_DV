function init()
{
  var margin = {top: 20, right: 40, bottom: 30, left: 150},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");
var formatTime = d3.time.format("%Y");
var format = d3.format(".2s");


  //Adding a separate group to 'layer' the objects
  //var lineSvg = svg.append("g");
  //var focus = svg.append("g") 
    //.style("display", "none");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.World); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y1(d.CO2); });

    
  // set the ranges
//var x = d3.scaleTime().range([0, width]);
//var y = d3.scaleLinear().range([height, 0]);


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
  
// Define the div for the tooltip
var div = d3.select("#chart").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("../Datasets/WorldPopulation&AirQuality.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.World = +d.World;
      d.CO2 = +d.CO2;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) {return Math.max(d.World);})]);
  y1.domain([0, d3.max(data, function(d) {return Math.max(d.CO2); })]);


  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("data-legend",function(d) { return d.World})
      .attr("d", valueline);
//mouseover and dots
      svg.selectAll("dot")	
      .data(data)			
  .enter().append("circle")								
      .attr("r", 4)		
      .attr("cx", function(d) { return x(d.Year); })		 
      .attr("cy", function(d) { return y(d.World); })	
      .style("fill", "blue" )	
      .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div	.html(formatTime(d.Year) + "<br/>"  + (format(d.World).replace(/G/," Billion")))	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
            });


    // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);

    
      svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);
//mouseover and dots
      svg.selectAll("dot")	
      .data(data)			
        .enter().append("circle")								
      .attr("r", 4)		
      .attr("cx", function(d) { return x(d.Year); })		 
      .attr("cy", function(d) { return y1(d.CO2); })
      .style("fill", "red" )	

      .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div	.html(formatTime(d.Year) + "<br/>"  + (d.CO2 + " CO2"))
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });

// Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      
  // Add the Y Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(y));


  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1));

});

}
window.onload = init;