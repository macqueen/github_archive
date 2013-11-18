var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select('.container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var format = d3.time.format("%Y-%m");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(format.parse(d.month)); })
    .y(function(d) { return y(d.repo_count); });

d3.tsv('./repos_lang_month_clean.csv', function(error, data){
  color.domain(d3.keys(data[0]).filter(function(key) {
    return key !== 'month_created';
  }));

  var languages = color.domain().map(function(name){
    return {
      name: name,
      values: data.map(function(d){
        return {month: d.month_created, repo_count: +d[name]};
      })
    }
  });

  console.log(languages);

  x.domain(d3.extent(data, function(d) { return format.parse(d.month_created); }));

  y.domain([
    d3.min(languages, function(c) { return d3.min(c.values, function(v) { return v.repo_count; }); }),
    d3.max(languages, function(c) { return d3.max(c.values, function(v) { return v.repo_count; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of repos");

  var language = svg.selectAll(".language")
      .data(languages)
    .enter().append("g")
      .attr("class", "language");

  language.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        console.log(d);
        return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

});
