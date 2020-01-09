'use strict';

const http = require('http');
const https = require('https');

/**
 * @param {String} url
 */
module.exports = function (url) {
  const protocol = /https:/.test(url) ? https : http;
  return protocol;
}

