"use strict";
//ROUTES RELATED TO LEARNING TESTING FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');

//Render test page
router.get('/', mw.is_logged_in, function (req, res) {
  res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
  res.render('pers_test', {
    success: req.flash('success')
  });
});

//Update test results
router.put('/', function(req, res) {
  let o_val = req.body.o_val;
  let c_val = req.body.c_val;
  let e_val = req.body.e_val;
  let a_val = req.body.a_val;
  let n_val = req.body.n_val;
  var input_data = [o_val, c_val, e_val, a_val, n_val, 0, req.user.id];
  //Insert them into the DB
  mw.db.run('UPDATE userScores SET Oscore=?, Cscore=?, Escore=?, Ascore=?, Nscore=?, Wellbeing=? WHERE id=?',
  input_data, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("Successfully saved data");
  });
});

module.exports = router;
