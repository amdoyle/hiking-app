var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trail.db');

db.serialize(function() {
  db.run("CREATE TABLE trail (id INT, time INT, trail_name TEXT, location INT, description TEXT, review TEXT, username TEXT)");

  var stmt = db.prepare("INSERT INTO trail VALUES(?, ?, ?, ?, ?, ?, ?)");
  // 
  // for(var i = 0; i < 10; i++) {
  //   var d = new Date();
  //   var n = d.toLocaleTimeString();
  //   var t = "Some name";
  //   stmt.run(i, n, t)
  //   console.log(stmt);
  // }
  //
  // stmt.finalize();
  //
  // db.each("SELECT * FROM trail WHERE time < '5:56:30PM' LIMIT 1;", function(err, row) {
  //   console.log(row.id + ": " + row.trail_name + " " + row.time);
  // });

  // db.run("DROP TABLE trail");

});
db.close();

module.exports = db;
