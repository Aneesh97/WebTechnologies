"use strict";

var express = require("express");
var app = express();

var helmet = require('helmet');
var fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');

let db_username = "test";
var banned = [];
banUpperCase("./public/", "");
// Define the sequence of functions to be called for each request
app.use(helmet());
app.use(ban);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Merudite is the best website",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    // db.get('SELECT salt FROM userCredentials WHERE username = ?', username, function(err, row) {
    //   if (!row) return done(null, false);
    //   var hash = hashPassword(password, row.salt);
      db.get('SELECT username, password FROM userCredentials WHERE username = ? AND password = ?', username, password, function(err, row) {
        if (!row) return done(null, false);
        console.log(row.password);
        return done(null, row);
    });
  // });
}));

// function hashPassword(password, salt) {
//   var hash = crypto.createHash('sha256');
//   hash.update(password);
//   hash.update(salt);
//   return hash.digest('hex');
// }
passport.serializeUser(function(user, done) {
  return done(null, user.password);
});
passport.deserializeUser(function(password, done) {
  db.get('SELECT password, username FROM userCredentials WHERE password = ?', password, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

//Open Database
let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

//----------------------------------------------------------------------------//
// NON-AUTHENTICATED ROUTING
//----------------------------------------------------------------------------//

app.get('/', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('index', {db_output: db_username});
});
app.get('/product', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('product');
});
app.get('/about', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('about');
});
app.get('/login', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('login');
});
app.get('/register', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register');
});
app.get('/register', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register');
});

//----------------------------------------------------------------------------//
// AUTHENTICATED ROUTING
//----------------------------------------------------------------------------//

app.get('/account', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('account');
});
app.get('/content', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('content');
});
app.get('/journal', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journal');
});
app.get('/journey', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journey');
});
app.get('/test', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('pers_test');
});
app.get('/results', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('results');
});
app.get('/review', is_logged_in, function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('review');
});

//----------------------------------------------------------------------------//
// OTHER ROUTING
//----------------------------------------------------------------------------//

//Ban doubleslash
app.get('*//*', function (req, res) {
  console.log("double backslash request");
  res.status(404).send("Double slash blocked");
});

//Account session fucntionality
app.post('/register', function(req, res) {
  var usernameStr = req.body.username;
  var passwordStr = req.body.password;
  console.log(usernameStr + " " + passwordStr);
  db.run('INSERT INTO userCredentials (username, password) VALUES (?, ?)', [usernameStr, passwordStr], function (err) {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      console.log("No error with user creation");
      passport.authenticate("local")(req, res, function() {
        res.redirect('journey');
      });
  });
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/journey',
  failureRedirect: '/login'
}), function(req, res) {

});
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//Check to see if the user is authenticated
function is_logged_in(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Not authenticated, redirecting...')
  res.redirect('/login');
}

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


// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });
