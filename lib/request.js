'use strict';

const http = require('http');
const https = require('https');

/**
 * @param {String} url the server URL that will be used for the request
 * @param {Object | String} data the data to be sent as the request body
 * @param {Object} [config] optional parameters
 */
function request(url, data, config = {}) {
  const _http = /https:/.test(url) ? https : http;
  const { method = 'GET', timeout = 3000, ...options } = config;

  options.method = method;
  options.timeout = timeout;

  if (method === 'POST' || method === 'PUT') {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    } else if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (data === null) {
      options.headers['Content-Length'] = 0;
    } else if (typeof data === 'string') {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    } else if (typeof data === 'object') {
      if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        data = Object.entries(data).map(item => `${item[0]}=${item[1]}`).join('&');
      } else {
        data = JSON.stringify(data);
      }
      options.headers['Content-Length'] = Buffer.byteLength(data);
    } else {
      throw new TypeError('Unexpected type of "data"');
    }
  }

  return new Promise((resolve, reject) => {
    const req = _http.request(url, options, res => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      if (method === 'GET' && statusCode !== 200) {
        res.resume();
        const error = new Error(`error code: ${statusCode}`);
        reject(error);
        return;
      }

      res.setEncoding('utf8');

      let body = '';

      res.on('data', chunk => {
        res.setEncoding('utf8');
        // equal to: body += data.toString()
        body += chunk;
      });

      res.on('end', () => {
        if (/^application\/json/.test(contentType)) body = JSON.parse(body);
        resolve(body);
      });
    });

    req.on('error', e => {
      reject(e.message);
    });

    if (method === 'POST' || method === 'PUT') {
      req.write(data);
    }

    req.end();
  })
}

module.exports = request