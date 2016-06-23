// Require the express dependencies to help build routes
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trail.db');
// Declaring other variables
// The var port is set to list to to the port specified in the ENV variable or on 8080
var port = process.env.PORT || 8080;

// Create an express app using an instance of express
var app = express();

// Initializing SQLite3 database
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS trail (trail_name TEXT, lat FLOAT, long FLOAT, description TEXT, review TEXT, username TEXT)");
      // db.close();
});

// Tell express to serve the files within the public folder - ie. CSS and JS
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Create an express route to the home page
app.get('/trails', function(req,res) {
  console.log("get");
  // res.sendFile(path.join(__dirname + "/public" + "/index.html"));
    db.all("SELECT * FROM trail ORDER BY trail_name;", function(err, rows) {
      if(err != null) {
        console.log(err);
        // next(err);
      } else {
        console.log(rows);
          // res.sendFile(path.join(__dirname + "/public" + "/index.html"), function(err, html) {
          res.send(rows);
        // });
      }

      console.log(db.each('SELECT * FROM trail'));
    });
});

app.post("/trails", function(req, res, next) {
  console.log("post");


// Currently escaping an ' in the statments for a database - will need to look for options that is less hacky
  var name = req.body.trailName.replace("'","\''");
  var inputLat = req.body.lat;
  var inputLong = req.body.long;
  var descrip = req.body.description.replace("''","\''");
  var rev = req.body.review.replace("'","\''");
  var user = req.body.username.replace("'","\''");

  console.log(name + " " + inputLat + " " + inputLong + " " + descrip + " " + rev + " " + user);
  sqlRequest = "INSERT INTO TRAIL (trail_name, lat, long, description, review, username)" +
               "VALUES ('" + name + "', '" + inputLat + "', '" + inputLong + "', '" + descrip
               + "', '" + rev + "', '" + user + "')";


  db.each(sqlRequest, function(err) {
    console.log("db function");
    if(err !== null) {
      console.log('error');
      next(err);
    } else {
      console.log(trailName + "has been inserted into the db");
      res.redirect('/');
    }

  });

  res.redirect('/');
  // db.close();
});

// db.close();
// Start the server
app.listen(port, function() {
  // Console log that the server is started!
  console.log("Magic is happening on port 8080");
});
