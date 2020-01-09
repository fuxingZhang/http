'use strict';

const contentTypes = require('./contentTypes');

/**
 * @param {String} contentType
 * @param {Object} data
 */
function formatData(contentType, data) {
  if (contentType === contentTypes.form) {
    return Object.entries(data).map(item => `${item[0]}=${item[1]}`).join('&');
  } else if (contentType === contentTypes.json) {
    return JSON.stringify(data);
  } else {
    throw new TypeError('Unexpected request headers Content-Type');
  }
}

module.exports = formatData;