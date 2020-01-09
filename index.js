'use strict';

const request = require('./lib/request');
const unsafeMethods = require('./lib/unsafeMethods');
const safeMethods = require('./lib/safeMethods');

for (const method of safeMethods) {
  exports[method.toLowerCase()] = function (url, options = {}) {
    options.method = method;
    return request(url, options);
  };
}

for (const method of unsafeMethods) {
  exports[method.toLowerCase()] = function (url, data, options = {}) {
    options.method = method;
    if (unsafeMethods.includes(method)) options.data = data;
    return request(url, options);
  };
}