"use strict";
//ROUTES RELATED TO LEARNING ACCOUNT FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var validator = require("validator");
var owasp = require('owasp-password-strength-test');

//Render account page
router.get('/', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('account');
});

//Update account info
router.put('/', function(req, res) {
  let uid = req.user.id;
  let password = req.body.password;
  let new_password = req.body.new_password;
  let new_username = req.body.new_username;
  let new_email = req.body.new_email;
  // Get the salt attached to the uid
  mw.db.get('SELECT salt FROM userCredentials WHERE id = ?', uid, function(err, row) {
    if (!row) return res.render('account');
    //Hash the password with the salt
    var passwordData = mw.sha512(password, row.salt);
    var hash = passwordData.passwordHash;
    //AUTHENTICATE
    mw.db.get('SELECT username FROM userCredentials WHERE id = ? AND hash = ?', uid, hash, function(err, row) {
      if (!row) return res.render('account');
      //PASSWORD UPDATE
      var result = owasp.test(new_password);
      if (result.strong) {
        var new_salt = mw.gen_random_string(16);
        var passwordData = mw.sha512(new_password, new_salt);
        var new_hash = passwordData.passwordHash;
        mw.db.run('UPDATE userCredentials SET hash=?, salt=? WHERE id=?',
        [new_hash, new_salt, uid], function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully updated password!");
        });
      }
      //USERNAME UPDATE
      if (validator.isAlphanumeric(new_username)) {
        mw.db.run('UPDATE userCredentials SET username=? WHERE id=?',
        [new_username, uid], function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully updated username!");
        });
      }
      //EMAIL UPDATE
      if (validator.isEmail(new_email)) {
        mw.db.run('UPDATE userCredentials SET email=? WHERE id=?',
        [new_email, uid], function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully updated email!");
        });
      }
    });
  });
  console.log("All done, refreshing...");
  res.redirect('/journey');
});

//Delete account
router.delete('/', function(req, res) {
  let uid = req.user.id;
  let password = req.body.password;
  mw.db.get('SELECT salt FROM userCredentials WHERE id = ?', uid, function(err, row) {
    if (!row) return res.render('account');
    //Hash the password with the salt
    var passwordData = mw.sha512(password, row.salt);
    var hash = passwordData.passwordHash;
    //AUTHENTICATE
    mw.db.get('SELECT username FROM userCredentials WHERE id = ? AND hash = ?', uid, hash, function(err, row) {
      mw.db.run('DELETE FROM userCredentials WHERE id=?', [uid], function(err) {
        if (err) {
          console.log(err);
        }
        console.log("Successfully deleted credentials!");
      });
      mw.db.run('DELETE FROM userScores WHERE id=?', [uid], function(err) {
        if (err) {
          console.log(err);
        }
        console.log("Successfully deleted scores!");
      });
      mw.db.run('DELETE FROM journal WHERE id=?', [uid], function(err) {
        if (err) {
          console.log(err);
        }
        console.log("Successfully deleted journal!");
      });
    });
  });
  req.logout();
  res.redirect('/');
});

module.exports = router;
