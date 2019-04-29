const http = require('http');

module.exports = {
  get(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        if(statusCode !== 200) {
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
          if(/^application\/json/.test(contentType)) body = JSON.parse(body);
          resolve(body);
        });
      }).on('error', e => {
        reject(e.message);
      });
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      const params = {
        method: 'post',
        timeout: 3000
      };

      const postData = JSON.stringify(data);

      params.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }

      const req = http.request(url, params, res => {
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