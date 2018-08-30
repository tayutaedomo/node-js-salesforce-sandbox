'use strict';

const express = require('express');
const router = express.Router();

const jsforce = require('jsforce');


//const oauth_login_url = 'https://test.salesforce.com';
const OAUTH_LOGIN_URL = 'https://login.salesforce.com';

const OAUTH_CONSUMER_KEY    = process.env.OAUTH_CONSUMER_KEY;
const OAUTH_CONSUMER_SECRET = process.env.OAUTH_CONSUMER_SECRET;
const OAUTH_CLIENT_USERNAME = process.env.OAUTH_CLIENT_USERNAME;
const OAUTH_CLIENT_PASSWORD = process.env.OAUTH_CLIENT_PASSWORD;


router.get('/auth', function(req, res, next) {
  res.render('salesforce/auth', { title: 'Auth', data: {} });
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


module.exports = router;

