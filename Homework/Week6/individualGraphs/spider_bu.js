/*
Milou Nederstigt - 2018-03-16 - Linked Graph Part 1
Example taken from:
https://bl.ocks.org/bricedev/7952923003a8cf0ecb45
*/

window.onload = function () {

var width = 960,
    height = 500,
    barHeight = height / 2 - 40;

var formatNumber = d3.format("s");

var color = d3.scale.ordinal()
    .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);

var svg = d3.select(".spiderContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var variablesPlotted = ["hungerIndex", "footprint", "wellbeing"];

d3.csv("linkedGraphData.csv", function(error, data) {

    // rewrite data to format: [{name: "wellbeing", value: "1"}, {name: "footprint", value: "1"}, {name: "ren", value: "1"}] 
    var dataforspider = [];
    data.forEach(function(d) {
        var country = d.country;
        dataforspider[country] = [];
        
        var list = []
        variablesPlotted.forEach(function(field) {
            dataforspider[country].push({
                name:   field,
                value: +d[field]
            })
        });
    });

    // init spider with initData    
    countrys = Object.keys(dataforspider)
    initDataSpider =  dataforspider[countrys[0]];
    initSpider(initDataSpider);

    // Handler for dropdown value change
    var dropdownChange = function() {
              var newcountry = d3.select(this).property('value')
              console.log(newcountry)
              // should be changed to update
              updateSpider(dataforspider[newcountry]);
    };

    var dropdown = d3.select(".spiderContainer")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(Object.keys(dataforspider))
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
        });
});

            
function initSpider(data){
    // right data format: [{name: "wellbeing", value: "1"}, {name: "footprint", value: "1"}, {name: "ren", value: "1"}] 
    console.log(data)
    var extent = d3.extent(data, function(d) { return d.value; });
    var barScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, barHeight]);

    var keys = data.map(function(d,i) { return d.name; });
    var numBars = keys.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, -barHeight]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(5)
        .tickFormat(formatNumber);

    var circles = svg.selectAll("circle")
        .data(x.ticks(5))
      .enter().append("circle")
        .attr("r", function(d) {return barScale(d);})
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px");

    var arc = d3.svg.arc();

    var segments = svg.selectAll("path")
        .data(data)
      .enter().append("path")
        .each(function(d,i) { 
          d.innerRadius = 0;
          d.outerRadius = barScale(+d.value); 
          d.startAngle = (i * 2 * Math.PI) / numBars;
          d.endAngle = ((i + 1) * 2 * Math.PI) / numBars;
      })
      .style("fill", function (d) { return color(d.name); })
      .style("opacity", 0.5)
      .attr("d", arc);

    svg.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width","1.5px");

    var lines = svg.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "black")
        .style("stroke-width",".5px")
        .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;

    var labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
        .data(data)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .style("font-size", '12')
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")
        .attr("class","textpath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d,i) {return i * 100 / numBars + 50 / numBars + '%';})
        .text(function(d) {return d.name.toUpperCase(); });

    d3.select("input").on("change", change);

    //sort in ascending order
    function change() {
        if (this.checked) {
            labels.selectAll(".textpath").sort(function(a,b) { return b.value - a.value; });
            segments.sort(function(a,b) { return b.value - a.value; });

        }else {
            labels.selectAll(".textpath").sort(function(a,b) { return d3.ascending(a.name, b.name) });
            segments.sort(function(a,b) { return d3.ascending(a.name, b.name); });
        }; 

        segments.transition().duration(2000).delay(100)
            .attrTween("d", function(d,index) {
              var i = d3.interpolate(d.startAngle, (index * 2 * Math.PI) / numBars );
              var u = d3.interpolate(d.endAngle, ((index + 1) * 2 * Math.PI) / numBars );
              return function(t) { d.endAngle = u(t); d.startAngle = i(t); return arc(d,index); };
            });

        labels.selectAll(".textpath").transition().duration(2000).delay(100)
            .attr("startOffset", function(d,i) {return i * 100 / numBars + 50 / numBars + '%'; })
    }
  };

function updateSpider(data){
//this function still has to be written correctly 
    var svg = d3.select(".spiderContainer").transition();

    var barScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, barHeight]);

    var keys = data.map(function(d,i) { return d.name; });
    var numBars = keys.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, -barHeight]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(5)
        .tickFormat(formatNumber);

    svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);    

    var circles = svg.selectAll("circle")
        .data(x.ticks(5))
      .enter().append("circle")
        .attr("r", function(d) {return barScale(d);})
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px");

    var arc = d3.svg.arc();

    var segments = svg.selectAll("path")
        .data(data)
      .enter().append("path")
        .each(function(d,i) { 
          d.innerRadius = 0;
          d.outerRadius = barScale(+d.value); 
          d.startAngle = (i * 2 * Math.PI) / numBars;
          d.endAngle = ((i + 1) * 2 * Math.PI) / numBars;
      })
      .style("fill", function (d) { return color(d.name); })
      .style("opacity", 0.5)
      .attr("d", arc);

    svg.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width","1.5px");

    var lines = svg.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "black")
        .style("stroke-width",".5px")
        .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;

    var labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
        .data(data)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .style("font-size", '12')
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")
        .attr("class","textpath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d,i) {return i * 100 / numBars + 50 / numBars + '%';})
        .text(function(d) {return d.name.toUpperCase(); });

    d3.select("input").on("change", change);

    //sort in ascending order
    function change() {
        if (this.checked) {
            labels.selectAll(".textpath").sort(function(a,b) { return b.value - a.value; });
            segments.sort(function(a,b) { return b.value - a.value; });

        }else {
            labels.selectAll(".textpath").sort(function(a,b) { return d3.ascending(a.name, b.name) });
            segments.sort(function(a,b) { return d3.ascending(a.name, b.name); });
        }; 

        segments.transition().duration(2000).delay(100)
            .attrTween("d", function(d,index) {
              var i = d3.interpolate(d.startAngle, (index * 2 * Math.PI) / numBars );
              var u = d3.interpolate(d.endAngle, ((index + 1) * 2 * Math.PI) / numBars );
              return function(t) { d.endAngle = u(t); d.startAngle = i(t); return arc(d,index); };
            });

        labels.selectAll(".textpath").transition().duration(2000).delay(100)
            .attr("startOffset", function(d,i) {return i * 100 / numBars + 50 / numBars + '%'; })
    }
  };

};
        