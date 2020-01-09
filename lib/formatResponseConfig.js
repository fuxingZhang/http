'use strict';

/**
 * @param {Object} config
 */
function format(config) {
  const { onlyData, method, withRequest, withResponse } = config;

  if (onlyData === undefined) {
    config.onlyData = method === 'HEAD' ? false : true;
  } else if (typeof onlyData !== 'boolean') {
    throw new TypeError(`onlyData must be boolean`);
  } else if (onlyData) {
    if (withRequest === undefined) config.withRequest = false;
    if (withResponse === undefined) config.withResponse = false;
  }
}

module.exports = format;