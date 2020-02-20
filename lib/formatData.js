'use strict';

const { form, json } = require('./contentTypes');

/**
 * @param {String} contentType
 * @param {Object} data
 */
function formatData(contentType, data) {
  if (contentType === form) {
    return Object.entries(data).map(item => `${item[0]}=${item[1]}`).join('&');
  } else if (contentType === json) {
    return JSON.stringify(data);
  }
}

module.exports = formatData;