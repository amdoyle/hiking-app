var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var sqlite3 = require('../node_modules/sqlite3').verbose();
var validator = require('validator');
var db = new sqlite3.Database('./trail.db');


db.serialize(function() {
  db.run("CREATE TABLE IF  NOT EXISTS trail (trail_name TEXT, lat FLOAT, long FLOAT, description TEXT, review TEXT, username TEXT)");
      // db.close();
  // db.run("DROP TABLE trail");
});


router.route('/')
  .get(function(req, res) {
    return res.sendFile(path.join(__dirname + "/../views/index.html"));
  })
  .post(parseUrlencoded, function(req, res, next) {
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
      db.run(sqlRequest, function(err) {
        if(err){
          console.log(err);
          next(err);
            res.status(400).json("Sorry, something went wrong. Please try again.");
        }


        //  res.send("Success your trail has been saved");
        res.status(201).json(newtrail);

      });

    } else {
      res.status(400).json('Invalid input. Please try again.');
    }

  });

router.route('/trails')
  .get(function(req,res) {

      db.all("SELECT * FROM trail ORDER BY trail_name;", function(err, rows) {
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
              description: unescape(rows[row].description),
              review: unescape(rows[row].review),
              username: unescape(rows[row].username),
              lat: rows[row].lat,
              long: rows[row].long
            }
            //Each row will be push in to the new array
            unencodedRows.push(unencodedRow);

          }
          // Sending the unencoded array to the view
          res.send(unencodedRows);

        }
      });
  })
  .post(function(req, res) {

  })

module.exports = router;
