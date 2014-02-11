/**
 * Created by garethr on 10/10/13.
 */


function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}


var parseDate = d3.time.format("%d/%m/%Y %H:%M:%S.%L").parse;

function getColour(number) {
    if(number === "1")
    {
        return "red";
    }else
    {
        return "green";
    }
}

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
    d.timeStampStart = parseDate(d.timeStamp);
    d.value = getColour(d.isFailed);
});

x.domain([
    addMinutes(d3.min(data, function(d) { return d.timeStampStart; }),-10),
    addMinutes(d3.max(data, function(d) { return d.timeStampStart; }),10)
    ]
);
y.domain([
    0,
    1
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



var results = svg.selectAll(".rect")
    .data(data);


    results.enter().append("svg:rect")
     .attr("class", function(d) {return x(d.timeStampStart)})
    .attr("x", function(d) {return x(d.timeStampStart)})
    .attr("y", y(1))
    .attr("width",function(d) { return d3.max([2,x(addMinutes(d.timeStampStart,1))-x(d.timeStampStart)]) })
    .attr("height", y(0)-y(1))
    .style("stroke", "none")
    .style("fill", function(d) { return d.value;})
    .append("title")
    .text(function(d) {
        return "calls:"+d.calls+ " errrors:"+ d.errors;
    });



    results.sort(function(a, b){
        return d3.ascending(a.value, b.value);
    });







/*
var events = svg.selectAll(".rect2")
    .data(data)
    .enter().append("svg:rect")
    .attr("x", function(d) {return x(d.timeStampStart)})
    .attr("y", y(2))
    .attr("width",function(d) { return x(d.timeStampStop)-x(d.timeStampStart)})
    .attr("height", y(0)-y(1))
    .style("stroke", "none")
    .style("fill", function(d) { return d.value2;});

*/

