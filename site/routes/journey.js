"use strict";
//ROUTES RELATED TO LEARNING JOURNEY FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');

router.get('/journey', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('journey');
});


router.get('/content', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('content', {
    content_url: "https://www.youtube.com/embed/NpEaa2P7qZI",
    prompt: "This is a test"
  });
});

module.exports = router;
