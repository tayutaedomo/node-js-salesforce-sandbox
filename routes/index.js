'use strict';

var express = require('express');
var router = express.Router();

var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});


router.get('/ipify', function(req, res, next) {
  const payload =  {
    title: 'ipify',
    data: {}
  };


  const options = {
    url: 'http://api.ipify.org',
  };

  if (process.env.PROXY_URL) options.proxy = process.env.PROXY_URL;

  request(options, function (error, response, body) {
    if (error) {
      console.error('error:', error);
      payload.data.error = error;

    } else {
      payload.data.result = body
    }

    res.render('ipify/get', payload);
  });
});


module.exports = router;

