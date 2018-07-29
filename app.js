// creating svgs
var svgWidth = 960;
var svgHeight = 600;

//adding margins
var margin = { top: 20, right: 40, bottom: 80, left: 100 };


//creating chart width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//appending svg to chart class
var svg = d3.select('.chart')
  .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
  //this is g for creating axes
  .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//appending grouping element g to svg
var chart = svg.append('g');


//appending tooltip to chart
d3.select('.chart')
	.append('div')
	    .attr('class', 'tooltip')
	    .style('opacity', 0);



//requesting the data from csv
d3.csv("stateData.csv", function(err, stateData) {

if (err) throw err;

  stateData.forEach(function(data) {

    console.log(stateData);

    //changing string data to float
    data.unemployment_rate = +data.unemployment_rate;
    data.binge_drinker = +data.binge_drinker;
});


// Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMax;

  // This function identifies the minimum and maximum values in a column in hairData.csv
  // and assign them to xMin and xMax variables, which will define the axis domain
  function findMinAndMax(dataColumnX) {
    xMin = d3.min(stateData, function(data) {
      return +data.binge_drinker * 0.8;
    });

    xMax = d3.max(stateData, function(data) {
      return +data.binge_drinker * 1.1;
    });

    yMax = d3.max(stateData, function(data) {
      return +data.unemployment_rate * 1.1;
    });
  }

  var currentAxisLabelX = "unemployment_rate";

  // Call findMinAndMax() with 'zero employment' as default
  findMinAndMax(currentAxisLabelX);

// Set the domain of an axis to extend from the min to the max value of the data column
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);



 // Initialize tooltip
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    // Define position
    .offset([80, -60])
    // The html() method allows us to mix JavaScript with HTML in the callback function
    .html(function(data) {
      var stateName = data.state;
      var binge_drinker_p = +data.binge_drinker;
      var unemployment_rate_p = data.unemployment_rate;      // Tooltip text depends on which axis is active/has been clicked
      return stateName +
        "<br> %unemployed :" +
        binge_drinker_p +
        "<br> %Binge: " +
        unemployment_rate_p;
    });

  // Create tooltip
  chart.call(toolTip);

chart
    .selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data.binge_drinker);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.unemployment_rate);
    })
    .attr("r", "15")
    .attr("fill", "#ADD8E6")
    // display tooltip on click
    .on("click", function(data) {
      toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

 chart.selectAll("text")
      .data(stateData)
      .enter().append("text")
      .attr("class", "text")
      .attr("x", function(data, index) {
        return xLinearScale(data.binge_drinker);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data.unemployment_rate);
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "11")
      .text(function(data, index) {
        return data.abbr});

// Create and situate your axes and labels to the left and bottom of the chart.

  // Append an SVG group for the x-axis, then display the x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);


  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "unemployment_rate")
    .text("% of people who binge drink");
  // Append y-axis label


  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    // This axis label is active by default
    .attr("class", "axis-text active")
    .attr("data-axis-name", "unemployment_rate")
    .text("% of people unemployed");

   


});



