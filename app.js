var svgWidth = 960;
var svgHeight = 600;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.select('.chart')
	.append('div')
	.attr('class', 'tooltip')
	.style('opacity', 0);


d3.csv("data.csv", function(err, combineData) {

if (err) throw err;

  combineData.forEach(function(data) {

    // console.log(combineData);

    data.binge_drinker = +data.binge_drinker;
    data.unemployment_rate = +data.unemployment_rate;
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
    xMin = d3.min(combineData, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(combineData, function(data) {
      return +data[dataColumnX] * 1.1;
    });

    yMax = d3.max(combineData, function(data) {
      return +data.unemployment_rate * 1.1;
    });
  }

  var currentAxisLabelX = "zero employment";

  // Call findMinAndMax() with 'zero employment' as default
  findMinAndMax(currentAxisLabelX);

// Set the domain of an axis to extend from the min to the max value of the data column
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);


chart
    .selectAll("circle")
    .data(combineData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.unemployment_rate);
    })
    .attr("r", "15")
    .attr("fill", "#E75480")
    // display tooltip on click
    .on("click", function(data) {
      toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });


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
    .text("unemployment_rate");
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
    .text("unemplouyed");

   function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      // An alternative to .attr("class", <className>) method. Used to toggle classes.
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
  }

  d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
    var clickedSelection = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    // console.log("this axis is inactive", isClickedSelectionInactive)
    // Grab the data-attribute of the axis and assign it to a variable
    // e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("current axis: ", clickedAxis);

    // The onclick events below take place only if the x-axis is inactive
    // Clicking on an already active axis will therefore do nothing
    if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelX = clickedAxis;
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax(currentAxisLabelX);
      // Set the domain for the x-axis
      xLinearScale.domain([xMin, xMax]);
      // Create a transition effect for the x-axis
      svg
        .select(".x-axis")
        .transition()
        // .ease(d3.easeElastic)
        .duration(1800)
        .call(bottomAxis);
      // Select all circles to create a transition effect, then relocate its horizontal location
      // based on the new axis that was selected/clicked
      d3.selectAll("circle").each(function() {
        d3
          .select(this)
          .transition()
          // .ease(d3.easeBounce)
          .attr("cx", function(data) {
            return xLinearScale(+data[currentAxisLabelX]);
          })
          .duration(1800);
      });

      // Change the status of the axes. See above for more info on this function.
      labelChange(clickedSelection);
    }
  });


});



