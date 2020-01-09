'use strict';

const request = require('./lib/request');
const unsafeMethods = require('./lib/unsafeMethods');
const safeMethods = require('./lib/safeMethods');
const methods = [...safeMethods, ...unsafeMethods];

for (const method of methods) {
  exports[method.toLowerCase()] = function (url, data, options = {}) {
    options.method = method;
    if(unsafeMethods.includes(method)) options.data = data;
    return request(url, options);
  };
}