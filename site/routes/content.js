"use strict";
//ROUTES RELATED TO LEARNING JOURNEY FUNCTIONALITY
var express = require('express');
var router = express.Router();
var mw = require('../middleware');
var flash = require('connect-flash');

router.get('/:contentid', mw.is_logged_in, function (req, res) {
  mw.db.get('SELECT url, prompt FROM content WHERE contentid = ?', req.params.contentid, function(err, row) {
    if (req.params.contentid === 'test') {
      res.redirect('/test')
    } else {
      res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
      res.render('content', {
        content_url: row.url,
        prompt: row.prompt
      });
    }
  });

});

module.exports = router;
