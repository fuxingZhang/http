'use strict';

const formatData = require('./formatData');
const contentTypes = require('./contentTypes');
const Stream = require('stream');

/**
 * @param {Object} config
 */
function format(config) {
  if (!config.headers) {
    config.headers = {
      'Content-Type': contentTypes.form,
    };
  } else if (config.headers['content-type']) {
    config.headers['Content-Type'] = config.headers['content-type'];
    delete config.headers['content-type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = contentTypes.form;
  }

  const { data } = config;
  if (data === undefined) {
    config.headers['Content-Length'] = 0;
  } else if (typeof data === 'string') {
    config.headers['Content-Length'] = Buffer.byteLength(data);
  } else if (Buffer.isBuffer(data)) {
    config.headers['Content-Type'] = 'application/octet-stream';
    config.headers['Content-Length'] = Buffer.byteLength(data);
  } else if (data instanceof Stream) {
    config.headers['Content-Type'] = 'application/octet-stream';
  } else if (typeof data === 'object') {
    const contentType = config.headers['Content-Type'];
    config.data = formatData(contentType, data);
    config.headers['Content-Length'] = Buffer.byteLength(data);
  } else {
    throw new TypeError('Unexpected type of "data"');
  }
}

module.exports = format;