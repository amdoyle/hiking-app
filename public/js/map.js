var geocoder;
var map;
var toronto = new google.maps.LatLng(43.6532, -79.3832);
var userLocation;
var browserSupportFlag = new Boolean();


function initialize() {
  // Creating an infoWindow var;
  var marker;
  var infoWindow;
  // Creating an instance of a Google Map
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
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


  function initAutocomplete() {
    var searchInput = document.getElementById("search-input");
    var searchBox = new google.maps.places.SearchBox(searchInput);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        var location;

        // places returns an array, but this code will only active with the user enters the auto complete
        places.forEach(function(place) {
          location = {lat:place.geometry.location.lat() , lng:place.geometry.location.lng() }
        });
        if (places.length == 0) {
          return;
        }

        // remove red marker, so that there is only one on the page
        marker.setMap(null);
        // Move marker
        addMarker(location, map);
        // Pan to the new marker to the new marker
        map.panTo(location);

    });
  }

  initAutocomplete(location, map);

}


function createTrailMaker(trails){
  //Turning the JSON object from the model to an array
  var trailArray = $(trails).toArray();

  // This function adds a yellow marker and the infoWindow for each trail
  var addBlueMarker = function(trail, map) {
    var latLng = {lat: trail.lat, lng: trail.long}

    var infoWindow = new google.maps.InfoWindow({
      content: "<h3 class='-window-title'>" + trail.trail_name + "</h3><br/>" +
      trail.description +
      "<h3 class='-window-subheads'>Review:</h3> " + trail.review +
      "<h3 class='-window-subheads'>Reviewed by user:</h3> " + trail.username
    });

    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      draggable: false,
      title: trail.trail_name,
      icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });


    // adding an event listener to open the infoWindow on click
    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });

  }

  // Loop through the array and call addBlueMaker function for each trail in the array
  for(var i = 0; i < trailArray.length; i++){
    addBlueMarker(trailArray[i], map);
  }

}

google.maps.event.addDomListener(window, 'load', function() {

  initialize();
  // initAutocomplete();
  // using AXAJ to grab the data from the router and pass it to createTrailMaker function
  $.getJSON("/trails", function(data) {
    createTrailMaker(data);
  });

});
