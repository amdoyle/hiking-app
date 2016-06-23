var geocoder;
var map;
var toronto = new google.maps.LatLng(43.6532, -79.3832);
var userLocation;
var browserSupportFlag = new Boolean();
var selectedLat;
var selectedLong;



function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng()

  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center:userLocation
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

  var initialLocationMarker = new google.maps.LatLng(userLocation);
  var marker = new google.maps.Marker({
    position: userLocation,
    animation: google.maps.Animation.BOUNCE,
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  });

  lastMarker = marker;
}


google.maps.event.addDomListener(window, 'load', function() {
  // your initialization code goes here.
  initialize();
});
