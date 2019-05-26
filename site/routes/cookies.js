"use strict";
//ROUTES RELATED TO CONTACT FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');

//Render contact page
router.get('/', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('cookies', {
    error: req.flash('error'),
    success: req.flash('success')
  });
});



module.exports = router;
