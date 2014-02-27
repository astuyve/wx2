var svg = d3.select("#speedometer")
		.append("svg:svg")
		.attr("width", 900)
		.attr("height", 900);

var gauge = iopctrl.arcslider()
		.radius(120)
		.events(false)
		.indicator(iopctrl.defaultGaugeIndicator);
gauge.axis().orient("out")
		.normalize(false)
		.tickSubdivide(3)
		/*.ticks(5)*/
		.tickValues([90, 180, 270, 360])
		/*.tickSize(10, 8, 10)*/
		.tickPadding(5)
		.scale(d3.scale.linear()
				.domain([0, 360])
				.range([0, 2*Math.PI]));

  svg.append("g")
		.attr("transform", "translate(50, 30)")
		.attr("class", "gauge")
		.call(gauge);

var wind_indicator = iopctrl.slider()
		.width(50)
		.events(false)
		.bands([
			{"domain": [0,15], "span":[0.05, 0.5] , "class": "ok" },
			{"domain": [15,20], "span":[0.05, 0.5] , "class": "warning" },
			{"domain": [20,30], "span":[0.05, 0.5] , "class": "fault" }])
		.indicator(iopctrl.defaultSliderIndicator)
		.ease("elastic");
wind_indicator.axis().orient("left")
		.tickSubdivide(4)
		.tickSize(10, 8, 10)
		.scale(d3.scale.linear()
				.domain([0,30])
				.range([0, -400]));

svg.append("g")
		.attr("transform", "translate(500, 400)")
		.attr("class", "lineargauge")
		.call(wind_indicator);


var steps = ["3000","6000","9000","12000","18000","24000","30000","34000","39000"];


$(document).ready( function() {
		$('.altitude_selector').slider({
			value: 3000,
			min: 3000,
			max: 39000,
			step: 3000,
			slide: function(event, ui) {
				$("#altitudes").val(steps[ui.value]);
				/*wind_indicator.value(data[ui.value].speed)
				guage.value(data[ui.value].direction)*/
				console.log(data)
			}
		});
});


function updateWinds() {
	var e = document.getElementById("airport_code");
	var selected = e.options[e.selectedIndex].text;

	var request = $.ajax({
		url: '/airport_code_json',
		type: 'GET',
		data: "airport_code=" + selected,
		success: function(response) {
			data = response['winds']
			console.log(data)
		}
	});

	var parse = selected.split(" ");
	var direction = parse[0];
	var speed = parse[1];
	wind_indicator.value(speed);
	gauge.value(direction);
	document.getElementById("display_airport_code").innerHTML=e.options[e.selectedIndex].text;
	document.getElementById("display_direction").innerHTML=direction;
	document.getElementById("display_speed").innerHTML=speed;
}

