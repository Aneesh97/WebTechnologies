"use strict";
//MIDDLEWARE FOR ALL ROUTES
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var flash = require('connect-flash');
var middlewareObj = {};

//Open Database
middlewareObj.db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
});

//Generate random character string ie salt
middlewareObj.gen_random_string = function(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}

//Hash password with SHA512
middlewareObj.sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    }
}

//Check to see if the user is authenticated
middlewareObj.is_logged_in = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Not authenticated, redirecting...')
  req.flash('auth_error', 'You need to be logged in to access that!');
  res.redirect('/login');
}

module.exports = middlewareObj;
