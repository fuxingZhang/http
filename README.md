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
  const httpRes = await http.get('http://baidu.com');
  assert(httpRes.includes('<html>'));

  const httpsRes = await http.get('https://cnodejs.org/api/v1/topics?limit=1&mdrender=false');
  assert(httpsRes.success === true);
})().catch(console.error);
```  

## Options
```ts
export interface configOption {
  responseType?: string;
  timeout?: number;
  [propName: string]: any;
}

/**
 * get 
 *   - `url` the server URL that will be used for the request
 *   - `data` the data to be sent as the request body
 */
export function get(url: string, config: configOption): Promise<any>;

/**
 * post 
 *   - `url` the server URL that will be used for the request
 *   - `data` the data to be sent as the request body
 */
export function post(url: string, data: object): Promise<any>;

/**
 * put 
 *   - `url` the server URL that will be used for the request
 *   - `data` the data to be sent as the request body
 */
export function put(url: string, data: object): Promise<any>;

/**
 * delete 
 *   - `url` the server URL that will be used for the request
 */
export function del(url: string): Promise<any>;
```

## test
```bash
$ cd ./test
$ node test
```