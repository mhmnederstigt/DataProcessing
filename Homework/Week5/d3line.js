// Milou Nederstigt -  2018-03-09 - D3 Line Chart
// example taken from: https://bl.ocks.org/mbostock/3884955
// and https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

window.onload = function() {
	// specify some variables
	var parseTime = d3.timeParse("%Y%m%d");
	var googleColors =  ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

	// tell how the graph should be drawn
	function draw(data) {

		var svg = d3.select("svg")
		svg.selectAll("*").remove();

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
    	
    				
		//reorganize data structure
		var cats = [];
		for (i = 0, len = 4; i < len; i++) { 
			var key = d3.keys(data)[i];
				
			if (key != "date") {
				cats.push({"id": key, "values": []})
				for (j = 0,  n = data[key].length; j < n; j++) {
					cats[i - 1].values.push({"date":data["date"][j], "windspeed": data[key][j]})
				}
			}
		}

		x.domain(d3.extent(data.date));

		y.domain([
				    d3.min(cats, function(c) { return d3.min(c.values, function(d) { return d.windspeed; }); }),
				    d3.max(cats, function(c) { return d3.max(c.values, function(d) { return d.windspeed; }); })
				  ]);

		z.domain(cats.map(function(c) { return c.id; }));

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

		var cat = g.selectAll(".cat")
		.data(cats)
		.enter().append("g")
		  .attr("class", "cat");

		cat.append("path")
		  .attr("class", "line")
		  .attr("d", function(d) { return line(d.values); })
		  .style("stroke", function(d) { return z(d.id); });

		
		cat.append("text")
		  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		  .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.windspeed) + ")"; })
		  .attr("x", 3)
		  .attr("dy", "0.35em")
		  .style("font", "10px sans-serif")
		  .text(function(d) { return d.id; });
		
// start

var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0"); // initially invisible
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(cats)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });
          
        d3.selectAll(".mouse-per-line") // here it goes wrong
          .attr("transform", function(d, i) {
            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right; // dichtsbijzijnde datapunt (Date)
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){  // use condition, if found data point stop searching
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });

})

// how it should be done
// 4 lines, plus circles, opacity 0, on mousemove, make visible, mousemove --> determine location
// rect moet over álles, ook crosshair lijnen


//end
		};
				      

	// tell what to do if data is loaded
	function analyze(error, data2016, data2017, data2018) {
		if (error) throw error;

		// convert strings to date and numbers
		data2016 = convertType(data2016)
  		data2017 = convertType(data2017)
  		data2018 = convertType(data2018)

		//in not clicked, draw first dataset
		draw(data2016)

		//else draw selected data
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
				
				draw(data)
		});

		function convertType(data) {

		for (i = 0, len = data['date'].length; i < len; i++) { 
    		data['date'][i] = parseTime(data['date'][i]);
    		data['average'][i] = Number(data['average'][i]);
    		data['maximum'][i] = Number(data['maximum'][i]);
    		data['minimum'][i] = Number(data['minimum'][i]);
    	}

    	return data
		}
    };

    //load data
    d3.queue()
		.defer(d3.json, "KNMI_20160231_dl.json")
		.defer(d3.json, "KNMI_20170231_dl.json")
		.defer(d3.json, "KNMI_20180231_dl.json")
		.await(analyze);

};    
    

    
