function LineChart(elementId) {
	var svg = d3.select('#' + elementId),
		margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = +svg.attr('width') - margin.left - margin.right,
		height = +svg.attr('height') - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var sine = [];
	for (var i = 0; i != 100; ++i) {
		var x = Math.PI * i / 100;
		sine.push({x: x, y: Math.sin(x) * 3 });
	}

	g.append("defs").append("svg:clipPath")
		.attr("id", "clip")
		.append("svg:rect")
		.attr("id", "clip-rect")
		.attr("x", 0)
		.attr("y", -10)
		.attr("width", width)
		.attr("height", height + 10);

	var xAxis, yAxis, data;

	var scaleX = d3.scaleLinear().range([0, width]);
	var scaleY = d3.scaleLinear().range([height, 0]);

	scaleX.domain([0, Math.PI]);
	scaleY.domain([0, 3]);

	var line = d3.line().x(function (d) { return scaleX(d.x); }).y(function (d) { return scaleY(d.y); });

	var svg_xAxis = g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(scaleX))
		.append("text")
		.attr('class', 'axis-lbl')
		.attr('y', -6)
		.attr('x', width)
		.attr('text-anchor', 'end')
		.text('x')
	var svg_yAxis = g.append("g")
		.call(d3.axisLeft(scaleY))
		.append("text")
		.attr('class', 'axis-lbl')
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("y");
	
	var svg_path = g.append("g")
		.attr("clip-path", "url(#clip)")
		.append('path')
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-width", 2);

	var svg_sine = g.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#aaa')
		.attr('stroke-width', 1.5)
		.datum(sine)
		.attr('d', line);

	var onzoom = function () {
		var t = d3.event.transform;
		
		console.log(t);

		svg_xAxis.call(d3.axisBottom(scaleX)); // update axis
		svg_path.attr('d', line); // update graph	
	}
	var zoom = d3.zoom().scaleExtent([1, 10]).translateExtent([[0, 0], [+svg.attr('width'), 0]]).on("zoom", onzoom);

	svg.call(zoom);

	this.update = function (data) {
		svg_path.datum(data);
		svg_path.attr('d', line);		
	};
}