'use strict';

const protocol = require('./protocol');
const unsafeMethods = require('./unsafeMethods');
const format = require('./format');
const parseBody = require('./parseBody');
const formatResponseConfig = require('./formatResponseConfig');

/**
 * @param {String} url the server URL that will be used for the request
 * @param {Object} [config] optional parameters
 */
function request(url, config = {}) {
  if (config.method === undefined) config.method = 'GET';

  const method = config.method;
  const http = protocol(url);

  if (unsafeMethods.includes(method)) format(config);

  formatResponseConfig(config);

  const { data, onlyData, withRequest, withResponse, ...options } = config;

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, res => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      if (method === 'GET' && statusCode !== 200) {
        res.resume();
        const error = new Error(`Request failed with statusCode ${statusCode}`);
        error.statusCode = statusCode;
        error.method = method;
        error.url = url;
        error.statusMessage = res.statusMessage;
        error.timeout = options.timeout;
        error.headers = res.headers;
        if (withRequest) error.request = req;
        if (withResponse) error.response = res;
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
        if (onlyData) return resolve(body);
        const data = {
          statusCode: statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: body
        };
        if (withRequest) data.request = req;
        if (withResponse) data.response = res;
        resolve(data);
      });
    });

    req.on('error', e => {
      reject(e.message);
    });

    if (config.timeout && typeof config.timeout === 'number') {
      // use timeout event
      req.on('timeout', () => {
        req.abort();
        const { host } = new URL(url);
        reject(`connect ETIMEDOUT ${host}`);
      });

      // use setTimeout methoud
      // req.setTimeout(config.timeout, () => {
      //   req.abort();
      //   const { host } = new URL(url);
      //   reject(`connect ETIMEDOUT ${host}`);
      // });
    }

    if (unsafeMethods.includes(method) && data) req.write(data);

    req.end();
  })
}

module.exports = request