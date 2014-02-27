var svg = d3.select("#speedometer")
		.append("svg:svg")
		.attr("width", 500)
		.attr("height", 500);

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
		.attr("transform", "translate(30, 30)")
		.attr("class", "gauge")
		.call(gauge);

var wind_indicator = iopctrl.slider()
		.width(50)
		.events(false)
		.bands([
			{"domain": [0,15], "span":[0.05, 0.5] , "class": "ok" },
			{"domain": [15,25], "span":[0.05, 0.5] , "class": "warning" },
			{"domain": [25,100], "span":[0.05, 0.5] , "class": "fault" }])
		.indicator(iopctrl.defaultSliderIndicator)
		.ease("elastic");
wind_indicator.axis().orient("left")
		.tickSubdivide(4)
		.tickSize(10, 8, 10)
		.scale(d3.scale.linear()
				.domain([0,100])
				.range([0, -400]));

svg.append("g")
		.attr("transform", "translate(400, 400)")
		.attr("class", "lineargauge")
		.call(wind_indicator);


var steps = [3000,6000,9000,12000,18000,24000,30000,34000,39000];


$(document).ready( function() {
	var altitude_slider = $('input#altitude_selector')[0];
	$('input#altitude_selector').bind('change', function(event){
		var distance = [],
			minDistance = 39000,
			minI;
		$.each(steps, function(i, val) {
			distance[i] = Math.abs( altitude_slider.value - val);
			if ( distance[i] < minDistance) {
				minDistance = distance[i];
				minI = i;
			}
		});

		if (minDistance) {
			altitude_slider.value=steps[minI];
			$(this).slider('refresh');
			wind_indicator.value(data[altitude_slider.value].speed)
			gauge.value(data[altitude_slider.value].direction)
			document.getElementById("display_altitude").innerHTML = altitude_slider.value
			document.getElementById("display_direction").innerHTML=data[altitude_slider.value].direction;
			document.getElementById("display_speed").innerHTML=data[altitude_slider.value].speed;
			return false;
		}
	});

	var e = document.getElementById("airport_code");
	var selected = e.options[e.selectedIndex].text;
	wind_indicator.value(data["3000"].speed)
	gauge.value(data["3000"].direction)
	document.getElementById("display_airport_code").innerHTML=selected;
	document.getElementById("display_altitude").innerHTML="3000";
	document.getElementById("display_direction").innerHTML=data["3000"].direction;
	document.getElementById("display_speed").innerHTML=data["3000"].speed;
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
			wind_indicator.value(data["3000"].speed)
			gauge.value(data["3000"].direction)
			document.getElementById("display_airport_code").innerHTML=selected;
			document.getElementById("display_altitude").innerHTML="3000";
			document.getElementById("display_direction").innerHTML=data["3000"].direction;
			document.getElementById("display_speed").innerHTML=data["3000"].speed;
		}
	});


}

