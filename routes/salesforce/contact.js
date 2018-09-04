'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce:contact');
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const salesforce = require('../../lib/salesforce');


router.get('/query', function(req, res, next) {
  res.render('salesforce/contact/query', {
    title: 'Query Contacts',
    data: { params: {} }
  });
});

router.post('/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Query Contacts',
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
      // See: https://jsforce.github.io/document/#using-query-method-chain
      //
      let query = conn.sobject('Contact');

      query = query.find(
        { // Condition
        },
        { // Fields
          Id: 1,
          Name: 1,
          Email: 1,
          CreatedDate: 1
        }
      );

      query.limit(10);
      query.sort({ CreatedDate: -1 });

      query.execute(function(err, result) {
        debug('conn.sobject Contact.find', result);

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
    res.render('salesforce/contact/query', payload);
  });
});

router.get('/find', function(req, res, next) {
  res.render('salesforce/contact/find', {
    title: 'Find Contact',
    data: { params: {} }
  });
});

router.post('/find', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Find Contacts',
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
      // See: https://jsforce.github.io/document/#using-query-method-chain
      //
      let query = conn.sobject('Contact');

      query = query.find(
        { // Condition
          Email: params.email
        },
      );

      query.limit(1);
      query.sort({ CreatedDate: -1 });

      query.execute(function(err, result) {
        debug('conn.sobject Contact.find', result);

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
    res.render('salesforce/contact/find', payload);
  });
});

router.get('/create', function(req, res, next) {
  res.render('salesforce/contact/create', {
    title: 'Create Contact',
    data: { params: {} }
  });
});

router.post('/create', function(req, res, next) {
  debug('/contact/create body', req.body);

  const params = req.body;
  const payload =  {
    title: 'Create Contact',
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
        Email: params.email
      };

      conn.sobject('Contact').create(p, function(err, result) {
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
    res.render('salesforce/contact/create', payload);
  });
});


module.exports = router;

