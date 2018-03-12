window.onload = function() {  
var margin = {top: 20, right: 20, bottom: 30, left: 40},
     width = 960 - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = ["Middle East and North Africa", "Post-communist", "Americas", "Asia Pacific", "Europe", "Sub Saharan Africa"]
var color = d3.scale.category10();

var legendCountry = svg.selectAll(".legend")
        .data(data)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legendCountry.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legendCountry.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

};