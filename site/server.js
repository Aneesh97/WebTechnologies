"use strict";

var express       = require('express'),
    app           = express(),
    helmet        = require('helmet'),
    fs            = require('fs'),
    flash         = require('connect-flash'),
    crypto        = require('crypto'),
    passport      = require('passport'),
    bodyParser    = require('body-parser'),
    owasp         = require('owasp-password-strength-test'),
    validator     = require("validator"),
    uniqid        = require('uniqid'),
    LocalStrategy = require('passport-local'),
    sqlite3       = require('sqlite3').verbose(),
    mw            = require('./middleware');

var indexRoutes     = require('./routes/index'),
    authRoutes      = require('./routes/auth'),
    accountRoutes   = require('./routes/account'),
    journeyRoutes   = require('./routes/journey'),
    contentRoutes   = require('./routes/content'),
    journalRoutes   = require('./routes/journal'),
    testRoutes      = require('./routes/tests'),
    resultRoutes    = require('./routes/results'),
    contactRoutes   = require('./routes/contact'),
    cookiesRoutes   = require('./routes/cookies'),
    privacyRoutes   = require('./routes/privacy');

var banned = [];
banUpperCase("./public/", "");
// Define the sequence of functions to be called for each request
app.use(helmet());
app.use(ban);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

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
    username = username.toLowerCase();
    mw.db.get('SELECT salt FROM userCredentials WHERE username = ?', username, function(err, row) {
      if (!row) return done(null, false);
      //Hash the password with the salt
      var passwordData = mw.sha512(password, row.salt);
      var hash = passwordData.passwordHash;
      mw.db.get('SELECT username, id FROM userCredentials WHERE username = ? AND hash = ?', username, hash, function(err, row) {
        if (!row) return done(null, false);
        return done(null, row);
    });
  });
}));
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  mw.db.get('SELECT id, username FROM userCredentials WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/account', accountRoutes);
app.use('/journey', journeyRoutes);
app.use('/content', contentRoutes);
app.use('/journal', journalRoutes);
app.use('/test', testRoutes);
app.use('/', resultRoutes);
app.use('/contact', contactRoutes);
app.use('/cookies', cookiesRoutes);
app.use('/privacy', privacyRoutes);



app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

//Any other get routes that are unnaccounted for
app.get('*', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.status(404).render("notfound");
});

//----------------------------------------------------------------------------//
// FUNCTIONS
//----------------------------------------------------------------------------//

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
