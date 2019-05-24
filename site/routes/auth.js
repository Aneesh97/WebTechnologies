"use strict";
//ROUTES RELATED TO LEARNING AUTH FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var uniqid = require('uniqid');
var passport = require('passport');
var validator = require("validator");
var owasp = require('owasp-password-strength-test');
var flash = require('connect-flash');

//Render auth pages
router.get('/login', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('login', {
    error: req.flash('error')
  });
});
router.get('/register', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register', {
    error: req.flash('error')
  });
});

//Register a new account
router.post('/register', function(req, res) {
  var uStr = req.body.username;
  uStr = uStr.toLowerCase();
  var email = req.body.email;
  var pStr = req.body.password;
  var cStr = req.body.conf_password;
  var result = owasp.test(pStr);
  //Check email is valid & passwords are the same & password is valid & username contains only numbers and letters
  if (validator.isEmail(email) && pStr === cStr && result.strong && validator.isAlphanumeric(uStr)) {
    //Check that no user already exists for the given username/email
    mw.db.get('SELECT id FROM userCredentials WHERE username = ? OR email = ?', uStr, email, function(err, row) {
      if (!row) {
        console.log("Passed all checks, registering...")
        var uid = uniqid();
        var salt = mw.gen_random_string(16);
        var passwordData = mw.sha512(pStr, salt);
        var hash = passwordData.passwordHash;
        mw.db.run('INSERT INTO userCredentials (id, username, email, hash, salt) VALUES (?, ?, ?, ?, ?)',
        [uid, uStr, email, hash, salt],
        function (err) {
          if (err) {
            console.log(err);
            return res.render('register', {
              error: 'Something went wrong... Please try again!'
            });
          }
          mw.db.run('INSERT INTO userScores (id, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uid, 0, 0, 0, 0, 0, 0], function(err) {
            if (err) {
              console.log(err);
              return res.render('register', {
                error: 'Something went wrong... Please try again!'
              });
            }
            console.log("Account created successfully!");
            passport.authenticate("local")(req, res, function() {
              console.log("Authenticated, redirecting...")
              req.flash('success', 'Account creation successful! Welcome ' + req.user.username + '!');
              res.redirect('/test');
            });
          });
        });
      }
      else {
        return res.render('register', {
          error: 'There\'s already a user with that name or email!'
        });
      }
    });
  }
  else {
    return res.render('register', {
      error: 'Something went wrong... Please try again!'
    });
  }
});

//Log In to an existing account
router.post('/login', passport.authenticate('local', {
  successRedirect: '/journey',
  successFlash: 'Welcome back!',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.'
}), function(req, res) {

});

//Log out of an existing account
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Successfully logged out!');
  res.redirect('/');
});

module.exports = router;
