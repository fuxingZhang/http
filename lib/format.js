'use strict';

const formatData = require('./formatData');
const { form, stream } = require('./contentTypes');
const Stream = require('stream');

/**
 * @param {Object} config
 */
function format(config) {
  if (!config.headers) config.headers = {};

  const { headers, data } = config;

  if (headers['content-type']) {
    headers['Content-Type'] = headers['content-type'];
    delete headers['content-type'];
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = Buffer.isBuffer(data) || data instanceof Stream ? stream : form;
  }

  if (data === undefined) {
    headers['Content-Length'] = 0;
  } else if (Buffer.isBuffer(data) || typeof data === 'string') {
    headers['Content-Length'] = Buffer.byteLength(data);
  } else if (data instanceof Stream) {
    return;
  } else if (typeof data === 'object') {
    const contentType = headers['Content-Type'];
    config.data = formatData(contentType, data);
    headers['Content-Length'] = Buffer.byteLength(config.data);
  } else {
    throw new TypeError('Unexpected type of "data"');
  }
}

module.exports = format;