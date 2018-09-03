'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce:account');
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const salesforce = require('../../lib/salesforce');


router.get('/query', function(req, res, next) {
  res.render('salesforce/account/query', {
    title: 'Query Accounts',
    data: { params: {} }
  });
});

router.post('/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Query Account',
    data: { params: params }
  };

  let conn = null;

  Promise.resolve().then(function() {
    return salesforce.loginAsync().then(function(result) {
      debug('loginAsync result', result.result);
      conn = result.conn;
    });

  }).then(function() {
    return new Promise(function(resolve, reject) {
      //
      // See: https://jsforce.github.io/document/#using-soql
      //
      conn.query("SELECT Id, Name FROM Account", function(err, result) {
        debug('conn.query', result);

        if (err) {
          console.error(result);
          reject(err);

        } else {
          payload.data.result = JSON.stringify(result, null, 2);
          resolve();
        }
      });
    });

  }).catch(function(err) {
    console.error(err);
    payload.data.error = err;

  }).finally(function() {
    res.render('salesforce/account/query', payload);
  });
});

router.get('/create', function(req, res, next) {
  res.render('salesforce/account/create', {
    title: 'Create Account',
    data: { params: {} }
  });
});

router.post('/create', function(req, res, next) {
  debug('/account/create body', req.body);

  const params = req.body;
  const payload =  {
    title: 'Create Account',
    data: { params: params }
  };

  let conn = null;

  Promise.resolve().then(function() {
    return salesforce.loginAsync().then(function(result) {
      conn = result.conn;
    });

  }).then(function() {
    return new Promise(function(resolve, reject) {
      //
      // See: https://jsforce.github.io/document/#create
      //
      const p = {
        Name: params.name
      };

      conn.sobject("Account").create(p, function(err, result) {
        if (err || !result.success) {
          console.error(result);
          reject(err);

        } else {
          payload.data.result = JSON.stringify(result, null, 2);
          resolve();
        }
      });
    });

  }).catch(function(err) {
    console.error(err);
    payload.data.error = err;

  }).finally(function() {
    res.render('salesforce/account/create', payload);
  });
});


module.exports = router;

