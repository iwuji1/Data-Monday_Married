//Set margins/ dimensions of chart

var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right
  height = 800 - margin.top - margin.bottom;

//Set the ranges for axes remember vertical bar chart


//append svg object to the viz tag in html
//append a 'group' element to svg
//moves the group to the top left margin

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height+ margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + ","+ margin.top + ")");

//get the data

d3.csv("never_married_clean.csv", function(error, data) {
  if (error) throw error;

  //splitting data by male and female for seperate charts
  var male_dat = data.filter(function(d) {return d.gender === "Men"});

  var female_dat = data.filter(function(d) {return d.gender === "Women"});

  var years = data.columns.slice(2);
  console.log(years);

  var agerange = d3.map(data, function(d) {return(d.age_range)}).keys()
  console.log(agerange)

  //Scale the range of the data in the domains
  var yscale = d3.scaleBand()
                  .domain(agerange)
                  .range([0,height])
                  .padding([0.2]);

  var year_scale = d3.scaleBand()
                  .domain(years)
                  .range([0,yscale.bandwidth()])
                  .padding(0.05);


  var xscale_m = d3.scaleLinear()
                  .range([width/2, 0])
                  .domain([0,1]);

  var xscale_f = d3.scaleLinear()
                  .range([width/2,0])
                  .domain([0,1]);
  var z = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(years);

  // console.log(male_dat, width, width/2)
  //appending the rectangles for the bar chart for males

  var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style('visibility', 'hidden')
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip.style('visibility', 'visible');
    d3.select(this).transition().style("stroke", "00008B")
  }

  var mousemove = function(d) {
    tooltip
      .html(`<div>Year: ${d.key}</div><div>Percentage never married: ${d.value}</div>`)
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
  }
  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip.html(``).style('visibility', 'hidden');
    d3.select(this).transition().style("stroke-opacity", 0)
  }

  svg.append("g")
    .selectAll("g")
      .data(male_dat)
      .enter()
      .append("g")
        .attr("class","g")
        .attr("transform", function(d) {return "translate( 0," + yscale(d.age_range) + ")";})
        // .text(function(d) {return d.age_range})
      .selectAll("rect")
      .data(function(d) {return years.map(function(key) {return {key:key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) {return xscale_m(d.value);})
        .attr("y", function(d) {return year_scale(d.key);})
        .attr("width", function(d) { return (width/2) - xscale_m(d.value);})
        .attr("height", year_scale.bandwidth)
        .attr("fill", function(d) {return z(d.key)})
      .on("mouseover", function (d,i) {
        tooltip
          .html(`<div>Year: ${d.key}</div><div>Percentage never married: ${Math.round(d.value*100) + "%"}</div>`)
          .style('visibility', 'visible');
          d3.select(this).transition().attr("stroke","#FFFFFF")
                                      .attr("stroke-width", 2+"px");
      })
      .on("mousemove", function() {
        tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on("mouseleave", function() {
        tooltip.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr("stroke","none");
      });

  //appending the rectangles for the bar chart for females

  svg.append("g")
    .selectAll("g")
      .data(female_dat)
      .enter()
      .append("g")
        .attr("class","g")
        .attr("transform", function(d) {return "translate( 0," + yscale(d.age_range) + ")";})
      .selectAll("rect")
      .data(function(d) {return years.map(function(key) {return {key:key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) {return (d.value);})
        .attr("y", function(d) {return year_scale(d.key);})
        .attr("width", function(d) { return (width/2) - xscale_f(d.value);})
        .attr("height", year_scale.bandwidth)
        .attr("fill", function(d) {return z(d.key)})
        .attr("transform", "translate(" + width/2 + ",0)")
        .on("mouseover", function (d,i) {
          tooltip
            .html(`<div>Year: ${d.key}</div><div>Percentage never married: ${Math.round(d.value*100) + "%"}</div>`)
            .style('visibility', 'visible');
            d3.select(this).transition().attr("stroke","#FFFFFF")
                                        .attr("stroke-width", 2+"px");
        })
        .on("mousemove", function() {
          tooltip
              .style('top', d3.event.pageY - 10 + 'px')
              .style('left', d3.event.pageX + 10 + 'px');
        })
        .on("mouseleave", function() {
          tooltip.html(``).style('visibility', 'hidden');
          d3.select(this).transition().attr("stroke","none");
        });

  svg.append("text")
       .attr("transform",
             "translate(" + (width/2) + " ," +
                            (height + margin.top) + ")")
       .style("text-anchor", "middle")
       .text("Percentage Single");

 svg.append("text")
      .attr("transform",
            "translate(10," +
                           (height/2) + "), rotate(-90)")
      .style("text-anchor", "middle")
      .text("Male");

svg.append("text")
     .attr("transform",
           "translate("+ (width - 20) +"," +
                          (height/2) + "), rotate(90)")
     .style("text-anchor", "middle")
     .text("Female");

svg.append("g")
  .attr("class", "central")
  .attr("transform",
        "translate(" + ((width/2)+10) + " ," +(-65)+ ")")
  .style("text-anchor", "middle")
  .call(d3.axisLeft(yscale))


})
