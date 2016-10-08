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

// *******************************************************************************//
trailDB.serialize(function() {
  trailDB.run("CREATE TABLE IF NOT EXISTS trail (id INTEGER PRIMARY KEY, trail_name TEXT, lat FLOAT, long FLOAT, description TEXT, review TEXT, user_id INTEGER)");
  // trailDB.run("DROP TABLE trail");
});
userDB.serialize(function() {
  userDB.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, username TEXT NOT NULL, email TEXT NOT NULL, auth_client TEXT NOT NULL, token_id VARCHAR(100) NOT NULL, picture_url VARCHAR(150) NOT NULL, CONSTRAINT token_id UNIQUE (id, token_id, email))");
  // userDB.run("DROP TABLE user");
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
        // var array = req.body.idtoken;
      }
      var array = req.body.idtoken;
      var decoded = jwtDecode(array);
      var tokenId = decoded['sub'];
      var name = decoded['given_name'];
      var email = decoded['email'];
      var auth = decoded['iss']=== scopes[0] || decoded['iss'] === scopes[1] ? 'google' : false;
      var pictureUrl = decoded['picture'];

      console.log(auth);

      function userExist(id) {
        userDB.get("SELECT * FROM user WHERE token_id = " + id + " ;", function(err, row) {
          console.log(err);
          console.log(row);
          console.log(id);
        if(row == []) {
          console.log('false');

        } else {
          console.log(row);
        }
      });
    }

      if(clientId === decoded['aud'] && auth === 'google' && decoded['exp'] > decoded['iat']) {

          if(userExist(tokenId)){
            console.log("user exists"); }
          } else {
            var sqlRequest = "INSERT INTO USER (username, email, auth_client, token_id, picture_url)" +
                             "VALUES ('" + name + "', '" + email + "', '" + auth + "','" + tokenId +  " ', '" + pictureUrl + "')";

             userDB.run(sqlRequest, function(err) {
               if(err){
                 console.log(err);
                   res.status(400).json("Sorry, something went wrong. Please try again.");
                 }

               res.status(201).json(name);
               console.log(name);

            });
          }

      }

    });

});

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
