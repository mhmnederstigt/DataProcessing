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

//retrieve data
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
title = "Average temperature in the Bilt"

// split the data into columns and change to appropriate object type 
for (var i = 0; i < data.length-1; i++) {
    data[i] = data[i].split(",");
    array_x[i] = new Date(Number(data[i][0]));
	array_y[i] = Number(data[i][1])/10;
	array_id[i] = i;
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
ctx.fillStyle = 'rgb(211,211,211)'; 
ctx.fillRect(-100, 100, width+200, -(height+200)); 
// draw the outline of the plot area
ctx.fillStyle = 'rgb(211,211,211)'; 
ctx.fillRect(0, 0, width, -height); 

// draw title
ctx.fillStyle = 'rgb(0,0,0)'; 
ctx.textAlign="center";
ctx.font = "20px Arial";
ctx.fillText(title, width/2, -height-40);
ctx.font = "12px Arial";

// draw line graph
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(convX(array_id[0]), -convY(array_y[0]))
for (var i = 1; i < array_id.length-1; i  = i + 4){
    ctx.lineTo(convX(array_id[i]), -convY(array_y[i]))
    ctx.stroke();
}

// draw axes
    // x
TickRangeX = roundedTickRange(array_id, tickCountX)
TickNumbersX = Math.ceil((Math.max(...array_id)-Math.min(...array_id))/TickRangeX); // this is an update of TickCount with the actual amount of ticks that will be displayed
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineWidth = 1;
ctx.lineTo(convX(TickNumbersX*TickRangeX),0);
ctx.stroke();

ctx.fillStyle = 'rgb(0,0,0)';
ctx.textAlign = "right" 
ctx.fillText(unit_X, width, 80);

    // y
TickRangeY = roundedTickRange(array_y, tickCountY);
TickNumbersY = Math.ceil((Math.max(...array_y)-Math.min(...array_y))/TickRangeY);  // this is an update of TickCount with the actual amount of ticks that will be displayed
ctx.beginPath();
ctx.moveTo(0,0);
TickNumbersaboveaxis = Math.ceil((Math.max(...array_y))/TickRangeY);
ctx.lineTo(0, -convY(TickNumbersY*TickRangeY));
ctx.stroke();

ctx.save();
ctx.rotate(3 * Math.PI / 2);
ctx.fillStyle = 'rgb(0,0,0)';
ctx.textAlign = "right" 
ctx.fillText(unit_Y, height, -80);
ctx.restore();


// x-axis tick marks and labels
right = 0;
for (var i = 0; i <= TickNumbersX; i++) {
    ctx.moveTo(convX(right), 0);
    ctx.lineTo(convX(right), 5);
    
    // draw labels
    ctx.save();
    ctx.rotate(3 * Math.PI / 2);
    ctx.fillStyle = 'rgb(0,0,0)'; 
    ctx.textAlign = "left";
    ctx.fillText(right, -40, convX(right));
    ctx.restore();
    
    right = right + TickRangeX; 
    ctx.stroke();
}

// y-axis tick marks and labels
TickNumberUnderAxis = TickNumbersY - (Math.ceil((Math.max(...array_y))/TickRangeY))
up = (TickNumberUnderAxis)*TickRangeY

for (var i = 0; i < TickNumbersY; i++) {
    ctx.moveTo(0, -convY(up));
    ctx.lineTo(-5, -convY(up));
    
    // draw labels
    ctx.fillStyle = 'rgb(0,0,0)'; 
    ctx.textAlign="right";
    ctx.fillText(up, -20 , -convY(up));

    up = up + TickRangeY; 
    ctx.stroke();
}

