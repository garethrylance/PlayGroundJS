/**
 * Created by Gareth on 08/10/13.
 */
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d/%m/%Y %H:%M:%S").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.timeStamp); })
    .y(function(d) { return y(d.seriesValue); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/ThreeSeriesRandom.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TimeStamp"; }));
    data.forEach(function(d) {
        d.timeStamp = parseDate(d.TimeStamp);
    });

    //Create series with name and values array
    var seriesData = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {timeStamp: d.timeStamp, seriesValue: +d[name]};
            })
        };
    });

    x.domain(d3.extent(data, function(d) { return d.timeStamp; }));

    y.domain([
        d3.min(seriesData, function(c) { return d3.min(c.values, function(v) { return v.seriesValue; }); }),
        d3.max(seriesData, function(c) { return d3.max(c.values, function(v) { return v.seriesValue; }); })
    ]);

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
        .text("seriesValue (ºF)");

    var series = svg.selectAll(".series")
        .data(seriesData)
        .enter().append("g")
        .attr("class", "series");

    series.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    series.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.timeStamp) + "," + y(d.value.seriesValue) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
});