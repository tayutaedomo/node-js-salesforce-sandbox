'use strict';

const debug = require('debug')('node-js-salesforce-sandbox:lib:salesforce');
const Promise = require('bluebird');
const jsforce = require('jsforce');


const OAUTH_LOGIN_URL         = 'https://login.salesforce.com';
const OAUTH_LOGIN_URL_SANBODX = 'https://test.salesforce.com';

const OAUTH_CONSUMER_KEY    = process.env.OAUTH_CONSUMER_KEY;
const OAUTH_CONSUMER_SECRET = process.env.OAUTH_CONSUMER_SECRET;
const OAUTH_CLIENT_USERNAME = process.env.OAUTH_CLIENT_USERNAME;
const OAUTH_CLIENT_PASSWORD = process.env.OAUTH_CLIENT_PASSWORD;
const HTTP_PROXY            = process.env.HTTP_PROXY;
const SANDBOX               = process.env.SANDBOX;


function loginAsync() {
  const login_url = SANDBOX ? OAUTH_LOGIN_URL_SANBODX : OAUTH_LOGIN_URL;

  const options = {
    logLevel:     'DEBUG',
    loginUrl:     login_url,
    clientId:     OAUTH_CONSUMER_KEY,
    clientSecret: OAUTH_CONSUMER_SECRET
  };

  //
  // See: https://github.com/jsforce/jsforce/issues/1
  //
  //if (PROXY_URL) options.proxyUrl = PROXY_URL;
  if (HTTP_PROXY) options.httpProxy = HTTP_PROXY;

  debug('loginAsync', options);

  const conn = new jsforce.Connection(options);

  return new Promise(function(resolve, reject) {
    conn.login(OAUTH_CLIENT_USERNAME, OAUTH_CLIENT_PASSWORD, function(err, result) {
      debug(result);

      if (err) reject(err);
      else resolve({ conn, result });
    });
  });
}


module.exports = {
  loginAsync: loginAsync
};

