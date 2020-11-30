function init()
{
var w = 1200,
h = 600,
padding = {
    top: 30, 
    right: 50, 
    bottom: 50, 
    left: 100
};

var dateFormat = d3.time.format("%Y");

// Define axis ranges & scales 
var xScale = d3.time.scale()
                .range([padding.left, w - padding.right]),
yScale = d3.scale.linear()
                .range([padding.top, h - padding.bottom]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(function(d) {
        return dateFormat(d);
    }),
yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(5)
    .tickPadding(10);


// Define lines
var categories = [ "Glob", "NHem", "SHem"];
var line = d3.svg.line()
    .x(function(d) { return xScale(dateFormat.parse(d.year)); })
    .y(h-padding.bottom)
    .interpolate("monotone"),
line2 = d3.svg.line()
    .x(function(d) { return xScale(dateFormat.parse(d.year)); })
    .y(function(d) { return yScale(+d.amount);    })
    .interpolate("monotone");

// Create SVG element
var svg = d3.select("body")
.append("svg")
.attr({ width: w, height: h });

// Load data from CSV file
d3.csv("../Datasets/temp.csv", function(data) {

dataset = []

for (i = 0; i < categories.length; i++) {
    dataset[i] = {
        catName: categories[i],
        value: []
    };
    
    for (var j = 0; j < data.length; j++) {
            dataset[i].value.push({
                year: data[j].Year,
                amount: data[j][categories[i]]
            });
    }
    
}

xScale.domain([
    d3.min(data, function(d) {
        return dateFormat.parse(d.Year);
    }),
    d3.max(data, function(d) {
        return dateFormat.parse(d.Year);
    })
]);

yScale.domain([1.00, -1.00]);


    
d3.select("svg").append("rect")
    .attr("class", "base-period")
    .attr({
        x: xScale(dateFormat.parse("1951")),
        y: padding.top,
        width: xScale(dateFormat.parse("1980")) - xScale(dateFormat.parse("1951")),
        height: h - padding.top - padding.bottom,
        fill: "WhiteSmoke ",
    });
    
d3.select("svg").append("text")
    .attr("text-anchor", "middle")
    .attr({
        class: "base-period-label",
        y: 60,
        x: xScale(dateFormat.parse("1951")) + (xScale(dateFormat.parse("1980")) - xScale(dateFormat.parse("1951"))) / 2,
    })
    .text("The base period")
    .style({
        "font-size": 12,
        "font-style": "italic",
        "fill": "#999"
    });

d3.select("text.base-period-label")
    .append("tspan")
    .attr({
        y: 80,
        x: xScale(dateFormat.parse("1951")) + (xScale(dateFormat.parse("1980")) - xScale(dateFormat.parse("1951"))) / 2,
    })
    .text("1951-1980");
    
d3.select("svg").append("line")
    .attr("class", "zero")
    .attr({
        x1: padding.left,
        y1: yScale(0),
        x2: w - padding.right,
        y2: yScale(0),
    })
    .style("stroke", "rgb(230, 230, 230)")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", 1);      

svg.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(0 ," + (h - padding.bottom) + ")")
    .call(xAxis)
    .append("text")
    .attr("text-anchor", "middle")
    .attr({
        class: "xlabel",
        y: 45,
        x: padding.left + (w - padding.left - padding.right) / 2,
    })
    .text("Year")
    .style({
        "font-size": 12,
        "font-style": "bold"
    });

svg.append("g")
    .attr("class", "axis y")
    .attr("transform", "translate(" + (padding.left) + ", 0)")
    .call(yAxis)
    .append("text")
    .attr("text-anchor", "start")
    .attr({
        class: "ylabel",
        y: 10,
        x: -32,
    })
    .text("Temperature Anomaly (\xB0 C)")
    .style({
        "font-size": 12,
        "font-style": "bold"
    }); 


var groups = svg.selectAll(".line")
    .data(dataset)
    .enter()
    .append("g")
    .attr("class", function(d) {
        if (d.catName == "NHem") {
            return "highlight steelblue";
        } else if (d.catName == "SHem") {
            return "highlight red";
        } else {
            return "";
        }
    });

groups.append("title")
    .text(function(d) {
        return d.catName;
    });

var catLine = groups.selectAll("path")
    .data(function(d) {
        return [ d.value ];
    })
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", line);

catLine.transition()
    .delay(500)
    .duration(2000)
    .attr("d", line2);        

var lineLabels = svg.selectAll(".line-label")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", w - 45)
    .attr("y", h - padding.bottom)
    .text(function(d) {
        if (d.catName == "NHem") {
            return "North";
        } else if (d.catName == "SHem") {
            return "South";
        } else {
            return "Global";
        }                
    })
    .style({
        "font-size": 12,
        "font-style": "bold",
        "opacity": 0
    });
    
    lineLabels.transition()
        .delay(500)
        .duration(2000)
        .attr("y", function(d) {

        if (d.catName == "NHem") {
            return yScale(0.91) + 5;
        } else if (d.catName == "SHem") {
            return yScale(0.58) + 5;
        } else {
            return yScale(0.75) + 5;
        }
        
        })
        .style("opacity", 1); 

});
}
window.onload = init;