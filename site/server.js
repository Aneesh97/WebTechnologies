"use strict";

var express = require("express");
var app = express();

var helmet = require('helmet');
var fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
var passport = require('passport');
var bodyParser = require('body-parser');
var owasp = require('owasp-password-strength-test');
var validator = require("validator");
var uniqid = require('uniqid');
var LocalStrategy = require('passport-local');

let db_username = "test";
var banned = [];
banUpperCase("./public/", "");
// Define the sequence of functions to be called for each request
app.use(helmet());
app.use(ban);
app.use( bodyParser.json() );
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
    //Get the salt attached to the username
    db.get('SELECT salt FROM userCredentials WHERE username = ?', username, function(err, row) {
      if (!row) return done(null, false);
      //Hash the password with the salt
      var passwordData = sha512(password, row.salt);
      var hash = passwordData.passwordHash;
      db.get('SELECT username, id FROM userCredentials WHERE username = ? AND hash = ?', username, hash, function(err, row) {
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
  res.render('index');
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
  res.render('content', {
    content_url: "https://www.youtube.com/embed/NpEaa2P7qZI",
    prompt: "This is a test"
  });
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
  var uid = req.user.id;
  db.get('SELECT Oscore, Cscore, Escore, Ascore, Nscore FROM userScores WHERE id = ?', uid, function(err, row) {
    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
    res.render('results', {
      o_val: row.Oscore,
      c_val: row.Cscore,
      e_val: row.Escore,
      a_val: row.Ascore,
      n_val: row.Nscore
    });
  });
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

//Account session functionality
app.post('/register', function(req, res) {
  var uStr = req.body.username;
  var email = req.body.email;
  var pStr = req.body.password;
  var cStr = req.body.conf_password;
  var result = owasp.test(pStr);
  console.log(uStr+' '+email+' '+pStr+' '+cStr);
  //Check email is valid & passwords are the same & password is valid & username contains only numbers and letters
  if (validator.isEmail(email) && pStr === cStr && result.strong && validator.isAlphanumeric(uStr)) {
    console.log("Passed all checks, registering...")
    var uid = uniqid();
    var salt = gen_random_string(16);
    var passwordData = sha512(pStr, salt);
    var hash = passwordData.passwordHash;
    db.run('INSERT INTO userCredentials (id, username, email, hash, salt) VALUES (?, ?, ?, ?, ?)',
    [uid, uStr, email, hash, salt],
    function (err) {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      db.run('INSERT INTO userScores (id, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, 0, 0, 0, 0, 0, 0], function(err) {
        if (err) {
          console.log(err);
          return res.render('register');
        }
        console.log("Account created successfully!");
        passport.authenticate("local")(req, res, function() {
          console.log("Authenticated, redirecting...")
          res.redirect('/journey');
        });
      });
    });
  }
  else {
    return res.render('register');
  }
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

//Save results
app.post('/test', function(req, res) {
  console.log("test request is called!");
  let o_val = req.body.o_val;
  let c_val = req.body.c_val;
  let e_val = req.body.e_val;
  let a_val = req.body.a_val;
  let n_val = req.body.n_val;
  var input_data = [o_val, c_val, e_val, a_val, n_val, 0, req.user.id];
  //Insert them into the DB
  db.run('UPDATE userScores SET Oscore=?, Cscore=?, Escore=?, Ascore=?, Nscore=?, Wellbeing=? WHERE id=?',
  input_data, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("Successfully saved data");
  });
});
//Save journal entry
app.post('/content', function(req, res) {
  console.log("test request is called!");
  let journalId = uniqid();
  let uid = req.user.id;
  let prompt = req.body.prompt;
  let entry = req.body.thoughts;
  let timestamp = Date.now();
  let content = req.body.content_url;
  db.run('INSERT INTO journal (journalid, id, prompt, entry, timestamp, content) VALUES (?, ?, ?, ?, ?, ?)',
  [journalId, uid, prompt, entry, timestamp, content],
  function (err) {
    if (err) {
      console.log(err);
      return res.render('content');
    }
    console.log("Journal entry saved successfully!");
    res.redirect('/journal');
  });
});
//iu8lM?n589hB
//----------------------------------------------------------------------------//
// FUNCTIONS
//----------------------------------------------------------------------------//

//Generate random character string ie salt
function gen_random_string (length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}
//Hash password with SHA512
function sha512 (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    }
}
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
