"use strict";
//ROUTES RELATED TO LEARNING JOURNEY FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var flash = require('connect-flash');

router.get('/journey', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journey', {
    reg_success: req.flash('reg_success'),
    login_success: req.flash('success')
  });
});


router.get('/content', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('content', {
    content_url: "https://www.youtube.com/embed/NpEaa2P7qZI",
    prompt: "This is a test"
  });
});

module.exports = router;
