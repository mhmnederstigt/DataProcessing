window.onload = function() {  
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.log()
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

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tip = d3.tip()
    .attr('class', 'tooltip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>" + d.country +"</strong> <span style='color:#3366cc'></br> GDP:" + d.GDPpcap + "</br> Life Exp.:" + d.lifeExp + "</span>";
    })

  d3.csv("data/HPI_2016.csv", function(error, data) {
    if (error) throw error;


    data.forEach(function(d) {
      d.lifeExp = +d.lifeExp;
      d.GDPpcap = +d.GDPpcap;
    });

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
        .attr("r", function(d) { return (Math.sqrt((d.population/75000)/3.14)+0.5);}) // add a proper function here
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
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

      });
};