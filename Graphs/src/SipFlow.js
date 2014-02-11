/**
 * Created by garethr on 10/12/13.
 */
var deviceWidth = 100;
var deviceHeight = 50;
var deviceSpacing = deviceWidth + 50;
var messageSeperation = 40;
var textMessageOffsetSeparationX = 5;
var textMessageOffsetSeparationY = 5;
var textIndent = 5;

var devices = [
    {name:"CUCM"},
    {name:"SBC"},
    {name:"FS01"},
    {name:"CS2K"}
];

var messages = [
    {from:"CUCM", to:"SBC",message:"INVITE"},
    {from:"SBC", to:"FS01",message:"INVITE"},
    {from:"FS01", to:"SBC",message:"INVITE"},
    {from:"SBC", to:"CS2K",message:"INVITE"}
];

var findDeviceIndex = function(name,devices)
{
    for (var i = 0; i < devices.length; i++) {
        var device = devices[i]
        if (device.name == name ) {
            return i;
        }
    }

    return -1;
}


var findDeviceStartPointFromIndex = function(index)
{
    return index *deviceSpacing + deviceWidth/2;
}

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", 50)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 5 5 L 0 10 z");



var messages =svg.selectAll(".messages")
    .data(messages).enter()
    .append('g');

messages.append("svg:line")
    .attr("stroke","black")
    .attr("marker-end", "url(#arrowhead)")
    .attr("class", "messages")
    .attr("x1", function(d) {return findDeviceStartPointFromIndex(findDeviceIndex(d.from, devices));})
    .attr("y1",  function(d,i) {return (messageSeperation*i)+deviceHeight+messageSeperation;})
    .attr("x2", function(d,i){return  findDeviceStartPointFromIndex(findDeviceIndex(d.to, devices));})
    .attr("y2", function(d,i) {return (messageSeperation*i)+deviceHeight+messageSeperation;});


messages.append("text")//d3.min(
    .attr("x", function(d) {return findDeviceStartPointFromIndex(findDeviceIndex(d.from, devices))+textMessageOffsetSeparationX;})
    .attr("y",  function(d,i) {return (messageSeperation*i)+deviceHeight+messageSeperation-textMessageOffsetSeparationY;})
    .text( function (d) { return  d.message; });


var devices = svg.selectAll(".devices")
    .data(devices).enter()
    .append("g");



devices.append("svg:rect")
    .attr("x", function(d,i) {return deviceSpacing*i;})
        .attr("y", 0)
        .attr("width",deviceWidth)
        .attr("fill","none")
        .attr("stroke","black")
        .attr("height", deviceHeight)
        .attr("class", "devices")
        .text(function(d) {
                return d.name;
            });

devices.append("text")
            .attr("x", function(d,i) {return (deviceSpacing*i)+textIndent;})
            .attr("y", deviceHeight/2)
            .text( function (d) { return  d.name; });



devices.append("svg:line")
    .attr("class", "devices")
    .attr("fill","none")
    .attr("stroke","black")
    .attr("x1", function(d,i) {return deviceSpacing*i+(deviceWidth/2);})
    .attr("y1", deviceHeight)
    .attr("x2", function(d,i) {return deviceSpacing*i+(deviceWidth/2);})
    .attr("y2", height);



