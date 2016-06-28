var geocoder;
var map;
var toronto = new google.maps.LatLng(43.6532, -79.3832);
var userLocation;
var browserSupportFlag = new Boolean();
var selectedLat;
var selectedLong;
// var marker;

function initialize() {
  // Creating an infoWindow var;
  var infoWindow;
  // Creating an instance of a Google Map
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center:userLocation
  });

  //Checking in the device support gelocation using the reco HTML 5 version
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // set the map center to user's position and add a red marker
      map.setCenter(pos);
      addMarker(pos, map);
    });
  } else {
    handleNoGeolocation(flase, infoWindow, map.getCenter(), map);
  }

  function handleNoGeolocation(browserHasGeolocation, infoWindow, pos, map) {
    // Assigning the infoWindow var and letting the user knwo that their browser
    // doesn't support this service, and add a red marker
      infoWindow = new google.maps.InfoWindow({map: map});
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      addMarker(pos, map);
  }

  // Add marker function
  function addMarker(location, map) {
    var marker = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.BOUNCE,
      map: map,
      draggable: true,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
  }

  function removeMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.BOUNCE,
      map: map,
      draggable: true,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
  }

  // Add the event listener to mvoe the red marker
  google.maps.event.addListener(map, 'click', function(event) {
    // removeMarker()
    addMarker(event.latLng, map);
    map.panTo(event.latLng);

  });

}


//
google.maps.event.addDomListener(window, 'load', function() {
  // your initialization code goes here.
  initialize();
});
