'use strict';

var debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce');
const express = require('express');
const router = express.Router();

const Promise = require('bluebird');
const jsforce = require('jsforce');


//const oauth_login_url = 'https://test.salesforce.com';
const OAUTH_LOGIN_URL = 'https://login.salesforce.com';

const OAUTH_CONSUMER_KEY    = process.env.OAUTH_CONSUMER_KEY;
const OAUTH_CONSUMER_SECRET = process.env.OAUTH_CONSUMER_SECRET;
const OAUTH_CLIENT_USERNAME = process.env.OAUTH_CLIENT_USERNAME;
const OAUTH_CLIENT_PASSWORD = process.env.OAUTH_CLIENT_PASSWORD;


router.get('/auth', function(req, res, next) {
  res.render('salesforce/auth', {
    title: 'Auth',
    data: {}
  });
});

router.post('/auth', function(req, res, next) {
  // See: https://qiita.com/na0AaooQ/items/5c088a68ae43a1e74c6a

  const conn = new jsforce.Connection({
    oauth2: {
      loginUrl:     OAUTH_LOGIN_URL,
      clientId:     OAUTH_CONSUMER_KEY,
      clientSecret: OAUTH_CONSUMER_SECRET
    }
  });

  conn.login(OAUTH_CLIENT_USERNAME, OAUTH_CLIENT_PASSWORD, function(err, result) {
    const payload =  {
      title: 'Auth',
      data: {}
    };

    if (err) {
      console.error(err);
      payload.data.error = err;

    } else {
      console.log(result);
      payload.data.result = JSON.stringify(result, null, 2);
    }

    res.render('salesforce/auth', payload);
  });
});


router.get('/account/query', function(req, res, next) {
  res.render('salesforce/account/query', {
    title: 'Query Accounts',
    data: { params: {} }
  });
});

router.post('/account/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Query Account',
    data: { params: params }
  };

  let conn = null;

  Promise.resolve().then(function() {
    return loginAsync().then(function(connection, result) {
      conn = connection;
    });

  }).then(function() {
    return new Promise(function(resolve, reject) {
      // See: https://jsforce.github.io/document/#using-soql
      conn.query("SELECT Id, Name FROM Account", function(err, result) {
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

router.get('/account/create', function(req, res, next) {
  res.render('salesforce/account/create', {
    title: 'Create Account',
    data: { params: {} }
  });
});

router.post('/account/create', function(req, res, next) {
  debug('/account/create body', req.body);

  const params = req.body;
  const payload =  {
    title: 'Create Account',
    data: { params: params }
  };

  let conn = null;

  Promise.resolve().then(function() {
    return loginAsync().then(function(connection, result) {
      conn = connection;
    });

  }).then(function() {
    return new Promise(function(resolve, reject) {
      // See: https://jsforce.github.io/document/#create
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


function loginAsync() {
  const conn = new jsforce.Connection({
    oauth2: {
      loginUrl:     OAUTH_LOGIN_URL,
      clientId:     OAUTH_CONSUMER_KEY,
      clientSecret: OAUTH_CONSUMER_SECRET
    }
  });

  return new Promise(function(resolve, reject) {
    conn.login(OAUTH_CLIENT_USERNAME, OAUTH_CLIENT_PASSWORD, function(err, result) {
      if (err) reject(err);
      else resolve(conn, result);
    });
  });
}


module.exports = router;

