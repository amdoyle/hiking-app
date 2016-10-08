var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var sqlite3 = require('../node_modules/sqlite3').verbose();
var validator = require('validator');
var trailDB = new sqlite3.Database('./trail.db');
var userDB = new sqlite3.Database('./user.db');
var google = require('../node_modules/googleapis');
var GoogleAuth = require('../node_modules/google-auth-library');
var authFactory = new GoogleAuth();
var jwtDecode = require('jwt-decode');
var clientId = require('../client_secret.json')['web']['client_id'];
// var dotenv = require('dotenv');
// dotenv.load();

// var geocoder = require('geocoder');

trailDB.serialize(function() {
  trailDB.run("CREATE TABLE IF NOT EXISTS trail (id INTEGER PRIMARY KEY, trail_name TEXT NOT NULL, lat FLOAT, long FLOAT, description TEXT NOT NULL, review TEXT NOT NULL, username TEXT NOT NULL)");
      // db.close();
var userDB = new sqlite3.Database('./user.db');
var passport = require('../config.js');
var google = require('googleapis');
var urlshortener = google.urlshortener('v1');
var params = { shortUrl: 'http://goo.gl/xKbRu3' };
  // get the long url of a shortened url
  urlshortener.url.get(params, function (err, response) {
    if (err) {
      console.log('Encountered error', err);
    } else {
      console.log('Long url is', response.longUrl);
    }
  });
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var secrets = require('../secrets.js');
var oauth2Client = new OAuth2(secrets.googleAuth.CLIENT_ID, secrets.googleAuth.CLIENT_SECRET, secrets.googleAuth.REDIRECT_URL);
// var geocoder = require('geocoder');
// var scopes = [
//   'https://www.googleapis.com/auth/plus.me',
// ];

// *******************************************************************************//
trailDB.serialize(function() {
  trailDB.run("CREATE TABLE IF NOT EXISTS trail (id INTEGER PRIMARY KEY, trail_name TEXT, lat FLOAT, long FLOAT, description TEXT, review TEXT, user_id INTEGER)");
  // db.run("DROP TABLE trail");
});
userDB.serialize(function() {
  userDB.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, username TEXT, email TEXT)");
  // db.run("DROP TABLE trail");
});


// function isLoggedIn(req, res, next) {
//   if(req.isAuthenticated()){
//     return next();
//   }
//   return res.redirect('/');
// }

router.route('/')
  .get(function(req, res) {
    return res.sendFile(path.join(__dirname + "/../views/index.html"));
  })
  .post(parseUrlencoded, function(req, res, next) {
    console.log("post route for new trail")
    // Escaping harmful characters
    var name = escape(validator.trim(req.body.trailName));
    var inputLat = validator.trim(req.body.lat);
    var inputLong = validator.trim(req.body.long);
    var descrip = escape(validator.trim(req.body.description));
    var rev = escape(validator.trim(req.body.review));
    var user = validator.trim(req.body.username);


    //setting the object to be returned
    var newtrail = {
      trail_name: name,
      description: descrip,
      review: rev,
      username: user,
      lat: inputLat,
      long: inputLong
    }

    //  Checking to ensure that all paramaters meet the validations before saving
    if(validator.isAlphanumeric(user) && validator.isAscii(name, descrip, rev)
    && validator.isFloat(inputLat) && validator.isFloat(inputLat) &&
    !validator.isNull(user, name, descrip, rev, inputLong, inputLat))  {
      // SQL statment to input the info
      var sqlRequest = "INSERT INTO TRAIL (trail_name, lat, long, description, review, username)" +
                       "VALUES ('" + name + "', '" + inputLat + "', '" + inputLong + "', '" + descrip
                       + "', '" + rev + "', '" + user + "')";

      // telling the database to run the statment
      trailDB.run(sqlRequest, function(err) {
        if(err){
          console.log(err);
          next(err);
            res.status(400).json("Sorry, something went wrong. Please try again.");
        }

        res.status(201).json(newtrail);
        // console.log(newtrail);

      });

    } else {
      res.status(400).json('Invalid input. Please try again.');
    }

  })
router.route('/auth/google')
  .get(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.me']}))
  .get('/callback',
      passport.authenticate('google', {failureRedirect: '/auth/google'}),
      function(req, res) {
        console.log(req);
        console.log(res);
        var sqlRequest = "INSERT INTO USER (username, email)" +
                         "VALUES ('" + res.username + "', '" + res.email + ")";
        userDB.run(sqlRequest, function(err) {
          if(err){
            console.log(err);
            next(err);
              res.status(400).json("Sorry, something went wrong. Please try again.");
          }
           console.log("complete - new user")
          // res.status(201).;
          // console.log(newtrail);

      });


  });

router.route('/login')
  .post(parseUrlencoded, function(req, res) {
    authFactory.getApplicationDefault(function(err, authClient) {
      if (err) {
        console.log('Authentication failed because of ', err);
        return;
      }
      if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        var scopes = ['accounts.google.com', 'https://accounts.google.com'];
        authClient = authClient.createScoped(scopes);
        var array = req.body.idtoken;
        console.log(authClient);
        // parseJwt(array)
        // console.log(parseJwt(array));
      }
      var array = req.body.idtoken;
      var decoded = jwtDecode(array);
      console.log(decoded);

    });

});

router.route('/oauthCallback')
  .get(function(req, res) {
  })
router.route('/user')
  .post(parseUrlencoded, function(req, res) {

  });
router.route('/trails')
  .get(function(req,res) {

      trailDB.all("SELECT * FROM trail ORDER BY trail_name;", function(err, rows) {
        if(err != null) {
          console.log(err);
          // next(err);
        } else {

          var unencodedRow;
          var unencodedRows = [];
          // Looping through each item and unecoding the none alpha/numerica characters
          for(var row in rows) {
            unencodedRow =  {
              id: rows[row].id,
              trail_name: unescape(rows[row].trail_name),
              description: unescape(rows[row].description),
              review: unescape(rows[row].review),
              username: unescape(rows[row].username),
              lat: rows[row].lat,
              long: rows[row].long
            }
            //Each row will be push in to the new array
            unencodedRows.push(unencodedRow);

          }
          // console.log(unencodedRows);
          // Sending the unencoded array to the view
          res.send(unencodedRows);

        }
      });
  });

router.route('/trails/:trail')
  .get(function(req, res) {
    var trail = req.params.trail;
    // console.log(trail);

    trailDB.get("SELECT trail_name, id FROM trail WHERE id = " + trail + ";", function(err,row) {
      if(err != null) {
        console.log(err);
        // next(err);
      } else {
        var unencodedRow = {
          trail_name: unescape(row.trail_name),
        }
      }

      res.send(unencodedRow);
    });
  });
router.route('/find')
  .get(function(req, res){

    var latInput;
    var lngInput;
    var distance;


      latInput = req.query.latInput;
      lngInput = req.query.lngInput;
      distance = req.query.distance;

    trailDB.all("SELECT trail_name, lat, long FROM trail WHERE abs(lat - (" + latInput +")) < "+ distance +" AND abs(long - (" + lngInput +")) < " + distance +" ORDER BY abs(lat - (" + latInput +")), abs(long - (" + lngInput +"));", function(err, rows) {
      if(err != null) {
        console.log(err);
        // next(err);
      } else {
        var unencodedRow;
        var unencodedRows = [];
        // Looping through each item and unecoding the none alpha/numerica characters
        for(var row in rows) {
          unencodedRow =  {
            trail_name: unescape(rows[row].trail_name),
            // distance: rows[row].distanceAway,
            lat: rows[row].lat,
            long: rows[row].long,
          }


          // console.log(distanceAway);
          //Each row will be push in to the new array
          unencodedRows.push(unencodedRow);

        }
        // Sending the unencoded array to the view
        // console.log(unencodedRows)
        // res.send(unencodedRows);
          res.status(201).json(unencodedRows);


      }
  })
  });



module.exports = router;
