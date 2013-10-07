/**
 * Created by Gareth on 07/10/13.
 */
var margin = {top: 10, right: 10, bottom: 100, left: 80},
    margin2 = {top: 430, right: 10, bottom: 20, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .y(y2)
    .on("brush", brushed);

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

var xContext = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.price); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


d3.csv("data/example.csv", function(error, rows) {
    rows.forEach(function(d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
    });

    x.domain(d3.extent(rows.map(function(d) { return d.date; })));
    y.domain([0, d3.max(rows.map(function(d) { return d.price; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(rows)
        .attr("clip-path", "url(#clip)")
        .attr("d", line);

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    context.append("path")
        .datum(rows)
        .attr("d", xContext);

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
});

function brushed() {
    if(!brush.empty())
    {
        var extent = brush.extent();
        x.domain( [extent[0][0],extent[1][0]]);
        y.domain( [extent[0][1],extent[1][1]]);
        focus.select("path").attr("d", line);
        focus.select(".x.axis").call(xAxis);
    }
}