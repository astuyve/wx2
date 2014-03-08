var svg = d3.select("#speedometer")
		.append("svg:svg")
		.attr("width", 500)
		.attr("height", 500);

var gauge = iopctrl.arcslider()
		.radius(100)
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
		.attr("transform", "translate(0, 30)")
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
		.attr("transform", "translate(300, 400)")
		.attr("class", "lineargauge")
		.call(wind_indicator);


var steps = [0,3000,6000,9000,12000,18000,24000,30000,34000,39000];

function set_attrs(altitude) {
	wind_indicator.value(data[altitude].speed);
	gauge.value(data[altitude].direction);
	$('#display_altitude').html(altitude);
	$('#display_direction').html(data[altitude].direction);
	$('#display_speed').html(data[altitude].speed);
}

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
			set_attrs(altitude_slider.value);
			return false;
		}
	});

	var selected = $('#airport_code option:selected').text();
	set_attrs("0");
	$('#display_airport_code').html(selected);
});


function updateWinds() {
	var e = $('#airport_code');
	var selected = $('#airport_code option:selected').text();
	var request = $.ajax({
		url: '/airport_code_json',
		type: 'GET',
		data: "airport_code=" + selected,
		success: function(response) {
			data = response['winds']
			$('#display_airport_code').html(selected);
			set_attrs("0")
		}
	});


}

