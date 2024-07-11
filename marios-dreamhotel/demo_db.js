var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin123",
 database: "hotel_booking"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
