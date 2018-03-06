window.onload = function() {

  	//start example
    var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    googleColors =  ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(googleColors)

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.windspeed); });

d3.selectAll(".m")
				.on("click", function() {
					var date = this.getAttribute("value");

					if(date == "2016"){
						dataref = "KNMI_20160231.tsv";
					}else if(date == "2017"){
						dataref = "KNMI_20170231.tsv";
					}else if(date == "2018"){
						dataref = "KNMI_20180231.tsv";
					}else{
						dataref = "KNMI_20160231.tsv";
					}

				d3.tsv(dataref, type, function(error, data) {
				  if (error) throw error;

				  var cities = data.columns.slice(1).map(function(id) {
				    return {
				      id: id,
				      values: data.map(function(d) {
				        return {date: d.date, windspeed: d[id]};
				      })
				    };
				  });

				  x.domain(d3.extent(data, function(d) { return d.date; }));

				  y.domain([
				    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.windspeed; }); }),
				    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.windspeed; }); })
				  ]);

				  z.domain(cities.map(function(c) { return c.id; }));

				  var svg = d3.select("body").append("svg")
      					.attr("width", width + margin.left + margin.right)
      					.attr("height", height + margin.top + margin.bottom)
    				.append("g")
      					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				  g.append("g")
				      .attr("class", "axis axis--x")
				      .attr("transform", "translate(0," + height + ")")
				      .call(d3.axisBottom(x));

				  g.append("g")
				      .attr("class", "axis axis--y")
				      .call(d3.axisLeft(y))
				    .append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", "0.71em")
				      .attr("fill", "#000")
				      .text("Windspeed, 0.1 m/s");

				  var city = g.selectAll(".city")
				    .data(cities)
				    .enter().append("g")
				      .attr("class", "city");

				  city.append("path")
				      .attr("class", "line")
				      .attr("d", function(d) { return line(d.values); })
				      .style("stroke", function(d) { return z(d.id); });

				  city.append("text")
				      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
				      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.windspeed) + ")"; })
				      .attr("x", 3)
				      .attr("dy", "0.35em")
				      .style("font", "10px sans-serif")
				      .text(function(d) { return d.id; });
				});
			});

function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

};