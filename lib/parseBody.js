

'use strict';

/**
 * @param {String} contentType
 * @param {String} body
 */
function parseBody(contentType, body) {
  if (/^application\/json/.test(contentType)) return JSON.parse(body);
  return body;
}

module.exports = parseBody;