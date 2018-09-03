'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce:auth');
const express = require('express');
const router = express.Router();

const auth = require('../../lib/salesforce');


router.get('/', function(req, res, next) {
  res.render('salesforce/auth', {
    title: 'Auth',
    data: {}
  });
});

router.post('/', function(req, res, next) {
  //
  // See: https://qiita.com/na0AaooQ/items/5c088a68ae43a1e74c6a
  //
  const payload =  {
    title: 'Auth',
    data: {}
  };

  auth.loginAsync().then(function(result) {
    payload.data.result = JSON.stringify(result.result, null, 2);

  }).catch(function(err) {
    console.error(err);
    payload.data.error = err;

  }).finally(function() {
    res.render('salesforce/auth', payload);
  });
});


module.exports = router;

