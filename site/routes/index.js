"use strict";
//ROUTES RELATED TO LEARNING GENERAL FUNCTIONALITY
var express = require('express');
var router = express.Router();

//Render pages
router.get('/', function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('index');
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
