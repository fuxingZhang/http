// Type definitions

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