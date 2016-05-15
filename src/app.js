/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var list_weather = ['code4hour', 'code7hour', 'code10hour', 'code13hour', 'code16hour', 'code19hour', 'code22hour', 'code25hour', 'code28hour', 'code31hour', 'code34hour', 'code37hour', 'code40hour', 'code43hour', 'code46hour', 'code49hour'];

var textStatus = new UI.Text({
	position: new Vector2(0, 0),
	size: new Vector2(144, 20),
	text : 'Getting Location...',  
	font: 'Gothic 14',
	color: 'Black',
	textAlign: 'center',
	backgroundColor: 'White'
});

var textTime = new UI.Text({
	position: new Vector2(0, 20),
	size: new Vector2(144, 20),
	text : '',  
	font: 'Gothic 14',
	color: 'Duke Blue',
	textAlign: 'center',
	backgroundColor: 'White'
});

var window = new UI.Window({
	fullscreen: false,
	scrollable: true
});
window.add(textStatus);
window.add(textTime);

var textLocation = new UI.Text({
	position: new Vector2(0, 40),
	size: new Vector2(144, 20),
	text : '',  
	font: 'Gothic 14 Bold',
	color: 'White',
	textAlign: 'center',
	backgroundColor: 'Black'
});

var textWeather = new UI.Text({
	position: new Vector2(0, 60),
	size: new Vector2(144, 220),
	text : '',  
	font: 'Gothic 14',
	color: 'Indigo',
	textAlign: 'center',
	backgroundColor: 'White'
});

window.add(textLocation);
window.add(textWeather);

window.show();

function locationSuccess_nowhere(pos) {
	var Lat = pos.coords.latitude, Long = pos.coords.longitude;
	textStatus.text('Lat: ' + ((0|Lat*100)/100) + ' / Long: ' + ((0|Long*100)/100));
	textTime.text('Fetching weather...');
	var request = new XMLHttpRequest();
	request.onload = function() {
		json = JSON.parse(this.responseText);
		textLocation.text(json.weather.forecast3days[0].grid.city + ' ' + json.weather.forecast3days[0].grid.county + ' ' + json.weather.forecast3days[0].grid.village);
		var dateRef = new Date(json.weather.forecast3days[0].timeRelease);
		var minute = dateRef.getMinutes();
		if (minute < 10) minute = '0' + minute;
		textTime.text(dateRef.getFullYear() + '-' + (dateRef.getMonth()+1) + '-' + dateRef.getDate() + ' ' + dateRef.getHours() + ':' + minute + ' Now');
		var txtOutput = '';
		for (i in list_weather) {
			datetmp = new Date(dateRef.getTime() + parseInt(list_weather[i].match(/[0-9]+/)[0]) * 3600 * 1000);
			minute = datetmp.getMinutes();
			if (minute < 10) minute = '0' + minute;
			switch (json.weather.forecast3days[0].fcst3hour.sky[list_weather[i]]) {
				case 'SKY_S01':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Clear(S1)';
					break;
				case 'SKY_S02':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Partly cloudy(S2)';
					break;
				case 'SKY_S03':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Mostly cloudy(S3)';
					break;
				case 'SKY_S04':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy(S4)';
					break;
				case 'SKY_S05':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Snowy(S5)';
					break;
				case 'SKY_S06':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy/snowy(S6)';
					break;
				case 'SKY_S07':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Cloudy(S7)';
					break;
				case 'SKY_S08':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy(S8)';
					break;
				case 'SKY_S09':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Snowy(S9)';
					break;
				case 'SKY_S10':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy/snowy(S10)';
					break;
				case 'SKY_S11':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Lightning(S11)';
					break;
				case 'SKY_S12':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy(S12)';
					break;
				case 'SKY_S13':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Snowy(S13)';
					break;
				case 'SKY_S14':
					txtOutput = txtOutput + datetmp.getDate() + ' ' + datetmp.getHours() + ':' + minute + ' - Rainy/snowy(S14)';
					break;
				default:
					console.log(json.weather.forecast3days[0].fcst3hour);
			}
			txtOutput = txtOutput + '\n';
		}
		console.log(txtOutput);
		textWeather.text(txtOutput);
	};
	request.open('GET', 'http://apis.skplanetx.com/weather/forecast/3days?version=1&lat=' + Lat + '&lon=' + Long, true);
	request.setRequestHeader('Accept', 'application/json');
	request.setRequestHeader('appKey', '8b6c1587-66b3-32b7-a0ab-652c639b3970');
	request.send();
}   
function locationError(err) {
	textStatus.text('Error getting location');
}

var locationOptions = {
	enableHighAccuracy: true, 
	maximumAge: 60000, 
	timeout: 10000
};

navigator.geolocation.getCurrentPosition(locationSuccess_nowhere, locationError, locationOptions);
