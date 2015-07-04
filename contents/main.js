d3 = require('d3')

d3.csv('/data/data.csv', function(d) {


	var n = 40,
	    random = d3.random.normal(0, .2);

	var keys = d3.keys(d[0])

	var ts = keys.map(function(name) {
	    return {
	      name: name,
	      values: d.map(function(d) {
	        return +d[name] + random()*20;
	      })
	    };
  	});

  	ts = [ts[0], ts[1], ts[2], ts[3], ts[4]]

  	ts.forEach(function(d, i) {d.values = d.values.map(function(e) {return e + i*82})})

	var margin = {top: 0, right: 0, bottom: 30, left: 40},
	    width = 300 - margin.left - margin.right,
	    height = 355 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .domain([0, n - 1])
	    .range([0, width]);

	var y = d3.scale.linear()
	    .domain([-10, 500])
	    .range([height, 0]);

	var line = d3.svg.line()
	    .x(function(d, i) { return x(i); })
	    .y(function(d, i) { return y(d); });

	var svg = d3.select("#viz").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .style("border-right", "dotted 1px")
	    .style("margin-top", "62px")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height)

	var path = []
	ts.forEach(function(d, i) {
		var subpath = svg.append("g")
		    .attr("clip-path", "url(#clip)")
		  .append("path")
		    .datum(d.values)
		    .attr("class", "line")
		    .attr("fill", "none")
		    .attr("stroke", "black")
		    .attr("stroke-width", 2.5)
		    .attr("d", line);
		path.push(subpath)
	})
	
	var counter = n;

	tick();

	var max = ts[0].values.length

	function tick() {

	  // push a new data point onto the back
	  ts.forEach(function(d, i) {
	  	d.values.push(ts[i].values[counter])
	  })

	  // redraw the line, and slide it to the left
	  path.forEach(function(d) {
	  	d
	      .attr("d", line)
	      .attr("transform", null)
	  })

	  d3.selectAll('.line')
		  .transition()
		      .duration(600)
		      .ease("linear")
		      .attr("transform", "translate(" + x(-5) + ",0)")
		      .each("end", tick);

	  ts.forEach(function(d) {
	  	d.values.shift()
	  })
	  
	  counter++

	  if (counter == max) {
	   	counter = n
	  }

	}

})