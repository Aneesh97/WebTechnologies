"use strict";
//ROUTES RELATED TO CONTACT FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');

//Render contact page
router.get('/', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('contact', {
    error: '',
    success: ''
  });
});

router.post('/', function(req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('contact', {
    error: '',
    success: 'Thank you ' + req.body.name + ' your message has been submitted. You will hear from us shortly!'
  });
});



module.exports = router;
