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
})().catch(console.error);
```  

## Type definitions
```ts
import http = require('http');
import https = require('https');

interface Options {
  timeout?: number;
  agent?: http.Agent | https.Agent | boolean;
  auth?: string;
  createConnection?: Function;
  family?: number;
  headers?: object;
  localAddress?: number;
  lookup?: Function;
  onlyData?: boolean;
  withRequest?: boolean;
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