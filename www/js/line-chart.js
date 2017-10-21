function LineChart(elementId) {
	var svg = d3.select('#' + elementId),
		margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = +svg.attr('width') - margin.left - margin.right,
		height = +svg.attr('height') - margin.top - margin.bottom,
		g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var sine = [];
	for (var i = 0; i != 100; ++i) {
		var x = Math.PI * i / 100;
		sine.push({x: x, y: Math.sin(x) * 3 });
	}

	g.append('defs').append('svg:clipPath')
		.attr('id', 'clip')
		.append('svg:rect')
		.attr('id', 'clip-rect')
		.attr('x', 0)
		.attr('y', -10)
		.attr('width', width)
		.attr('height', height + 10);

	var xAxis, yAxis, data;

	var scaleX = d3.scaleLinear().range([0, width]);
	var scaleY = d3.scaleLinear().range([height, 0]);

	scaleX.domain([0, Math.PI]);
	scaleY.domain([0, 4]);

	var line = d3.line().x(function (d) { return scaleX(d.x); }).y(function (d) { return scaleY(d.y); });

	var svg_xAxis = g.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(scaleX));
	
		svg_xAxis.append('text')
		.attr('class', 'axis-lbl')
		.attr('y', -6)
		.attr('x', width)
		.attr('text-anchor', 'end')
		.text('x');
	
	var svg_yAxis = g.append('g')
		.call(d3.axisLeft(scaleY))
		.append('text')
		.attr('class', 'axis-lbl')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('y');
	
	var svg_clipped = g.append('g')
		.attr('clip-path', 'url(#clip)');

	var svg_path = svg_clipped.append('path')
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-width', 2);

	var svg_sine = svg_clipped.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#aaa')
		.attr('stroke-width', 1.5)
		.datum(sine)
		.attr('d', line);

	var onzoom = function () {
		var t = d3.event.transform;
		
		var range = Math.PI / t.k;

		var start = -t.x / (width * t.k) * Math.PI;

		var end = start + range;

		console.log(t.x);

		scaleX.domain([start, end]);
		svg_xAxis.call(d3.axisBottom(scaleX)); // update axis
		svg_path.attr('d', line); // update graph
		svg_sine.attr('d', line); // update sine watermark
	}
	var zoom = d3.zoom().scaleExtent([1, 4]).translateExtent([[0, 0], [+svg.attr('width'), 0]]).on('zoom', onzoom);

	svg.call(zoom);

	this.update = function (data) {
		svg_path.datum(data);
		svg_path.attr('d', line);		
	};
}

function DevelopmentChart(elementId) {
	var svg = d3.select('#' + elementId),
		margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = +svg.attr('width') - margin.left - margin.right,
		height = +svg.attr('height') - margin.top - margin.bottom,
		g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var xAxis, yAxis, data = [];

	var scaleX = d3.scaleLinear().range([0, width]);
	var scaleY = d3.scaleLinear().range([height, 0]);

	var line = d3.line().x(function (d) { return scaleX(d.x); }).y(function (d) { return scaleY(d.y); });

	var svg_xAxis = g.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(scaleX));
	
	svg_xAxis.append('text')
		.attr('class', 'axis-lbl')
		.attr('y', -6)
		.attr('x', width)
		.attr('text-anchor', 'end')
		.text('iterations');
	
	var svg_yAxis = g.append('g')
		.call(d3.axisLeft(scaleY));

	svg_yAxis.append('text')
		.attr('class', 'axis-lbl')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('loss');
	
	var svg_path = g.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#FF4333')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-width', 2);

	this.addData = function (x, y) {
		data.push({x: x, y: y});

		if (data.length > 1) {
			scaleX.domain(d3.extent(data, function(d) { return d.x; }));

			var yMax = d3.extent(data, function(d) { return d.y; })[1];
			scaleY.domain([0, yMax]);

			svg_xAxis.call(d3.axisBottom(scaleX));
			svg_yAxis.call(d3.axisLeft(scaleY));

			svg_path.datum(data);
			svg_path.attr('d', line);
		}			
	};
	this.clearData = function() {
		data.length = 0;

	}
}