var theScroll;
var markerData=[];

var latitude=-999, longitude=-999;

document.addEventListener('DOMContentLoaded', scroll, false);


function page(toPage) {
    var toPage = $(toPage),
    fromPage = $("#pages .current");
    if(toPage.hasClass("current") || toPage === fromPage) {
        return;
    };
    toPage.addClass("current fade in").one("webkitAnimationEnd", function(){
        fromPage.removeClass("current fade out");
        toPage.removeClass("fade in")
    });
    fromPage.addClass("fade out");
}

//Map JS
$(function() {
	var yourStartLatLng = new google.maps.LatLng(39, -108);
		$('#map_canvas').gmap({'center': yourStartLatLng});
});
$('#map').live("pageshow", function() {
	$('#map_canvas').gmap('refresh');
});
$('#map').live("pageinit", function() {
	$('#map_canvas').gmap({'center': '39, -108'});
});
//$.each(markerData, function(){
//	$('#map_canvas').gmap('addMarker', {'position': lat,lon', 'bounds': true}).click(function() {
//		$('#map_canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
//	});
//	
//})

//Getting Latitude and Longitude
document.addEventListener("deviceready", loaded, false);
var watchID = null;
var network = null;
function loaded() {
    watchID = navigator.geolocation.watchPosition(success, error, { frequency: 3000 });
}
function success(position) {
    var elementLat = document.getElementById('latitude');
    latitude = position.coords.latitude;
    elementLat.innerHTML = latitude;
    var elementLong = document.getElementById('longitude');
    longitude = position.coords.longitude;
    elementLong.innerHTML = longitude;
}
function error(error) {
    alert(error.message);
}


//Plugin JS
var WifiPlugin = {
		callNativeFunction: function (success, fail, resultType) {
		return cordova.exec( success, fail, "com.example.wifigeolocator", "nativeAction", [resultType]);
		}
	}; 
	APobj = new Object();
	APobj.ssid = "NULL";
	APobj.mac="NULL";
	APobj.security="NULL";
	APobj.frequency=-999;
	APobj.signal=-999;
	APobj.lat=0;
	APobj.lon=0;


	var inter;
	var stat;
	var res;
	function onBodyLoad() 
	{   
		stat=document.getElementById('status');
		res=document.getElementById('results');
		stat.innerHTML="Idle";
		res.innerHTML="Waiting for Results";
	}
	function startButtonPressed(){
		if(latitude!=-999 && longitude!=-999){
			inter=setInterval(startScanning, 3000);
			//startScanning();
			stat.innerHTML="Scanning...";
		}else{
			alert("You need to turn on your GPS");
		}
	}
	function stopButtonPressed(){
		clearInterval(inter);
		stat.innerHTML="Idle";
	}
	function startScanning() {
		res.innerHTML=" ";
		WifiPlugin.callNativeFunction(nativePluginSuccessHandler, nativePluginErrorHandler, null);
	}

	function nativePluginSuccessHandler(result) {
		var key, i=0, str;
		var arr = [];
		for(key in result.AP){
			var obj = {
			ssid: result.AP[key].SSID,
			mac: result.AP[key].MAC,
			security: result.AP[key].SECURITY,
			frequency: result.AP[key].FREQUENCY,
			signal: result.AP[key].SIGNAL,
			lat: latitude,
			lon: longitude,
			};
		
			arr.push(obj);
		}
		
		str="";
		for(i=0; i<arr.length; i++) {
			markerData[i]=arr[i];
			str+=arr[i].ssid + " " + arr[i].mac+arr[i].security + " " +arr[i].frequency + " " +arr[i].signal + " " +arr[i].lat+" "+arr[i].lon+"</br>";
		}
		res.innerHTML=str;	  
	}

	function nativePluginErrorHandler(result) {
		alert("Error "+result);
	}