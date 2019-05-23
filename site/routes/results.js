"use strict";
//ROUTES RELATED TO LEARNING RESULTS FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');

//Render results page
router.get('/results', mw.is_logged_in, function (req, res) {
  var uid = req.user.id;
  mw.db.get('SELECT Oscore, Cscore, Escore, Ascore, Nscore FROM userScores WHERE id = ?', uid, function(err, row) {
    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
    res.render('results', {
      o_val: row.Oscore,
      c_val: row.Cscore,
      e_val: row.Escore,
      a_val: row.Ascore,
      n_val: row.Nscore
    });
  });
});

//Render review page
router.get('/review', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('review');
});

module.exports = router;
