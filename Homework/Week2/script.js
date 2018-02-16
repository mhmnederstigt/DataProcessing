function createTransform(domain, range){
    // domain is a two-element array of the data bounds [domain_min, domain_max]
    // range is a two-element array of the screen bounds [range_min, range_max]
    // this gives you two equations to solve:
    // range_min = alpha * domain_min + beta
    // range_max = alpha * domain_max + beta
        // a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

function roundedTickRange(arraydata, tickCount){
    var range = Math.max(...arraydata)-Math.min(...arraydata);
    var unroundedTickSize = range/(tickCount-1);
    var x = Math.ceil(Math.log10(unroundedTickSize)-1);
    var pow10x = Math.pow(10, x);
    var roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;

    return roundedTickRange;
}

/**
 * Insert `what` to string at position `index`.
 * Taken from: https://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
 */
String.prototype.insert = function (index, string) {
  var ind = index < 0 ? this.length + index  :  index;
  return  this.substring(0, ind) + string + this.substring(ind, this.length);
};

// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//        // Typical action to be performed when the document is ready:
//        document.getElementById("rawdata").innerHTML = xhttp.responseText;
//     }
// };
// xhttp.open("GET", "KNMI_data_2016.txt", true);
// xhttp.send();

// initialize data
var data = document.getElementById("rawdata").textContent.split("\n");
array_x = []
array_y = []
array_id = []

//SET Size of graph and ticks
width = 600;
height = 400;
tickCountX = 12;
tickCountY = 11;
unit_X = "day"
unit_Y = "temp (C)"
title = "Average temperature in 'de Bilt'"

// split the data into columns and change to appropriate object type 
for (var i = 0; i < data.length-1; i++) {
    data[i] = data[i].split(",");
    data[i][0] = data[i][0].insert(4, '-');
    data[i][0] = data[i][0].insert(7, '-');
    array_x[i] = new Date(data[i][0]);
	array_y[i] = Number(data[i][1])/10;
	array_id[i] = i;
    console.log(array_x[i])
}

// Create functions that convert absolute data to a position on the canvas
convX = createTransform([Math.min(...array_id), Math.max(...array_id)], [0, width]);
convY = createTransform([Math.min(...array_y), Math.max(...array_y)], [0, height]);

//
// Draw the line graph
//

// set up canvas
var canvas = document.getElementById('linegraph'); 
var ctx = canvas.getContext('2d');
ctx.translate(100,height+100)

// draw a container
ctx.fillStyle = 'rgb(105,151,244)'; 
ctx.fillRect(-100, 100, width+200, -(height+200)); 
// // draw the outline of the plot area
// ctx.fillStyle = 'rgb(105,151,244)'; 
// ctx.fillRect(0, 0, width, -height); 

// draw title
ctx.fillStyle = 'rgb(0,0,0)'; 
ctx.textAlign="center";
ctx.font = "20px Arial";
ctx.fillText(title, width/2, -height-40);
ctx.font = "12px Arial";

// draw line graph
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(convX(array_id[0]), -convY(array_y[0]))
for (var i = 1; i < array_id.length-1; i  = i + 4){
    ctx.lineTo(convX(array_id[i]), -convY(array_y[i]))
    ctx.stroke();
}

// draw axes
    // y
    tickRangeY = roundedTickRange(array_y, tickCountY);
    tickNumbersY = Math.ceil((Math.max(...array_y)-Math.min(...array_y))/tickRangeY);  // this is an update of TickCount with the actual amount of ticks that will be displayed
    tickNumberUnderAxis = tickNumbersY - (Math.ceil((Math.max(...array_y))/tickRangeY))

    ctx.beginPath();
    ctx.moveTo(-10,-convY(-tickNumberUnderAxis*tickRangeY));
    tickNumbersAboveAxis = Math.ceil((Math.max(...array_y))/tickRangeY);
    ctx.lineTo(-10, -convY(tickNumbersAboveAxis*tickRangeY));
    ctx.stroke();

    ctx.save();
    ctx.rotate(3 * Math.PI / 2);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.textAlign = "right" 
    ctx.fillText(unit_Y, height, -60);
    ctx.restore();


    // x
    tickRangeX = roundedTickRange(array_id, tickCountX)
    tickNumbersX = Math.ceil((Math.max(...array_id)-Math.min(...array_id))/tickRangeX); // this is an update of TickCount with the actual amount of ticks that will be displayed
    posaxisx = -convY(-tickNumberUnderAxis*tickRangeY);
    ctx.beginPath();
    ctx.moveTo(0,posaxisx);
    ctx.lineTo(convX(tickNumbersX*tickRangeX),posaxisx);
    ctx.stroke();

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.textAlign = "right" 
    ctx.fillText(unit_X, width, 90);

    // 0 
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(0,0);
    ctx.lineTo(convX(tickNumbersX*tickRangeX),0);
    ctx.stroke();


// x-axis tick marks and labels
// needed for date conversion
var month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

right = 0;
for (var i = 0; i <= tickNumbersX; i++) {
    ctx.moveTo(convX(right), posaxisx);
    ctx.lineTo(convX(right), posaxisx+5);
    
    // draw labels
    ctx.save();
    ctx.rotate(3 * Math.PI / 2);
    ctx.fillStyle = 'rgb(0,0,0)'; 
    ctx.textAlign = "left";
    ctx.fillText(right, -posaxisx-40, convX(right)); // x and y coordinates are reversed since the reference point changed position
    ctx.restore();

    //month[array_x[right].getMonth()]
    
    right += tickRangeX; 
    ctx.stroke();
}

// y-axis tick marks and labels
up = -(tickNumberUnderAxis)*tickRangeY

for (var i = 0; i <= tickNumbersY; i++) {
    ctx.moveTo(-10, -convY(up));
    ctx.lineTo(-15, -convY(up));
    
    // draw labels
    ctx.fillStyle = 'rgb(0,0,0)'; 
    ctx.textAlign="right";
    ctx.fillText(up, -20 , -convY(up));

    up += tickRangeY; 
    ctx.stroke();
}

