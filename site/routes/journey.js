"use strict";
//ROUTES RELATED TO LEARNING JOURNEY FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var flash = require('connect-flash');

router.get('/', mw.is_logged_in, function (req, res) {
  mw.db.all('SELECT contentid, image, title, description FROM content LIMIT 3', function(err, rows) {
    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
    res.render('journey', {
      success: req.flash('success'),
      im0: rows[0].image,
      c0: rows[0].contentid,
      t0: rows[0].title,
      d0: rows[0].description,
      im1: rows[1].image,
      c1: rows[1].contentid,
      t1: rows[1].title,
      d1: rows[1].description,
      im2: rows[2].image,
      c2: rows[2].contentid,
      t2: rows[2].title,
      d2: rows[2].description,
    });
  });

});

module.exports = router;
