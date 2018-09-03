'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce:lead');
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const salesforce = require('../../lib/salesforce');


router.get('/query', function(req, res, next) {
  res.render('salesforce/lead/query', {
    title: 'Query Leads',
    data: { params: {} }
  });
});

router.post('/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Query Leads',
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
      // See: https://jsforce.github.io/document/#using-query-method-chain
      //
      let query = conn.sobject('Lead');

      query = query.find(
        { // Condition
        },
        { // Fields
          Id: 1,
          Name: 1,
          Company: 1,
          Email: 1,
          CreatedDate: 1
        }
      );

      query.limit(10);
      query.sort({ CreatedDate: -1 });

      query.execute(function(err, result) {
        debug('conn.sobject find', result);

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
    res.render('salesforce/lead/query', payload);
  });
});

router.get('/create', function(req, res, next) {
  res.render('salesforce/lead/create', {
    title: 'Create Lead',
    data: { params: {} }
  });
});

router.post('/create', function(req, res, next) {
  debug('create body', req.body);

  const params = req.body;
  const payload =  {
    title: 'Create Lead',
    data: { params: params }
  };

  let conn = null;

  Promise.resolve().then(function() {
    return salesforce.loginAsync().then(function(result) {
      conn = result.conn;
    });

  }).then(function() {
    return new Promise(function(resolve, reject) {
      const p = {
        LastName: params.lastName,
        Company: params.company,
        Email: params.email
      };

      conn.sobject('Lead').create(p, function(err, result) {
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
    res.render('salesforce/lead/create', payload);
  });
});


module.exports = router;

