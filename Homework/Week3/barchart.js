// Barchart Assignment
//Name: Milou Nederstigt
// Student number: 11022914// 
// code taken from: http://bl.ocks.org/Caged/6476579

window.onload = function() {

var margin = {top: 50, right: 100, bottom: 30, left: 100},
    width  = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

d3.json("renewable_energy_europe.json", function(error, data) {

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Renewables:</strong> <span style='color:#3366cc'>" + d.Value +"%</span>";
    })

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // convert Value to type number
  for (i = 0, len = data.length; i < len; i++) { 
    data[i]['Value'] = Number(data[i]['Value'])
  }

  // sort list of countries(objects) in ascending order by renewables value
  data = data.sort(function(a, b){
    return a.Value-b.Value
  })
  
  svg.call(tip);

  x.domain(data.map(function(d) { return d.LOCATION; }));
  y.domain([0, d3.max(data, function(d) { return d.Value;})]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("dy", "-5px")
      .attr("dx", "-30px")
      .style("text-anchor", "end")
      .text("Percentage");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.LOCATION); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Value); })
      .attr("height", function(d) { return height - y(d.Value); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});


}