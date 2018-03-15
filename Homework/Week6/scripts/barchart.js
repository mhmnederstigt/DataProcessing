/*
Draws barchart in barchartContainer
Name: Milou Nederstigt
Student number: 11022914// 
Inspired by: http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8
*/

window.onload = function() {

    // define area (is it better to define svg size in html, if so, how?)
    var margin = {top: 50, right: 100, bottom: 30, left: 100},
        width  = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // determine which of the variable you'd like to plot
    // + create  a data array that is available throughout the script
        var variablesPlotted = ["hungerIndex", "footprint", "wellbeing"];
        var arrayPerCountry = {};

    // Load data and arrange into one array per country
    d3.csv("linkedGraphData.csv", function(error, data) {

        console.log(data)

        //console.log(Object.keys(data[0]))
        data.forEach(function(d) {
            var country = d.country;
            arrayPerCountry[country] = [];

                // format data: {"country": "belgium", "FG": "124", "FHX": "160", "FHN": "70"}
            variablesPlotted.forEach(function(field) {
                arrayPerCountry[country].push( +d[field] );
            });
        });

        barplot(arrayPerCountry);
    });

    var barplot = function(data) {

        // Make x scale
        var xScale = d3.scale.ordinal()
            .domain(variablesPlotted)
            .rangeRoundBands([0, width], 0.1);

        // Make y scale, the domain will be defined on bar update
        var yScale = d3.scale.linear()
            .range([height, 0]);

        // Create canvas
        var canvas = d3.select(".barchartContainer")
            .append("svg")
            .attr("width",  width  + margin.left + margin.right)
            .attr("height", height + margin.top  + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Make x-axis and add to canvas
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Make y-axis and add to canvas
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var yAxisHandleForUpdate = canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        yAxisHandleForUpdate.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");

        var updateBars = function(data) {
            // First update the y-axis domain to match data
            yScale.domain( d3.extent(data) );
            yAxisHandleForUpdate.call(yAxis);

            var bars = canvas.selectAll(".bar").data(data);

            // Add bars for new data
            bars.enter()
              .append("rect")
                .attr("class", "bar")
                .attr("x", function(d,i) { return xScale( variablesPlotted[i] ); })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d,i) { return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });

            // Update old ones, already have x / width from before
            bars
                .transition().duration(250)
                .attr("y", function(d,i) { return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });

            // Remove old ones
            bars.exit().remove();
        };
    
        // Get names of countrys, for dropdown
        console.log(arrayPerCountry)
        var countrys = Object.keys(arrayPerCountry).sort();
        console.log(countrys)

        // Handler for dropdown value change
        var dropdownChange = function() {
            var newcountry = d3.select(this).property('value')
            console.log(newcountry)
            var newData   = arrayPerCountry[newcountry];

            updateBars(newData);
        };

        var dropdown = d3.select(".barchartContainer")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(countrys)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) {
                return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
            });

        var initialData = arrayPerCountry[ countrys[0] ];
        updateBars(initialData);
 
        };

    };