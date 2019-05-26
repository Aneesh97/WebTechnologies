"use strict";
//ROUTES RELATED TO LEARNING JOURNAL FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var uniqid = require('uniqid');
var flash = require('connect-flash');

router.get('/', mw.is_logged_in, function (req, res) {
  var uid = req.user.id;
  mw.db.all('SELECT prompt, entry, contentid FROM journal WHERE id = ? LIMIT 10', uid, function(err, rows) {
    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
    res.render('journal', {
      journal_entries: rows
    });
  });
});

//Save journal entry
router.post('/', function(req, res) {
  let journalId = uniqid();
  let uid = req.user.id;
  let prompt = req.body.prompt;
  let entry = req.body.thoughts;
  let timestamp = Date.now();
  let contentid = req.body.contentid;
  mw.db.run('INSERT INTO journal (journalid, id, prompt, entry, timestamp, contentid) VALUES (?, ?, ?, ?, ?, ?)',
  [journalId, uid, prompt, entry, timestamp, contentid],
  function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Journal entry saved successfully!");
    res.redirect('/journal');
  });
});

module.exports = router;
