"use strict";
//ROUTES RELATED TO LEARNING JOURNEY FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var flash = require('connect-flash');

router.get('/', mw.is_logged_in, function (req, res) {
  mw.db.all('SELECT contentid, image FROM content LIMIT 3', function(err, rows) {
    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
    res.render('journey', {
      success: req.flash('success'),
      im0: '/assets/placeholder.svg',
      c0: rows[0].contentid,
      im1: '/assets/placeholder.svg',
      c1: rows[1].contentid,
      im2: '/assets/placeholder.svg',
      c2: rows[2].contentid
    });
  });

});

module.exports = router;
