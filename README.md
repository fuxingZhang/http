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

export interface Options {
  timeout?: number;
  agent?: http.Agent | boolean;
  auth ?: string;
  createConnection?: function;
  family?: number;
  headers?: object;
  localAddress?: number;
  lookup?: function;
}

/**
 * get 
 *   - `url` the server URL that will be used for the request
 *   - `options` optional parameters
 */
export function get(url: string, options: Options): Promise<any>;

/**
 * post 
 *   - `url` the server URL that will be used for the request
 *   - `data` the data to be sent as the request body
 *   - `options` optional parameters
 */
export function post(url: string, data: object, options: Options): Promise<any>;

/**
 * put 
 *   - `url` the server URL that will be used for the request
 *   - `data` the data to be sent as the request body
 *   - `options` optional parameters
 */
export function put(url: string, data: object, options: Options): Promise<any>;

/**
 * delete 
 *   - `url` the server URL that will be used for the request
 *   - `options` optional parameters
 */
export function del(url: string, options: Options): Promise<any>;
```

## test
```bash
$ cd ./test
$ node test
```