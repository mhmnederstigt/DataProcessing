window.onload = function() {
	// specify some variables
	var parseTime = d3.timeParse("%Y%m%d");
	googleColors =  ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
	
	// tell how the graph should be drawn
	function draw(data) {

		console.log("draw:");
		console.log(data)
		console.log(typeof(data['date'][0]));

		//svg.selectAll("*").remove();
		var svg = d3.select("svg"),
    	margin = {top: 20, right: 80, bottom: 30, left: 50},
    	width = svg.attr("width") - margin.left - margin.right,
    	height = svg.attr("height") - margin.top - margin.bottom,
    	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    	var x = d3.scaleTime().range([0, width]),
    		y = d3.scaleLinear().range([height, 0]),
    		z = d3.scaleOrdinal(googleColors)

    	var line = d3.line()
    	.curve(d3.curveBasis)
    	.x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.windspeed); });



    	googleColors =  ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];		   
					
		console.log(data);

	
		var cities = [];

		for (i = 0, len = 3; i < len; i++) { 
			var key = d3.keys(data)[i];
			console.log(key);
			
			if (key != "date") {
				cities.push({"id": key, "values": []})
				for (j = 0,  n = data[key].length; j < n; j++) {
					cities[i - 1].values.push({"date":data["date"][j], "windspeed": data[key][j]})
				}
			}
		}

		console.log(cities)

		x.domain(d3.extent(data.date));

		console.log(d3.extent(data.date))

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
		};
				      


	// tell what to do if data is loaded
	function analyze(error, data2016, data2017, data2018) {
		if (error) throw error;

		// check type before conversion
		console.log("analyze before type-conversion:")
		console.log(data2016)
		console.log(data2016['FG'][0])
		console.log(typeof(data2016['FG'][0]))

		// convert string to right format
  		for (i = 0, len = data2016['date'].length; i < len; i++) { 
    		data2016['date'][i] = parseTime(data2016['date'][i]);
    		data2016['FG'][i] = Number(data2016['FG'][i]);
    		data2016['FHX'][i] = Number(data2016['FHX'][i]);
    		//data2016['FHN'][i] = Number(data2016['FHN'][i]);
  		}
		
		//check type after conversion
		console.log("analyze:")
		console.log(data2016)
		console.log(data2016['FG'][0])
		console.log(typeof(data2016['FG'][0]))

		//in not clicked, draw first dataset
		data = data2016;

		//else:
		d3.selectAll(".m")
			.on("click", function() {
				var version = this.getAttribute("value");
					if(version == "2016"){
						data = data2016;
					}else if(version == "2017"){
						data = data2017;
					}else if(version == "2018"){
						data = data2018;
					}else{
						data = data2016;
					}
		});

		draw(data)

	// end analyze		
    };

    //load data
    d3.queue()
		.defer(d3.json, "KNMI_20160231_dl.json")
		.defer(d3.json, "KNMI_20160231_dl.json")
		.defer(d3.json, "KNMI_20160231_dl.json")
		.await(analyze);

};    
    

    
