'use strict';

const protocol = require('./protocol');
const unsafeMethods = require('./unsafeMethods');
const format = require('./format');
const parseBody = require('./parseBody');
const formatResponseConfig = require('./formatResponseConfig');
const Stream = require('stream');
const { promisify } = require('util');
const unzip = promisify(require('zlib').unzip);

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

  const {
    data,
    responseType = 'json',
    responseEncoding = 'utf8',
    onlyData,
    withRequest,
    withResponse,
    ...options
  } = config;

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, res => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      if (statusCode < 200 || statusCode >= 300) {
        const error = new Error(`Request failed with statusCode ${statusCode}`);
        error.statusCode = statusCode;
        error.method = method;
        error.url = url;
        error.statusMessage = res.statusMessage;
        error.timeout = options.timeout;
        error.headers = res.headers;
        if (withRequest) error.request = req;
        if (withResponse) error.response = res;

        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          error.data = data;
          reject(error);
        });
        return;
      }

      if (config.responseType === 'stream') return resolve(res);

      const chunks = [];

      res.on('data', chunk => {
        chunks.push(chunk);
      });

      res.on('end', async () => {
        let buffer = Buffer.concat(chunks);
        if (responseType === 'buffer') return resolve(buffer);

        if (res.headers['content-encoding'] == "gzip") {
          buffer = await unzip(buffer)
        }

        const data = parseBody({
          contentType,
          responseType,
          body: buffer.toString(responseEncoding)
        });

        if (onlyData) return resolve(data);
        const body = {
          statusCode: statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data
        };
        if (withRequest) body.request = req;
        if (withResponse) body.response = res;
        resolve(body);
      });
    });

    req.on('error', e => {
      reject(e);
    });

    if (config.timeout && typeof config.timeout === 'number') {
      // use timeout event
      req.on('timeout', () => {
        req.destroy();
        const { host } = new URL(url);
        reject(`connect ETIMEDOUT ${host}`);
      });

      // use setTimeout methoud
      // req.setTimeout(config.timeout, () => {
      //   req.destroy();
      //   const { host } = new URL(url);
      //   reject(`connect ETIMEDOUT ${host}`);
      // });
    }

    if (!unsafeMethods.includes(method)) req.end();

    if (data instanceof Stream) return data.pipe(req);

    req.end(data);
  })
}

module.exports = request