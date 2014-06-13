var svg = d3.select("#speedometer")
    .append("svg:svg")
    .attr("width", 400)
    .attr("height", 400);

var gauge = iopctrl.arcslider()
  .radius(90)
  .events(false)
  .indicator(iopctrl.defaultGaugeIndicator);
  gauge.axis().orient("out")
    .normalize(false)
    .tickSubdivide(3)
    .tickValues([90, 180, 270, 360])
    .scale(d3.scale.linear()
      .domain([0, 360])
      .range([0, 2*Math.PI]));

  svg.append("g")
    .attr("class", "gauge")
    .call(gauge);

var wind_indicator = iopctrl.slider()
    .width(40)
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
        .range([0, -300]));

svg.append("g")
    .attr("transform", "translate(275, 300)")
    .attr("class", "lineargauge")
    .call(wind_indicator);

var cookie_name = "airport_code"

function set_airport_cookie(airport_code) {
  if (airport_code) {
    document.cookie = cookie_name + "=" + airport_code + "; expires=2000000000";
  }
}

function get_airport_cookie() {
  if (document.cookie.indexOf(cookie_name) != -1) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == " ")
        cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(cookie_name) == 0) {
        return (cookie.substring(cookie_name.length+1, cookie.length));
      }
    }
  }
}

var steps = [0,3000,6000,9000,12000,18000,24000,30000,34000,39000];

function set_attrs(altitude) {
  wind_indicator.value(data[altitude].speed);
  gauge.value(data[altitude].direction);
  $('#display_altitude').html(altitude);
  $('#display_direction').html(data[altitude].direction);
  $('#display_speed').html(data[altitude].speed);
}

$(document).ready( function() {
  var selected_airport_from_cookie = get_airport_cookie();
  if (selected_airport_from_cookie) {
    $('#airport_code').val(selected_airport_from_cookie);
    updateWinds();
  }
  
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
  var selected = $('#airport_code option:selected').text();
  set_airport_cookie(selected);
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

