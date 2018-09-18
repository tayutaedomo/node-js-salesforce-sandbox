'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:routes:salesforce:chatter');
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const salesforce = require('../../lib/salesforce');


router.get('/me', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Chatter Me',
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
      // See: https://jsforce.github.io/document/#chatter-api
      //
      conn.chatter.resource('/users/me').retrieve(function(err, result) {
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
    res.render('salesforce/chatter/me', payload);
  });
});


router.get('/group/post', function(req, res, next) {
  res.render('salesforce/chatter/group/post', {
    title: 'Chatter Post to Group',
    data: { params: {} }
  });
});

router.post('/group/post', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Chatter Post to Group',
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
      // See: https://jsforce.github.io/document/#post-a-feed-item
      //
      const p = {
        body: {
          messageSegments: [{
            type: 'Text',
            text: params.message
          }]
        },
        feedElementType : 'FeedItem',
        subjectId: params.groupId
      };

      conn.chatter.resource('/feed-elements').create(p, function(err, result) {
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
    res.render('salesforce/chatter/group/post', payload);
  });
});


module.exports = router;

