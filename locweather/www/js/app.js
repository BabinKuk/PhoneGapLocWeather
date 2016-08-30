$(document).ready(function(){
	// Device Event Listener
	document.addEventListener("deviceready", onDeviceReady, false);
});

// Check Device is Ready
function onDeviceReady(){
	console.log('Device Ready...');

	$('#show_more_location').click(function(e){
		e.preventDefault();
		getMoreLocation();
	});
	
	$('#clear_info').click(function(e){
		e.preventDefault();
		clearInfo();
	});
	
	$('#other_location').click(function(e){
		e.preventDefault();
		getOtherLocation();
	});
	
	getDate();

	getLocation();
}

// Get, Format & Display Current Date
function getDate(){
	console.log('getting Date...');
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	// display date
	$('#datetime_display').html(datetime);
}

// Get Current User Location
function getLocation(){
	console.log('Getting Users Location...');
	console.log(navigator);
	
	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var city = '';
		var state = '';
		var html = '';
		
		console.log('response');
		
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
			datatype: 'jsonp',
			success: function(response){
				console.log('response');
				city = response.results[0].address_components[2].long_name;
				state = response.results[0].address_components[4].short_name;

				html = '<h1>'+city+', '+state+'</h1>';

				$('#myLocation').html(html);
				
				// Get weather
				//getWeather();
			}
		});
	});
	
	//test
	city = 'San Francisco';
	state = 'CA';
	html = '<h1>'+city+', '+state+'</h1>';
	$('#myLocation').html(html);
	// Get weather
	getWeather(city, state);
	
	$('#show_more_weather').click(function(e){
		e.preventDefault();
		getMoreWeather(city, state);
	});
}	

// Get Some Extra Location Info
function getMoreLocation(){
	console.log('Getting More Location Info...');

	// Close Dropdown Menu
	$('.navbar-toggle').click();

	var html = '';

	navigator.geolocation.getCurrentPosition(function(position){
		html='<ul id="more_location_list" class="list-group">' +
		'<li class="list-group-item"><strong>Latitude: </strong>'+position.coords.latitude+'</li>' +
		'<li class="list-group-item"><strong>Longitude: </strong>'+position.coords.longitude+'</li>' +
		'<li class="list-group-item"><strong>Altitude: </strong>'+position.coords.altitude+'</li>' +
		'<li class="list-group-item"><strong>Accuracy: </strong>'+position.coords.accuracy+'</li>' +
		'</ul>';

		$('#more_location_display').html(html);
	});
}

// Get weather info for a location
function getWeather(city, state){
	console.log('getting weather for ' + city + '...');
	
	var html = '';
	
	$.ajax({
		url: 'http://api.wunderground.com/api/358d348fd766605d/conditions/q/' + state + '/' +city + '.json',
		datatype: 'jsonp',
		success: function(parsed_json){
			//console.log(parsed_json);
			console.log(parsed_json.current_observation);
			
			weather = parsed_json['current_observation']['weather'];
			temperature_string = parsed_json['current_observation']['temperature_string'];
			icon_url = parsed_json['current_observation']['icon_url'];
			
			html = '<h1 class="text-center"><img src="' + icon_url + '">'; 
			html += weather + '</h1>';
			html += '<h2 class="text-center">' + temperature_string + '</h2>';
			
			$('#weather').html(html);
		}
	});
}

// Display More Weather Info
function getMoreWeather(city, state){
	console.log('Getting More Weather');

	// Close Dropdown Menu
	$('.navbar-toggle').click();
	
	var html = '';
	$.ajax({
		url: 'http://api.wunderground.com/api/358d348fd766605d/conditions/q/' + state + '/' +city + '.json',
		datatype:'jsonp',
		success: function(parsed_json){
			console.log(parsed_json.current_observation);

			temp_f = parsed_json['current_observation']['temp_f'];
			temp_c = parsed_json['current_observation']['temp_c'];
			dewpoint_string = parsed_json['current_observation']['dewpoint_string'];
			dewpoint_f = parsed_json['current_observation']['dewpoint_f'];
			dewpoint_c = parsed_json['current_observation']['dewpoint_c'];
			wind_string = parsed_json['current_observation']['wind_string'];
			wind_dir = parsed_json['current_observation']['wind_dir'];
			wind_mph = parsed_json['current_observation']['wind_mph'];
			visibility = parsed_json['current_observation']['visibility'];
			solarradiation = parsed_json['current_observation']['solarradiation'];
			relative_humidity = parsed_json['current_observation']['relative_humidity'];
			local_time = parsed_json['current_observation']['local_time_rfc822'];
			precip_today_in = parsed_json['current_observation']['precip_today_in'];
			feelslike_string = parsed_json['current_observation']['feelslike_string'];
			feelslike_f = parsed_json['current_observation']['feelslike_f'];
			feelslike_c = parsed_json['current_observation']['feelslike_c'];

			html='<ul id="more_weather_list" class="list-group">' +
				'<li class="list-group-item"><strong>Feels Like: </strong>'+feelslike_string+'</li>' +
				'<li class="list-group-item"><strong>Dewpoint: </strong>'+dewpoint_string+'</li>' +
				'<li class="list-group-item"><strong>Wind: </strong>'+wind_string+'</li>' +
				'<li class="list-group-item"><strong>Wind Speed: </strong>'+wind_mph+'</li>' +
				'<li class="list-group-item"><strong>Humidity: </strong>'+relative_humidity+'</li>' +
				'<li class="list-group-item"><strong>Solar Radiation: </strong>'+solarradiation+'</li>' +
				'<li class="list-group-item"><strong>Precipitation: </strong>'+precip_today_in+'</li>' +
				'</ul>';

			$('#more_weather_display').html(html);
		}
	});
}

// Clear All Extra Info
function clearInfo(){
	getLocation();
	
	// Close Dropdown Menu
	$('.navbar-toggle').click();
	
	// clear all additional fields
	$('#more_weather_display').html('');
	$('#more_location_display').html('');
}

// Get Info About Other Location
function getOtherLocation(){
	console.log('getting other location...');
	
	var html = '';
	var city = $('#city').val();
	var state = $('#state').val();

	html = '<h1>'+city+', '+state+'</h1>';

	$('#myLocation').html(html);

	getWeather(city, state);
}