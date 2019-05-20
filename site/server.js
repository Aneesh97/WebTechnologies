"use strict";

var express = require("express");
var app = express();
//Helmet provides some security stuff
var helmet = require('helmet');
var fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize'),
  passportLocalSequelize = require('passport-local-sequelize');

let db_username = "test";

// open the database
let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// db.serialize(() => {
//   db.each(`SELECT id as id,
//                   username as username
//            FROM userCredentials`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     db_username = row.username;
//     console.log(row.id + "\t" + row.username);
//   });
// });



var banned = [];
banUpperCase("./public/", "");

// Define the sequence of functions to be called for each request
app.use(helmet());
app.use(ban);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(require("express-session")({
  secret: "Merudite is the best website",
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}
passport.use(new LocalStrategy(function(username, password, done) {
  console.log(username);
  console.log(password);
  return done(null, 'abcde');
  db.get('SELECT salt FROM userCredentials WHERE username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM userCredentials WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});



app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

//----------------------------------------------------------------------------//
//ROUTING
//----------------------------------------------------------------------------//

//Landing side

app.get('/', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('index', {db_output: db_username});
})
app.get('/product', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('product');
})
app.get('/about', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('about');
})
app.get('/login', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('login');
})
app.get('/register', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register');
})

app.get('/register', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register');
})

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

app.post('/login', passport.authenticate("local"), function(req, res) {

})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/journey',
  failureRedirect: '/login'
}), function(req, res) {
});


//Functionality side

app.get('/account', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('account');
})
app.get('/content', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('content');
})
app.get('/journal', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journal');
})
app.get('/journey', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journey');
})
app.get('/test', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('pers_test');
})
app.get('/results', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('results');
})
app.get('/review', function (req, res) {
  console.log("Req: " + req.url);
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('review');
})


//Aneesh TODO: Format the other pages in EJS template
//             Keep looking into username/password authentication

//Other routing

//Ban doubleslash
app.get('*//*', function (req, res) {
  console.log("double backslash request");
  res.status(404).send("Double slash blocked");
})

// Login link with database


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
