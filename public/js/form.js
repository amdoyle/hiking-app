// Front in validation for form
function formValidation(){
  var trailName = validator.trim(document.forms["add-trail"]["trailName"].value);
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

// Submitting the form through ajax
$(function(){
  $('form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var trailData = form.serialize();
    // checking if front end validations are returning ture before AJAX call is started
    if(formValidation() === true){
      $.ajax({
        type: 'POST',
        url: '/',
        data: trailData,
        success: function(trailData){
          form.trigger('reset');
            // using AXAJ to grab the data from the router and pass it to createTrailMaker function
            $.getJSON("/trails", function(data) {
              createTrailMaker(data);
              $("#trails-near-you").html(data);
              console.log(data);
            });

        },
        error: function(textStatus, err) {
           alert('text status '+textStatus+', err '+err)
        }
      // }).done(function(data){
        // form.trigger('reset');
        //   // using AXAJ to grab the data from the router and pass it to createTrailMaker function
        //   $.getJSON("/trails", function(data) {
        //     createTrailMaker(data);
        //     $("#trails-near-you").html(data);
        //     console.log(data);
        //
        //   });

          // if(data == error){
          //   // $('#notification').addClass('has-error'); // add the error class to show red input
          //   $('#notification').html('<p> There was an error please try again</p>'); // add the actual error message under our input
          // } else {
          //
          //     // ALL GOOD! just show the success message!
          //     $('#notification').html('<p>your trail was saved</p>');
          //
          //
          // }
          //
          // $('#search-input').val('');
          // $('#trailName').removeClass("invalid");
          // $('#review').removeClass("invalid");
          // $('#description').removeClass("invalid");
          // $('#lat').removeClass("invalid");
          // $('#long').removeClass("invalid");
          // $('#user').removeClass("invalid");

        });
    }
  });
});

// Allows users to submit the Add Trail form but hitting ender
$( "#other" ).click(function() {
  $( "#add-trail" ).submit();
});
