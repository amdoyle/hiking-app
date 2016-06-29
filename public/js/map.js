var geocoder;
var map;
var toronto = new google.maps.LatLng(43.6532, -79.3832);
var userLocation;
var browserSupportFlag = new Boolean();
var trails = [];

function initialize() {
  // Creating an infoWindow var;
  var marker;
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
      marker = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.BOUNCE,
      map: map,
      draggable: true,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    updateLatLngOnForm(marker);

  }

  // Add the event listener to mvoe the red marker
  google.maps.event.addListener(map, 'click', function(event) {
    // Setting the current marker, which is scoped to this function, to null
    marker.setMap(null);
    // Adding a new marker at the location where the click occured
    addMarker(event.latLng, map);
    // Pan to the new marker to the new marker
    map.panTo(event.latLng);
  });

  // Function to locate the lat and long on the form
  function updateLatLngOnForm(currentMarker){
    $("#lat").val(currentMarker.position.lat().toPrecision(5));
    $("#long").val(currentMarker.position.lng().toPrecision(5));
  }

}


function createTrailMaker(trails){

  var trailArray = $(trails).toArray();

  var addBlueMarker = function(latitude, longitude, map) {
    var latLng = {lat: latitude, lng: longitude}

    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      draggable: false,
      icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });

  }

  for(var i = 0; i < trailArray.length; i++){
    console.log(trailArray[i].lat);
    addBlueMarker(trailArray[i].lat, trailArray[i].long, map);
  }

}

google.maps.event.addDomListener(window, 'load', function() {
  initialize();

    $.getJSON("/trails", function(data) {
      createTrailMaker(data);
    });

});
