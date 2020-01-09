'use strict';

const protocol = require('./protocol');
const unsafeMethods = require('./unsafeMethods');
const format = require('./format');
const parseBody = require('./parseBody');

/**
 * @param {String} url the server URL that will be used for the request
 * @param {Object} [config] optional parameters
 */
function request(url, config = {}) {
  if (config.method === undefined) config.method = 'GET';
  if (config.timeout === undefined) config.timeout = 10000;

  const method = config.method;
  const http = protocol(url);

  if (unsafeMethods.includes(method)) format(config);

  const { data, ...options } = config;

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, res => {
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
        body = parseBody(contentType, body);
        resolve(body);
      });
    });

    req.on('error', e => {
      reject(e.message);
    });

    if (unsafeMethods.includes(method) && data) req.write(data);

    req.end();
  })
}

module.exports = request