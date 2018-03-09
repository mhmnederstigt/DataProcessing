window.onload = function() {

	d3.queue()
		.defer(d3.tsv, "KNMI_20180231.tsv")
		.defer(d3.tsv, "KNMI_20170231.tsv")
		.await(analyze);

	function analyze(error, cities, animals) {
		if (error) { console.log(error);}
		
			d3.selectAll(".m")
				.on("click", function() {
					var version = this.getAttribute("value");

					if(version == "2016"){
						data = animals;
					}else if(version == "2017"){
						data = cities;
					}else if(version == "2018"){
						data = animals;
					}else{
						data = "KNMI_20160231.tsv";
					}

		var svg = d3.select("svg"),
	    margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = svg.attr("width") - margin.left - margin.right,
	    height = svg.attr("height") - margin.top - margin.bottom,
	    data = animals, 
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

				svg.selectAll("*").remove();
				svg.selectAll()
	
				g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

				  g.append("g")
				      .attr("class", "axis axis--x")
				      .attr("transform", "translate(0," + height + ")")
				      .call(d3.axisBottom(x));

				  g.append("g")
				      .attr("class", "axis axis--y")
				      .call(d3.axisLeft(y))
				    .append("text")
				      .attr("x", 100)
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

			

}
function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

};