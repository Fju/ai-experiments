var layer_defs = [];
layer_defs.push({type:'input', out_sx: 1, out_sy: 1, out_depth: 1 });
layer_defs.push({type:'fc', num_neurons: 20, activation: 'relu' });
layer_defs.push({type:'fc', num_neurons:20, activation: 'sigmoid'})
layer_defs.push({type:'regression', num_neurons: 1});

var net = new convnetjs.Net();
net.makeLayers(layer_defs);

function f(x) {
	return 3*Math.sin(x);
}

function train(iters) {
	var trainer = new convnetjs.SGDTrainer(net, {learning_rate: 0.02, momentum:0.0, batch_size:1, l2_decay:0.001})

	var netx = new convnetjs.Vol(1,1,1), x, y, avloss = 0.0;
	for (var k = 0; k < iters; ++k) {
		for (var i = 0; i != 50; ++i) {
			x = Math.PI * i / 50;
			netx.w[0] = x;
			var stats = trainer.train(netx, [f(x)]);
			//console.log(stats);
			avloss += stats.loss;
		}
	}	
	avloss /= 50*iters;
	
	// generate data for line chart
	var data = [];
	for (var i = 0; i != 100; ++i) {
		x = Math.PI * i / 100; // 0 to Pi
		netx.w[0] = x;
		y = net.forward(netx).w[0];
		data.push({x: x, y: y});
	}
	lineChart.update(data);

	return avloss;
}

function test(x) {
	var netx = new convnetjs.Vol(1,1,1);
	netx.w[0] = x;

	var y0 = net.forward(netx).w[0], y1 = f(x);
	console.log('Network: ', y0);
	console.log('Function: ', y1);
	console.log('Error:', Math.abs(y1 - y0));
}

var lineChart = new LineChart('linechart'), developmentChart = new DevelopmentChart('devchart');
var trainingId, iteration = 0;
document.getElementById('train-start').addEventListener('click', function(e) {
	var t = e.target.textContent;
	if (t === 'Start training') {
		e.target.textContent = 'Stop training';

		trainingId = setInterval(function() {
			var loss = train(5);
			iteration += 5
			developmentChart.addData(iteration, loss);
		}, 250);
	} else {
		e.target.textContent = 'Start training';
		clearInterval(trainingId);
	}
});