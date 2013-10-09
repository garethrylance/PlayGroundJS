/**
 * Created by Gareth on 07/10/13.
 */

var leftMargin  = 80;
var rightMargin  = 80;
var widthToUse = 960;
var heightToUse=500;


var margin = {top: 10, right: rightMargin, bottom: 100, left: leftMargin},
    marginZoomArea = {top: 430, right: rightMargin, bottom: 20, left: leftMargin},
    width = widthToUse - margin.left - margin.right,
    height = heightToUse - margin.top - margin.bottom,
    heightZoomArea = heightToUse - marginZoomArea.top - marginZoomArea.bottom;

var parseDate = d3.time.format("%d/%m/%Y %H:%M:%S").parse;

var color = d3.scale.category10();

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([heightZoomArea, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .y(y2)
    .on("brush", brushed);

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.timeStamp); })
    .y(function(d) { return y(d.seriesValue); });

var xContext = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x2(d.timeStamp); })
    .y(function(d) { return y2(d.seriesValue); });

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
    .attr("transform", "translate(" + marginZoomArea.left + "," + marginZoomArea.top + ")");


d3.csv("data/ThreeSeriesRandom.csv", function(error, rows) {
    color.domain(d3.keys(rows[0]).filter(function(key) { return key !== "TimeStamp"; }));

    rows.forEach(function(d) {
        d.timeStamp = parseDate(d.TimeStamp);
    });

    //Create series with name and values array
    var seriesData = color.domain().map(function(name) {
        return {
            name: name,
            values: rows.map(function(d) {
                return {timeStamp: d.timeStamp, seriesValue: +d[name]};
            })
        };
    });

    x.domain(d3.extent(rows, function(d) { return d.timeStamp; }));

    y.domain([
        d3.min(seriesData, function(c) { return d3.min(c.values, function(v) { return v.seriesValue; }); }),
        d3.max(seriesData, function(c) { return d3.max(c.values, function(v) { return v.seriesValue; }); })
    ]);

    x2.domain(x.domain());
    y2.domain(y.domain());


    var focusMain = focus.selectAll(".series")
        .data(seriesData)
        .enter().append("g")
        .attr("class", "series");



    focusMain.append("path")
        .attr("clip-path", "url(#clip)")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });


    focusMain.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focusMain.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var contextMain = context.selectAll(".contextSeries")
        .data(seriesData)
        .enter().append("g")
        .attr("class", "contextSeries");

    contextMain.append("path")
        .attr("d", function(d) { return xContext(d.values); })
        .style("stroke", function(d) { return color(d.name); });


    contextMain.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightZoomArea + ")")
        .call(xAxis2);

    contextMain.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", heightZoomArea + 7);
});

function brushed() {
    if(!brush.empty())
    {
        var extent = brush.extent();
        x.domain( [extent[0][0],extent[1][0]]);
        y.domain( [extent[0][1],extent[1][1]]);



        var focusMain = focus.selectAll(".series");


        focusMain.selectAll("path")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

        focus.select(".x.axis").call(xAxis);
    }
}
