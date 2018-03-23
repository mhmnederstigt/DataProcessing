/*
Milou Nederstigt - 2018-03-21 - Linked Graph
Example taken from:
https://bl.ocks.org/bricedev/7952923003a8cf0ecb45
*/

window.onload = function () {
  var color = d3.scale.ordinal()
      .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6"]);

  // sizes of both graphs, keep in mind screen size!
  var margin = {top: 20, right: 20, bottom: 30, left: 20}
  var scatterWidth = 700 - margin.left - margin.right
  var scatterHeight = 500 - margin.top - margin.bottom

  var radialWidth = 350
  var radialHeight = 450
  var barHeight = radialHeight / 2 - 80

  var svg = d3.select(".radialbarContainer").append("svg")
      .attr("width", radialWidth)
      .attr("height", radialHeight)
    .append("g")
      .attr("transform", "translate(" + radialWidth/2 + "," + radialHeight/2 + ")")

  // specify which variables from the datasheet should appear in the radial bar graph
  var variablesPlotted = ["hunger", "wellbeing", "renewableEnergy"]

  d3.csv("data/linkedGraphData.csv", function(error, data) {
    // rewrite data for radialbar to format: [{name: "wellbeing", value: "1"}, {name: "footprint", value: "1"}, {name: "ren", value: "1"}] 
    var dataRadialBar = []
    data.forEach(function(d) {
        var country = d.country;
        dataRadialBar[country] = []
        
        var list = []
        variablesPlotted.forEach(function(field) {
            dataRadialBar[country].push({
                name:   field,
                value: +d[field]
            })
        });
    });

    // init radialbar with initData    
    countrys = Object.keys(dataRadialBar)
    initDataradialbar = dataRadialBar[countrys[0]]
    initRadialBar(initDataradialbar)

    // init scatterplot
    function circleSize(population) {
      return (Math.sqrt(population/70000/Math.PI)+0.5)
    }

    function titleDisplay(country) {
      d3.select(".titleBox")
        .html(country)
    }

    var x = d3.scale.log()
        .range([0, scatterWidth])

    var y = d3.scale.linear()
        .range([scatterHeight, 0])

    var color = d3.scale.category10()

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    var svg = d3.select(".scatterContainer").append("svg")
        .attr("width", scatterWidth + margin.left + margin.right)
        .attr("height", scatterHeight + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var tip = d3.tip()
      .attr('class', 'tooltip')
      .offset([-10, 0])
      .style("background",'#BCC5F7')
      .style("padding",'12px')
      .style("border-radius",'12px')
      .html(function(d) {
        return "<strong>" + d.country +"</strong> <span style='color:#3366cc'></br> GDP: " + d.GDPpcap + "</br> Life Exp.: " + d.lifeExp + "</br> Population: " + d.population + "</span>";
      })

    data.forEach(function(d) {
      d.lifeExp = +d.lifeExp;
      d.GDPpcap = +d.GDPpcap;
    });

    //sort from largest to smallest population to make circles accessible for mouse events
    data = data.sort(function(b, a)  {
      return a.population - b.population
    })

    svg.call(tip)

    x.domain(d3.extent(data, function(d) { return d.GDPpcap; })).nice()
    y.domain(d3.extent(data, function(d) { return d.lifeExp; })).nice()

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + scatterHeight + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", scatterWidth)
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
        .attr("r", function(d) { return circleSize(d.population)}) 
        .attr("cx", function(d) { return x(d.GDPpcap); })
        .attr("cy", function(d) { return y(d.lifeExp); })
        .style("fill", function(d) { return color(d.region); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(d){ updateRadialBar(dataRadialBar[d.country]); titleDisplay(d.country)})

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

    legend.append("rect")
        .attr("x", scatterWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)

    legend.append("text")
        .attr("x", scatterWidth - 30)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; })

      var minPop = Math.round(d3.min(data, function(d) { return d.population}) *5/10000000)*10000000
      var maxPop = Math.round(d3.max(data, function(d) { return d.population}) *30/10000000)*10000000
      var middlePop = Math.round(maxPop * 5/9/10000000)*10000000

      var legendPop = svg.selectAll(".legendPop")
          //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }); width-50, height-50 ??
          .data([minPop, middlePop, maxPop])
        .enter().append("g")
          .attr("class", "legend")
          
      legendPop.append("circle")
          .attr("cx", scatterWidth - 45)
          .attr("cy", function(d) {return scatterHeight - 2 * margin.top -circleSize(d); }) 
          .attr("r", function(d) {return circleSize(d)})
          .style("fill", "none")
          .style("stroke", "grey")
          .style("stroke-width", "1")

      legendPop.append("text")
          .attr("x", scatterWidth - 70)
          .attr("dy", function(d) {return scatterHeight - 2 * margin.top}) 
          .style("text-anchor", "end")
          .text("Population")

      legendPop.append("text")
          .attr("x", scatterWidth - 60)
          .attr("dy", function(d) {return scatterHeight - 2 * margin.top-2*circleSize(d) - 2}) 
          .style("text-anchor", "end")
          .text(function(d) { return d3.format(",")(d) })

      legendPop.append("line") 
        .attr("class", "line")
        .style("stroke", "grey")
        .attr("x1", scatterWidth - 130) 
        .attr("x2", scatterWidth - 45)
        .attr("y1", function(d) {return scatterHeight - 2 * margin.top-2*circleSize(d); })
        .attr("y2", function(d) {return scatterHeight - 2 * margin.top-2*circleSize(d); })
        .style("stroke-width", "1px")
  });
            
function initRadialBar(data){
// right data format: [{name: "variable1", value: "1"}, {name: "variable2", value: "1"}, {name: "variable3", value: "1"}] 
    var barScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, barHeight])

    var keys = data.map(function(d,i) { return d.name; })
    var numBars = keys.length

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, -barHeight])

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(5)
  
    var circles = svg.selectAll("circle")
        .data(x.ticks(5))
      .enter().append("circle")
        .attr("r", function(d) {return barScale(d);})
        .attr("class", "inner")
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px")

    var arc = d3.svg.arc()

    var segments = svg.selectAll("path")
        .data(data)
      .enter().append("path")
        .each(function(d,i) { 
          d.innerRadius = 0;
          d.outerRadius = barScale(d.value); 
          d.startAngle = (i * 2 * Math.PI) / numBars;
          d.endAngle = ((i + 1) * 2 * Math.PI) / numBars
      })
      .style("fill", function (d) { return color(d.name)})
      .style("opacity", 0.5)
      .attr("d", arc)

    svg.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width","1.5px")

    var lines = svg.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "black")
        .style("stroke-width",".5px")
        .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; })

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)

   updateRadialBar(data)
  };

  function updateRadialBar(data){
    var barScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, barHeight])

    var keys = data.map(function(d,i) { return d.name; })
    var numBars = keys.length

    var arc = d3.svg.arc()

    // check for empty entry when updating graph
    function checkEntry(value) { 
      if (value > 0) {
        return barScale(+value)
      }
      else {
        return Number("130")
      }
    }

    function checkColor(d) { 
      if (d.value > 0) {
          return color(d.name)
        }
        else {
          return "#000000"}
    }

    var segments = svg.selectAll("path")  
        .data(data)
        .each(function(d,i) { 
          d.innerRadius = 0;
          d.outerRadius = checkEntry(d.value); 
          d.startAngle = (i * 2 * Math.PI) / numBars;
          d.endAngle = ((i + 1) * 2 * Math.PI) / numBars;
      })
      .style("fill", function (d) { return checkColor(d); })
      .attr("d", arc)

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, -barHeight]);

    var circles = svg.selectAll(".inner").data(x.ticks(5));

    circles
        .attr("r", function(d) {return barScale(d);})
        .enter()
            .append("circle")
            .attr("class", "inner")
            .attr("r", function(d) {return barScale(d);})
            .attr("class", "inner")
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-dasharray", "2,2")
            .style("stroke-width",".5px")

    circles.exit().remove()
  
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([0, -barHeight])

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(5)

    svg.select(".x.axis").transition()
        .call(xAxis)

    var labelRadius = barHeight * 1.025

    d3.select(".labels").remove()

    var labels = svg.append("g")
        .classed("labels", true)

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
        .text(function(d) {return d.name.toUpperCase(); })

    d3.select("input").on("change", radialChange)

    //sort in ascending order
    function radialChange() {
        if (this.checked) {
            labels.selectAll(".textpath").sort(function(a,b) { return b.value - a.value; });
            segments.sort(function(a,b) { return b.value - a.value; });

        }else {
            labels.selectAll(".textpath").sort(function(a,b) { return d3.ascending(a.name, b.name) });
            segments.sort(function(a,b) { return d3.ascending(a.name, b.name); })
        } 

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