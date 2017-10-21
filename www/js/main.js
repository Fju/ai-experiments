
function f(x) {
	return 3*Math.sin(x);
}

var ai = {
	net: null,
	iterations: 0,
	params: {
		learning_rate: 0.01,
		update_frequency: 5,
		min_error: 0.02
	},
	vol: function(w) {
		var netx = new convnetjs.Vol(1,1,1);
		netx.w[0] = w;
		return netx;
	},
	train: function() {
		var trainer = new convnetjs.SGDTrainer(ai.net, {learning_rate: ai.params.learning_rate, momentum: 0.0, batch_size:1, l2_decay:0.001})
		
		var x;
		for (var k = 0; k < ai.params.update_frequency; ++k) {
			for (var i = 0; i != 50; ++i) {
				x = Math.PI * i / 50;
				trainer.train(ai.vol(x), [f(x)]);				
			}
		}
		ai.iterations += ai.params.update_frequency;			
	},
	forward: function() {
		// generate data for line chart
		var data = [], error = 0.0, x, y, fy;
		for (var i = 0; i != 100; ++i) {
			x = Math.PI * i / 100; // 0 to Pi
			y = ai.net.forward(ai.vol(x)).w[0];
			
			error += Math.abs(f(x) - y);

			data.push({x: x, y: y});
		}
		error /= 100; // average

		return {
			error: error,
			data: data
		};
	},
	init: function(params) {
		ai.iterations = 0;

		if (params.learning_rate) ai.params.learning_rate = params.learning_rate;
		if (params.min_error) ai.params.min_error = params.min_error;
		if (params.update_frequency) ai.params.update_frequency = params.update_frequency;

		var layer_defs = [];
		layer_defs.push({type:'input', out_sx: 1, out_sy: 1, out_depth: 1 });
		layer_defs.push({type:'fc', num_neurons: 20, activation: 'relu' });
		layer_defs.push({type: 'fc', num_neurons: 20, activation: 'sigmoid' });
		layer_defs.push({type:'regression', num_neurons: 1});		
		ai.net = new convnetjs.Net();
		ai.net.makeLayers(layer_defs); 
	}
}


var lineChart = new LineChart('linechart'), developmentChart = new DevelopmentChart('devchart');
var trainingId, startButton = document.getElementById('train-start');
startButton.addEventListener('click', function(e) {
	var t = startButton.textContent;
	if (t === 'Start training') {
		startTraining();
	} else {
		stopTraining();
	}
});
function startTraining() {
	startButton.textContent = 'Stop training';
	var params = {
		learning_rate: 0.01,
		update_frequency: 5,
		min_error: 0.02
	};

	var input_learning_rate = parseFloat(document.getElementById('param_learning_rate').value),
		input_update_frequency = parseInt(document.getElementById('param_update_frequency').value),
		input_min_error = parseFloat(document.getElementById('param_min_error').value);

	if (!isNaN(input_learning_rate)) params.learning_rate = input_learning_rate;
	if (!isNaN(input_update_frequency)) params.update_frequency = input_update_frequency;
	if (!isNaN(input_min_error)) params.min_error = input_min_error;
	
	ai.init(params);

	developmentChart.clearData();

	trainingId = setInterval(function() {
		ai.train();
		var result = ai.forward();
		lineChart.update(result.data);
		developmentChart.addData(ai.iterations, result.error);

		if (result.error < ai.params.min_error) {			
			stopTraining();
		}
	}, 100);
}
function stopTraining() {
	startButton.textContent = 'Start training';
	clearInterval(trainingId);

}