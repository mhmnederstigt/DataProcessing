window.onload = function() {

  d3.json("KNMI_20180217.json", function(data) {
    console.log(data);
  });

};