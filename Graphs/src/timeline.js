/**
 * Created by garethr on 10/10/13.
 */


var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d) {
    d.timeStampStart = new Date(d.timeStampStart);
    d.timeStampStop = new Date(d.timeStampStop);
});

x.domain(d3.extent(data, function(d) { return d.timeStampStop; }));
y.domain([
    0,
    4
]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
/*
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
*/
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var events = svg.selectAll(".rect1")
    .data(data)
    .enter().append("svg:rect")
    .attr("x", function(d) {return x(d.timeStampStart)})
    .attr("y", y(4))
    .attr("width",function(d) { return x(d.timeStampStop)-x(d.timeStampStart)})
    .attr("height", y(0)-y(1))
    .style("stroke", "none")
    .style("fill", function(d) { return d.value1;});



var events = svg.selectAll(".rect2")
    .data(data)
    .enter().append("svg:rect")
    .attr("x", function(d) {return x(d.timeStampStart)})
    .attr("y", y(2))
    .attr("width",function(d) { return x(d.timeStampStop)-x(d.timeStampStart)})
    .attr("height", y(0)-y(1))
    .style("stroke", "none")
    .style("fill", function(d) { return d.value2;});



