"use strict";

var express = require("express");
var app = express();
//Helmet provides some security stuff
var helmet = require('helmet');
var fs = require("fs");
// const sqlite3 = require('sqlite3').verbose();

// // open the database
// let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the database.');
// });
//
// db.serialize(() => {
//   db.each(`SELECT id as id,
//                   username as username
//            FROM users`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.username);
//   });
// });
//
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

var banned = [];
banUpperCase("./public/", "");

// Define the sequence of functions to be called for each request
app.use(helmet());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

app.get('/', function (req, res) {
  console.log("request");
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('index');
})

app.get('/product', function (req, res) {
  console.log("request");
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('product');
})

//Ban doubleslash
app.get('*//*', function (req, res) {
  console.log("double backslash request");
  res.status(404).send("Double slash blocked");
})

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Ban files/subfolders with non-lowercase names.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}
