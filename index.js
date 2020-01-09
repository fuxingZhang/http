'use strict';

const request = require('./lib/request');

/**
 * get 
 * @param {String} url the server URL that will be used for the request
 * @param {Object} options optional parameters
 */
exports.get = function (url, options = {}) {
  return request(url, null, options);
};

/**
 * post 
 * @param {String} url the server URL that will be used for the request
 * @param {Object | String} data the data to be sent as the request body
 * @param {Object} options optional parameters
 */
exports.post = function (url, data, options = {}) {
  options.method = 'POST';
  return request(url, data, options);
};

/**
 * put 
 * @param {String} url the server URL that will be used for the request
 * @param {Object | String} data the data to be sent as the request body
 * @param {Object} options optional parameters
 */
exports.put = function (url, data, options = {}) {
  options.method = 'PUT';
  return request(url, data, options);
};

/**
 * delete 
 * @param {String} url the server URL that will be used for the request
 * @param {Object} options optional parameters
 */
exports.delete = function (url, options = {}) {
  options.method = 'DELETE';
  return request(url, null, options);
};