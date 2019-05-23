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
    auth_error: req.flash('auth_error'),
    login_error: req.flash('error')
  });
});
router.get('/register', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('register', {
    reg_error: req.flash('reg_error')
  });
});

//Register a new account
router.post('/register', function(req, res) {
  var uStr = req.body.username;
  var email = req.body.email;
  var pStr = req.body.password;
  var cStr = req.body.conf_password;
  var result = owasp.test(pStr);
  //Check email is valid & passwords are the same & password is valid & username contains only numbers and letters
  if (validator.isEmail(email) && pStr === cStr && result.strong && validator.isAlphanumeric(uStr)) {
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
          reg_error: 'Something went wrong... Please try again!'
        });
      }
      mw.db.run('INSERT INTO userScores (id, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, 0, 0, 0, 0, 0, 0], function(err) {
        if (err) {
          console.log(err);
          return res.render('register', {
            reg_error: 'Something went wrong... Please try again!'
          });
        }
        console.log("Account created successfully!");
        passport.authenticate("local")(req, res, function() {
          console.log("Authenticated, redirecting...")
          req.flash('reg_success', 'Account creation successful! Welcome ' + req.user.username + '!');
          res.redirect('/journey');
        });
      });
    });
  }
  else {
    return res.render('register', {
      reg_error: 'Something went wrong... Please try again!'
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
  req.flash('logout_success', 'Successfully logged out!');
  res.redirect('/');
});

module.exports = router;
