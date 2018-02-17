/**
 * Homework Week 2 - Milou Nederstigt - 20180216 
 */

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

/**
 * Calculates an appropriate range for the tick marks given an array with data and an apprioximation of the amount of tick marks 
 * Taken from: 
 */
function roundedTickRange(arraydata, tickCount){
    var range = Math.max(...arraydata)-Math.min(...arraydata);
    var unroundedTickSize = range/(tickCount-1);
    var x = Math.ceil(Math.log10(unroundedTickSize)-1);
    var pow10x = Math.pow(10, x);
    var roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;

    return roundedTickRange;
}

/**
 * Inserts `what` to string at position `index`.
 * Taken from: https://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
 */
String.prototype.insert = function (index, string) {
  var ind = index < 0 ? this.length + index  :  index;
  return  this.substring(0, ind) + string + this.substring(ind, this.length)
};

/**
 * Main
 */
// initialize data
window.onload  = function() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "KNMI_data_2017.csv", true)
    xhttp.send()


    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           document.getElementById("rawdata").innerHTML = xhttp.responseText;
        }
    }
   
    var data = document.getElementById("rawdata").textContent.split("\n")
    arrayX = []
    arrayID = []
    arrayY = []

    //SET layout variables
    width = 800
    height = 400
    padding = 200
    tickCountX = 12
    tickCountY = 11
    unitX = "month"
    unitY = "temp (C)"
    title = "Average temperature in 'de Bilt' - 2017"

    // split the data into columns and change to appropriate object type 
    for (var i = 0; i < data.length-1; i++) {
        data[i] = data[i].split(",")
        data[i][0] = data[i][0].insert(4, '-')
        data[i][0] = data[i][0].insert(7, '-')
        arrayX[i] = new Date(data[i][0])
    	arrayY[i] = Number(data[i][1])/10
    	arrayID[i] = i
    }

    // create functions that convert absolute data to a position on the canvas
    convX = createTransform([Math.min(...arrayID), Math.max(...arrayID)], [0, width])
    convY = createTransform([Math.min(...arrayY), Math.max(...arrayY)], [0, height])

    //
    // Draw the line graph
    //

    // set up canvas
    var canvas = document.getElementById('linegraph') 
    var ctx = canvas.getContext('2d')
    ctx.translate(padding,height+padding)

    // draw a container
    ctx.fillStyle = 'rgb(242,210,142)' 
    ctx.fillRect(-padding, padding, width+2*padding, -(height+2*padding)) 

    // draw title
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.textAlign="center"
    ctx.font = "20px Arial"
    ctx.fillText(title, width/2, -height-padding/2)
    ctx.font = "12px Arial"

    // draw line graph
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(convX(arrayID[0]), -convY(arrayY[0]))
    for (var i = 1; i < arrayID.length-1; i++){
        ctx.lineTo(convX(arrayID[i]), -convY(arrayY[i]))
        ctx.stroke()
    }

    // draw axes
        // y
        tickRangeY = roundedTickRange(arrayY, tickCountY)
        tickNumbersY = Math.ceil((Math.max(...arrayY)-Math.min(...arrayY))/tickRangeY);  // this is an update of TickCount with the actual amount of ticks that will be displayed
        tickNumberUnderAxis = tickNumbersY - (Math.ceil((Math.max(...arrayY))/tickRangeY))
        beginAxis = -convY(-tickNumberUnderAxis*tickRangeY)
        tickNumbersAboveAxis = Math.ceil((Math.max(...arrayY))/tickRangeY)
        endAxis = -convY(tickNumbersAboveAxis*tickRangeY)

        ctx.beginPath();
        ctx.moveTo(-10,beginAxis)
        ctx.lineTo(-10, endAxis)
        ctx.stroke();

        ctx.save()
        ctx.rotate(3 * Math.PI / 2)
        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.textAlign = "right" 
        ctx.fillText(unitY, height, -60)
        ctx.restore()

        // x
        tickRangeX = 30
        tickNumbersX = Math.ceil((Math.max(...arrayID)-Math.min(...arrayID))/tickRangeX); // this is an update of TickCount with the actual amount of ticks that will be displayed
        posaxisx = -convY(-tickNumberUnderAxis*tickRangeY)
        ctx.beginPath()
        ctx.moveTo(0,posaxisx)
        ctx.lineTo(convX(tickNumbersX*tickRangeX),posaxisx)
        ctx.stroke()

        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.textAlign = "right" 
        ctx.fillText(unitX, convX(tickNumbersX*tickRangeX), 90)

        // 0 
        ctx.beginPath()
        ctx.setLineDash([5, 15])
        ctx.moveTo(0,0)
        ctx.lineTo(convX(tickNumbersX*tickRangeX),0)
        ctx.stroke()


    // x-axis tick marks and labels
    
    // needed for date conversion
    month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    right = tickRangeX;

    ctx.moveTo(0, posaxisx);
    ctx.lineTo(0, posaxisx+5);

    for (var i = 1; i <= tickNumbersX-1; i++) {
        ctx.moveTo(convX(right), posaxisx);
        ctx.lineTo(convX(right), posaxisx+5);
        
        // draw labels
        ctx.save();
        ctx.rotate(3 * Math.PI / 2);
        ctx.fillStyle = 'rgb(0,0,0)'; 
        ctx.textAlign = "right";
        ctx.fillText(month[arrayX[right].getMonth()], -posaxisx-20, convX(right)-convX(tickRangeX/2)); // x and y coordinates are reversed since the reference point changed position
        ctx.restore();

        right += tickRangeX; 
        ctx.stroke();
    }

    ctx.moveTo(convX(tickNumbersX*tickRangeX), posaxisx);
    ctx.lineTo(convX(tickNumbersX*tickRangeX), posaxisx+5);

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

}