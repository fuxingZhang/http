# http
Promise based HTTP client for node.js

## Install

```sh
$ npm i @zhangfuxing/http
```  

## Useage  

```js
const http = require('@zhangfuxing/http');
const assert = require('assert');

(async () => {
  // http
  const httpRes = await http.get('http://baidu.com');
  assert(httpRes.includes('<html>'));

  // https
  const httpsRes = await http.get('https://cnodejs.org/api/v1/topics?limit=1&mdrender=false');
  assert(httpsRes.success === true);

  // download file: use pipe
  const fs = require('fs');
  const res = await http.get('http://localhost:3000', {
    responseType: "stream"
  })
  res.pipe(require('fs').createWriteStream('zfx.txt'))
  // or use pipeline
  const stream = require('stream');
  const util = require('util');
  const pipeline = util.promisify(stream.pipeline);
  const res = await http.get(`${url}/stream`, {
    responseType: "stream"
  });
  await pipeline(res, fs.createWriteStream('zfx.txt'));

  // Buffer
  const httpsRes = await http.post('http://localhost/upload', Buffer.from('abc'));
  assert(httpsRes.success === true);

  // Stream
  const fs = require('fs');
  const readStream = fs.createReadStream('./index.js');
  const httpsRes = await http.post('http://localhost/upload', readStream);
  assert(httpsRes.success === true);

  // FormData
  const FormData = require('form-data');
  const form = new FormData();
  const fs = require('fs');
  const readStream = fs.createReadStream('./index.js');
  form.append('my_field', 'my value');
  form.append('my_buffer', Buffer.from('abc'));
  form.append('my_file', readStream);
  // Set filename by providing a string for options
  form.append('my_file', readStream, '1.js' );
  // provide an object.
  form.append('my_file', readStream, { 
    filename: 'bar.jpg', 
    contentType: 'image/jpeg', 
    knownLength: 19806
  });
  const formHeaders = form.getHeaders();
  const httpsRes = await http.post('http://localhost/upload', form, {
    headers: {
      ...formHeaders,
    },
  });
  assert(httpsRes.success === true);
```  

More examples in the `test` folder.

## Type definitions
```ts
import http = require('http');
import https = require('https');

interface Options {
  // `responseType` indicates the type of data that the server will respond with
  // options are: 'buffer', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout?: number; // Default: Node.js default value

  // Controls Agent behavior
  agent?: http.Agent | https.Agent | boolean;

  // Basic authentication i.e. 'user:password' to compute an Authorization header.
  auth?: string;

  // A function that produces a socket/stream to use for the request when the agent option is not used. 
  // This can be used to avoid creating a custom Agent class just to override the default createConnection function
  createConnection?: Function;

  // IP address family to use when resolving host or hostname. Valid values are 4 or 6. 
  // When unspecified, both IP v4 and v6 will be used.
  family?: number;
  
  // An object containing request headers.
  headers?: object;

  // Use an insecure HTTP parser that accepts invalid HTTP headers when true. 
  // Using the insecure parser should be avoided. See --insecure-http-parser for more information. 
  insecureHTTPParser?: boolean; // Default: false

  // Local interface to bind for network connections.
  localAddress?: number;

  // Custom lookup function. Default: dns.lookup().
  lookup?: Function;

  // Optionally overrides the value of --max-http-header-size for requests received from the server, i.e. the maximum length of response headers in bytes. Default: 8192 (8KB).
  maxHeaderSize?: number;

  // Specifies whether or not to automatically add the Host header. Defaults to true.
  setHost: boolean;

  // only include body data
  onlyData?: boolean; // Default: method === 'HEAD' ? false : true;

  // if onlyData is false, withRequest is true can add request to res data
  withRequest?: boolean;
  
  // if onlyData is false, withResponse is true can add response to res data
  withResponse?: boolean;
}

interface request {
  /**
   * head 
   *   - `url` the server URL that will be used for the request
   *   - `options` optional parameters
   */
  head(url: string, options?: Options): Promise<any>;

  /**
   * options 
   *   - `url` the server URL that will be used for the request
   *   - `options` optional parameters
   */
  options(url: string, options?: Options): Promise<any>;

  /**
   * get 
   *   - `url` the server URL that will be used for the request
   *   - `options` optional parameters
   */
  get(url: string, options?: Options): Promise<any>;

  /**
   * post 
   *   - `url` the server URL that will be used for the request
   *   - `data` the data to be sent as the request body
   *   - `options` optional parameters
   */
  post(url: string, data: object, options?: Options): Promise<any>;

  /**
   * put 
   *   - `url` the server URL that will be used for the request
   *   - `data` the data to be sent as the request body
   *   - `options` optional parameters
   */
  put(url: string, data: object, options?: Options): Promise<any>;

  /**
   * patch 
   *   - `url` the server URL that will be used for the request
   *   - `data` the data to be sent as the request body
   *   - `options` optional parameters
   */
  patch(url: string, data: object, options?: Options): Promise<any>;

  /**
   * delete 
   *   - `url` the server URL that will be used for the request
   *   - `options` optional parameters
   */
  delete(url: string, options?: Options): Promise<any>;
}

declare const request: request;

export = request;
```

## test
```bash
$ cd ./test
$ node test
```