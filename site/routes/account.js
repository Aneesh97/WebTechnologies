"use strict";
//ROUTES RELATED TO LEARNING ACCOUNT FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var validator = require("validator");
var owasp = require('owasp-password-strength-test');
var flash = require('connect-flash');

//Render account page
router.get('/', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('account', {
    error: req.flash('error'),
    success: req.flash('success')
  });
});

//Update account info
router.post('/', function(req, res) {
  let uid = req.user.id;
  let password = req.body.password;
  let new_password = req.body.new_password;
  let new_username = req.body.new_username;
  new_username = new_username.toLowerCase();
  let new_email = req.body.new_email;
  // Get the salt attached to the uid
  mw.db.get('SELECT salt FROM userCredentials WHERE id = ?', uid, function(err, row) {
    //Hash the password with the salt
    var passwordData = mw.sha512(password, row.salt);
    var hash = passwordData.passwordHash;
    //AUTHENTICATE
    mw.db.get('SELECT username FROM userCredentials WHERE id = ? AND hash = ?', uid, hash, function(err, row) {
      if (!row) {
        console.log('Incorrect password.');
        return res.render('account', {
          error: 'Incorrect password. Try again...',
          success: ''
        });
      }
      //PASSWORD UPDATE
      if (new_password && new_password.length > 0) {
        update_password(uid, new_password);
      }
      //USERNAME UPDATE
      if (new_username && new_username.length > 0) {
        update_username(uid, new_username);
      }
      //EMAIL UPDATE
      if (new_email && new_email.length > 0) {
        update_email(uid, new_email);
      }
      console.log("All done, refreshing...");
      res.render('account', {
        error: '',
        success: 'Account updated successfully!'
      });
    });
  });
});

function update_password(uid, new_password) {
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
}
function update_username(uid, new_username) {
  if (validator.isAlphanumeric(new_username)) {
    //Check the new username isn't in use use by any user
    mw.db.get('SELECT id FROM userCredentials WHERE username = ?', new_username, function(err, row) {
      if (!row) {
        mw.db.run('UPDATE userCredentials SET username=? WHERE id=?',
        [new_username, uid], function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully updated username!");
        });
      }
    });
  }
}
function update_email(uid, new_email) {
  if (validator.isEmail(new_email)) {
    //Check the new email isn't in use by any user
    mw.db.get('SELECT id FROM userCredentials WHERE email = ?', new_email, function(err, row) {
      if (!row) {
        mw.db.run('UPDATE userCredentials SET email=? WHERE id=?',
        [new_email, uid], function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully updated email!");
        });
      }
    });
  }
}

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
  req.flash('success', 'Account successfully deleted.')
  res.redirect('/');
});

module.exports = router;
