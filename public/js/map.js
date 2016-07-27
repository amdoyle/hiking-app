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
    console.log(location)
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
    var searchInput = document.getElementsByClassName("search-input")[1];
    var searchBox = new google.maps.places.SearchBox(searchInput);

    var newTrail = document.getElementsByClassName("search-input")[0];
    var newTrailSearch = new google.maps.places.SearchBox(newTrail);

    function placeFind(places, location) {
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
    }

    map.addListener('bounds_changed', function() {
           newTrailSearch.setBounds(map.getBounds());
           searchBox.setBounds(map.getBounds());
    });

    newTrailSearch.addListener('places_changed', function() {
      var places = newTrailSearch.getPlaces();
      var location;
      placeFind(places, location);
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        var location;
        placeFind(places, location);
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

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      draggable: false,
      title: trail.trail_name,
      icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });

    var infoWindow = new google.maps.InfoWindow({
      content: "<h3 class='-window-title'>" + trail.trail_name + "</h3><br/>" +
      trail.description +
      "<h3 class='-window-subheads'>Review:</h3> " + trail.review +
      "<h3 class='-window-subheads'>Reviewed by user:</h3> " + trail.username
    });


    // adds an event listener to open the infoWindow on click
    marker.addListener('mouseover', function() {
      infoWindow.open(map, marker);
    });

    // adds a listener to close the infoWindow when the mouse moves off of it
    marker.addListener('mouseout', function() {
      infoWindow.close(map, marker);
    });

    }

    // clearing out div
    $("#trails-near-you").html("");


  // Loop through the array and call addBlueMaker function for each trail in the array
    for(var i = 0; i < trailArray.length; i++){
      addBlueMarker(trailArray[i], map);
      $('<li>'+trails[i].trail_name+'</li>').appendTo("#trails-near-you");
    }


}



// Event listeners to load the map and markers
google.maps.event.addDomListener(window, 'load', function() {

  initialize();
  // initAutocomplete();
  // using AXAJ to grab the data from the router and pass it to createTrailMaker function
  $.getJSON("/trails", function(data) {
    createTrailMaker(data);
  });



});
