'use strict';

const formatData = require('./formatData');
const contentTypes = require('./contentTypes');

/**
 * @param {Object} config
 */
function format(config) {
  // headers
  if (!config.headers) {
    config.headers = {
      'Content-Type': contentTypes.form,
    };
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = contentTypes.form;
  }

  // data, Content-Length
  const { data } = config;
  if (data === undefined) {
    config.headers['Content-Length'] = 0;
  } else if (typeof data === 'string') {
    config.headers['Content-Length'] = Buffer.byteLength(data);
  } else if (typeof data === 'object') {
    const contentType = config.headers['Content-Type'];
    config.data = formatData(contentType, data);
    config.headers['Content-Length'] = Buffer.byteLength(config.data);
  } else {
    throw new TypeError('Unexpected type of "data"');
  }
}

module.exports = format;