'use strict';

/**
 * @param {String} contentType
 * @param {String} responseType
 * @param {String} body
 */
function parseBody({ contentType, responseType, body }) {
  if (responseType === 'json' && /^application\/json/.test(contentType)) {
    return JSON.parse(body);
  }

  return body;
}

module.exports = parseBody;