/* 
Scatterplot assignment
Student name: Milou Nederstigt
Student number: 11022914
Date: 20180312

References: 
http://bl.ocks.org/weiglemc/6185069

*/

window.onload = function() {  
  function colorGoogle(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
  }

  function circleSize(population) {
    return (Math.sqrt(population/70000/Math.PI)+0.5);
  }

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.log()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();
  console.log(color);

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

  var tip = d3.tip()
    .attr('class', 'tooltip')
    .offset([-10, 0])
    .style("background",'#BCC5F7')
    .style("padding",'12px')
    .style("border-radius",'12px')
    .html(function(d) {
      return "<strong>" + d.country +"</strong> <span style='color:#3366cc'></br> GDP: " + d.GDPpcap + "</br> Life Exp.: " + d.lifeExp + "</br> Population: " + d.population + "</span>";
    })

  d3.csv("linkedGraphData.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.lifeExp = +d.lifeExp;
      d.GDPpcap = +d.GDPpcap;
    });

    //sort from largest to smallest population to make circles accessible for mouse events
    data = data.sort(function(b, a)  {
      return a.population - b.population;
    })

    svg.call(tip);

    x.domain(d3.extent(data, function(d) { return d.GDPpcap; })).nice();
    y.domain(d3.extent(data, function(d) { return d.lifeExp; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("GDP per capita ($)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Average life expectancy")

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return circleSize(d.population)}) // add a proper function here
        .attr("cx", function(d) { return x(d.GDPpcap); })
        .attr("cy", function(d) { return y(d.lifeExp); })
        .style("fill", function(d) { return color(d.region); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 30)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    ///// !! could be prettier
    var legendPop = svg.selectAll(".legendPop")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }); width-50, height-50 ??
        .data([0.5E8, 1.5E8, 4.5E8])
      .enter().append("g")
        .attr("class", "legend")
        
    legendPop.append("circle")
        .attr("cx", width - circleSize(300003000))
        .attr("cy", function(d) {return 400-circleSize(d); }) // how to not hard code this?
        .attr("r", function(d) {return  circleSize(d); })
        .style("fill", "none")
        .style("stroke", "grey")
        .style("stroke-width", "1")

    legendPop.append("text")
        .attr("x", width - 70)
        .attr("dy", function(d) {return 400}) // how to not hard code this?
        .style("text-anchor", "end")
        .text("Population");

    legendPop.append("text")
        .attr("x", width - 60)
        .attr("dy", function(d) {return 400-2*circleSize(d) - 2}) // how to not hard code this?
        .style("text-anchor", "end")
        .text(function(d) { return d3.format(",")(d) });

    legendPop.append("line") // this is the black vertical line to follow mouse
      .attr("class", "line")
      .style("stroke", "grey")
      .attr("x1", width - 130) // make this depend on the start of the label
      .attr("x2", width - circleSize(300003000))
      .attr("y1", function(d) {return 400-2*circleSize(d); }) // how to not hard code this?
      .attr("y2", function(d) {return 400-2*circleSize(d); }) // how to not hard code this?
      .style("stroke-width", "1px");

    });
};