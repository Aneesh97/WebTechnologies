"use strict";
//ROUTES RELATED TO LEARNING GENERAL FUNCTIONALITY
var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

//Render pages
router.get('/', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('index', {
    success: req.flash('success')
  });
});
router.get('/product', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('product');
});
router.get('/about', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('about');
});

module.exports = router;
