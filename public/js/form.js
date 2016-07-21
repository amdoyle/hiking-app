// Front end validation for form

function formValidation(){
  var trailName = validator.trim((document.forms["add-trail"]["trailName"].value).split(',')[0]);
  var review = validator.trim(document.forms["add-trail"]["review"].value);
  var description = validator.trim(document.forms["add-trail"]["description"].value);
  var user = validator.trim(document.forms["add-trail"]["username"].value);
  var latInput = validator.trim(document.forms["add-trail"]["lat"].value);
  var longInput = validator.trim(document.forms["add-trail"]["long"].value);
  var error = document.querySelector('.errors-blank');
  var errorType = document.querySelector('.errors-type');
  var errorUsers = document.querySelector('.errors-user');

   if (validator.isNull(trailName) || validator.isNull(review) || validator.isNull(description)
    || validator.isNull(user) || validator.isNull(latInput) || validator.isNull(longInput)) {
        error.innerHTML = "<ul>Feilds can't be blank</ul>";
     if(validator.isNull(trailName)) {
       $("#trailName").addClass("invalid");
     } else {
       $('#trailName').removeClass("invalid");
     }
     if(validator.isNull(review)) {
       $('#review').addClass("invalid");
     } else {
       $('#review').removeClass("invalid");
     }
     if(validator.isNull(description)) {
       $('#description').addClass("invalid");
     } else {
       $('#description').removeClass("invalid");
     }
     if(validator.isNull(user)) {
       $('#user').addClass("invalid");
     } else {
       $('#user').removeClass("invalid");
     }
     if(validator.isNull(longInput)) {
       $('#long').addClass("invalid");
     } else {
       $('#long').removeClass("invalid");
     }
     if(validator.isNull(latInput)) {
       $('#lat').addClass("invalid");
     } else {
       $('#lat').removeClass("invalid");
     }
   } else {
     error.innerHTML = "";
   }

    if(!validator.isFloat(latInput) || !validator.isFloat(longInput)) {
        errorType.innerHTML = "<ul>Longitude and Latitude must be in the proper format</ul>";
      if(!validator.isFloat(longInput)) {
        $('#long').addClass("invalid");
      } else {
        $('#long').removeClass("invalid");
      }

      if(!validator.isFloat(latInput)) {
        $('#lat').addClass("invalid");
      } else {
        $('#lat').removeClass("invalid");
      }

    } else {
        errorType.innerHTML = "";
    }

    if(!validator.isNull(user) && !validator.isAlphanumeric(user)) {
      errorUsers.innerHTML = "<li>Username can only contain letters and numbers</li>"
      if(validator.isNull(user)) {
        $('#user').addClass("invalid");
      }
    } else {
      errorUsers.innerHTML = "";
    }

    if(!validator.isNull(trailName) && !validator.isNull(review) && !validator.isNull(description)
     && !validator.isNull(user) && !validator.isNull(latInput) && !validator.isNull(longInput) && validator.isFloat(latInput) && validator.isFloat(longInput)){
      return true;
    }

}

function findForm() {
//   // console.log(document.forms["find"]["current"].value);
//   console.log(document.forms["add-trail"]["lat"].value);
//   console.log(document.forms["add-trail"]["long"].value);
}

function geocode(){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: document.forms["find"]["new_location"].value}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      findLat = results[0].geometry.location.lat();
      findLng = results[0].geometry.location.lat();
      return "latInput=" + findLat + "&" + "lngInput=" + findLng;

    }
  })
}


$(function(){
  var form;
  var location;
  var findLat;
  var findLng;
  $('#find').on('submit', function(event) {
    event.preventDefault();
    (function getLocation() {
        if(document.forms["find"]["current"].value === "true"){
          return location = "latInput="+document.forms["add-trail"]["lat"].value + "&" + "lngInput="
                            + document.forms["add-trail"]["long"].value + "&" + "distance="+ document.forms["find"]["distance"].value ;
        }else {
          // return geocode();
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({address: document.forms["find"]["new_location"].value}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              findLat = results[0].geometry.location.lat();
              findLng = results[0].geometry.location.lat();
              location = "latInput=" + findLat + "&" + "lngInput=" + findLng + "distance="+ document.forms["find"]["distance"].value;
              // console.log("in if " + location);
              return location;
              }
            });
            // console.log(location)
          // location = form.serialize();
        }
      })();

    $.ajax({
      type: 'GET',
      url: '/find',
      data: location
    }).done(function(data){
      // $.getJSON("/find", function(data) {
      //         console.log(data);
      //   $("#trails-near-you").html("something");
        // console.log(data);
      // });
    })
  });
});

// Submitting the form through ajax
$(function(){
  $('#add-trail').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var trailData = form.serialize();
    // checking if front end validations are returning ture before AJAX call is started
    if(formValidation() === true){
      $.ajax({
        type: 'POST',
        url: '/',
        data: trailData,
        success: function(textStatus, data){
          form.trigger('reset');
            // using AXAJ to grab the data from the router and pass it to createTrailMaker function
            $.getJSON("/trails", function(data) {
              createTrailMaker(data);
              $("#trails-near-you").html(data);
            });
           $('#notification-success').html(data.toUpperCase() + ": " + textStatus.trail_name +" add.");
               console.log(data +" "+ textStatus.trail_name +" add.");
        },
        error: function(textStatus, data) {
         $('#notification-error').html(data.toUpperCase() + ": " + textStatus.responseJSON);
        }
      }).done(function(data){
          form.trigger('reset');
            // using AXAJ to grab the data from the router and pass it to createTrailMaker function
            $.getJSON("/trails", function(data) {
              createTrailMaker(data);
            });


            $('#search-input').removeClass("invalid").val('');
            $('#review').removeClass("invalid");
            $('#description').removeClass("invalid");
            $('#lat').removeClass("invalid");
            $('#long').removeClass("invalid");
            $('#user').removeClass("invalid");

          });
    }
  });
});

// Allows users to submit the Add Trail form but hitting ender
$( "#other" ).click(function() {
  $( "#add-trail" ).submit();
});

// New syntax for $(document).on("ready", function(){});
$(function() {
  $("#add-trail").hide();

  $("#right").on("click", function() {
    $("#find").hide();
    $("#add-trail").show();
  });

  $("#left").on("click", function() {
    $("#add-trail").hide();
    $("#find").show();
  });
});
