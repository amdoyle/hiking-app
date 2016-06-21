var map;
var toronto = new google.maps.LatLng(43.6532, -79.3832);
var userLocation;
var browserSupportFlag = new Boolean();

function initialize() {

  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8
  });

  if(navigator.geoloation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      userLocation = new google.maps.LatLng(position.coords.latitude.position.coords.longitude);
      map.setCenter(userLocation)
    },
    function() {
        handleNoGeolocation(browserSupportFlag);
      });
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if(errorFlag == true) {
      alert("Geolocation server failed.");
      userLocation = toronto;
    } else {
      alert("Oops, we can't find you! Your device doesn't support geolocation. We will start you here, but you can still scroll and find your location manually.");
      userLocation = toronto;
    }
    map.setCenter(userLocation);
  }

}

google.maps.event.addDomListener(window, 'load', function() {
  // your initialization code goes here.
  initialize();
});
