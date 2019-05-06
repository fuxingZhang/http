const http = require('http');
const https = require('https');

module.exports = {
  get(url, config = {}) {
    const { responseType, timeout = 3000 } = config;
    const request = /^https:/.test(url) ? https : http;

    return new Promise((resolve, reject) => {
      const options = {
        timeout
      }

      if (responseType) {
        try {
          options.responseType = responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (responseType !== 'json') throw e;
        }
      }

      request.get(url, options, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        if (statusCode !== 200) {
          res.resume();
          const error = new Error(`error code: ${statusCode}`);
          reject(error);
          return;
        }

        res.setEncoding('utf8');

        let body = '';

        res.on('data', chunk => {
          // equal to: body += data.toString()
          body += chunk;
        });

        res.on('end', () => {
          if (/^application\/json/.test(contentType)) body = JSON.parse(body);
          resolve(body);
        });
      }).on('error', e => {
        reject(e.message);
      });
    })
  },
  post(url, data) {
    const request = /https:/.test(url) ? https : http;
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'post',
        timeout: 3000
      };

      const postData = JSON.stringify(data);

      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }

      const req = request.request(url, options, res => {
        let body = '';

        res.on('data', chunk => {
          res.setEncoding('utf8');
          // equal to: body += data.toString()
          body += chunk;
        });

        res.on('end', () => {
          resolve(body);
        });
      });

      req.on('error', e => {
        reject(e.message);
      });

      req.write(postData);
      req.end();
    })
  }
}