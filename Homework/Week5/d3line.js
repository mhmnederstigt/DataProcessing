window.onload = function() {

  d3.json("KNMI_20180231.json", function(data) {
    console.log("Dictionary with lists:");
    console.log(data);
  });

  d3.json("KNMI_20170231.json", function(data) {
    console.log("List with dictionaries:");
    console.log(data);
  });

  console.log("Consequent years in data folder")

};