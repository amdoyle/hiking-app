function onSignIn(googleUser) {

  gapi.load('auth2', function() {
  auth2 = gapi.auth2.getAuthInstance({
    client_id: 'CLIENT_ID.apps.googleusercontent.com',
    fetch_basic_profile: false,
    scope: 'profile'
  });

  // Sign the user in, and then retrieve their ID.
    auth2.signIn().then(function() {
      console.log(auth2.currentUser.get().getId());
      var id_token = googleUser.getAuthResponse().id_token;
      console.log(id_token);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/login');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
      };
      xhr.send('idtoken=' + id_token);
    });
  });

}

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
