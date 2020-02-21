'use strict';

const http = require('../index');
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const url = `http://localhost:${port}`;
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const pipeline = util.promisify(stream.pipeline);
const FormData = require('form-data');
const Busboy = require('busboy');

describe('http', function () {
  let server;
  const message = 'Hello World!';
  const optionsRes = 'GET,HEAD,POST,PUT,PATCH,DELETE';
  const name = 'zfx';
  const data = { name };
  const filename = 'zfx.txt';
  const testfile = './test/test.txt';
  const testFileText = fs.readFileSync(testfile, {
    encoding: 'utf8'
  });
  const abc = 'abc';

  before(function () {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app
      .get('/', (req, res) => res.send(message))
      .get('/stream', async (req, res) => {
        const stream = fs.createReadStream(testfile);

        await pipeline(stream, res).catch(err => {
          console.log('stream error:', err);
          stream.destroy();
        });
      })
      .post('/', function (req, res) {
        res.send(req.body);
      })
      .post('/buffer-or-stream', async function (req, res) {
        const { type } = req.query;
        const chunks = [];

        req.on('data', data => {
          chunks.push(data);
        });

        req.on('end', async () => {
          const str = Buffer.concat(chunks).toString();
          if (type === 'buffer') {
            assert(str === abc);
          } else if (type === 'stream') {
            const index = await fs.promises.readFile(filename, {
              encoding: 'utf8'
            });
            assert(str === index);
          } else {
            assert(false);
          }
        });

        await pipeline(req, fs.createWriteStream(filename));

        res.send({
          success: true
        });
      })
      .post('/formdata', async function (req, res) {
        try {
          const body = await new Promise((resolve, reject) => {
            const busboy = new Busboy({
              headers: req.headers
            });

            const body = {};

            busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
              const chunks = [];

              file.on('data', data => {
                chunks.push(data);
              });

              file.on('end', async () => {
                const str = Buffer.concat(chunks).toString();
                if (fieldname === 'buffer') {
                  assert(str === abc);
                  body[fieldname] = str;
                } else if (fieldname === 'file') {
                  const index = await fs.promises.readFile(filename, {
                    encoding: 'utf8'
                  });
                  assert(str === index);
                } else {
                  assert(false);
                }
              });

              if (fieldname === 'file') await pipeline(file, fs.createWriteStream(filename));
            });

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
              body[fieldname] = val;
              assert(fieldname === 'name');
              assert(val === name);
            });

            busboy.on('finish', () => {
              resolve(body);
            });

            busboy.on('error', e => reject(e));

            req.pipe(busboy);
          });

          res.send({
            success: true,
            ...body
          });
        } catch (error) {
          res.send({
            success: false,
            error: error.message
          });
        }
      })
      .put('/', function (req, res) {
        res.send(req.body);
      })
      .patch('/', function (req, res) {
        res.send(req.body);
      })
      .delete('/', function (req, res) {
        res.send({
          success: true
        });
      })

    server = app.listen(port);
  });

  after(async function () {
    await fs.promises.unlink(filename);
    server.close();
  });

  it('get method should ok', async () => {
    const res = await http.get(url);
    assert(res === message);
  });

  it('get stream should ok', async () => {
    try {
      const res = await http.get(`${url}/stream`, {
        responseType: "stream"
      });
      await pipeline(res, fs.createWriteStream(filename));
      const data = await fs.promises.readFile(filename, {
        encoding: 'utf8'
      })
      assert(data === testFileText);
    } catch (error) {
      console.log(error)
    }
  });

  it('get method should ok(onlyData: false)', async () => {
    const res = await http.get(url, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.data && res.data === message);
    assert(res.request === undefined);
    assert(res.response === undefined);
  });

  it('get method should ok(onlyData: false, withRequest: true)', async () => {
    const res = await http.get(url, {
      onlyData: false,
      withRequest: true
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.data && res.data === message);
    assert(res.request);
    assert(typeof res.request === 'object');
    assert(res.response === undefined);
  });

  it('get method should ok(onlyData: false, withResponse: true)', async () => {
    const res = await http.get(url, {
      onlyData: false,
      withResponse: true
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.data && res.data === message);
    assert(res.response);
    assert(typeof res.response === 'object');
    assert(res.request === undefined);
  });

  it('head method should ok', async () => {
    const res = await http.head(url);
    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.data === '');
    assert(res.request === undefined);
    assert(res.response === undefined);
  });

  it('head method hould ok(onlyData: true)', async () => {
    const res = await http.head(url, {
      onlyData: true
    });

    assert(res === '');
  });

  it('options method should ok', async () => {
    const res = await http.options(url);

    assert(res === optionsRes);
  });

  it('options method hould ok(onlyData: false)', async () => {
    const res = await http.options(url, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.data === optionsRes);
    assert(res.request === undefined);
    assert(res.response === undefined);
  });

  it('post method should ok', async () => {
    const res = await http.post(url, data);

    assert(typeof res === 'object');
    assert(res.name === name);
  });

  it('post method hould ok(onlyData: false)', async () => {
    const res = await http.post(url, data, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.request === undefined);
    assert(res.response === undefined);
    assert(typeof res.data === 'object');
    assert(res.data.name === name);
  });

  it('patch method should ok', async () => {
    const res = await http.patch(url, data);

    assert(typeof res === 'object');
    assert(res.name === name);
  });

  it('patch method hould ok(onlyData: false)', async () => {
    const res = await http.patch(url, data, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.request === undefined);
    assert(res.response === undefined);
    assert(typeof res.data === 'object');
    assert(res.data.name === name);
  });

  it('put method should ok', async () => {
    const res = await http.put(url, data);

    assert(typeof res === 'object');
    assert(res.name === name);
  });

  it('put method hould ok(onlyData: false)', async () => {
    const res = await http.put(url, data, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.request === undefined);
    assert(res.response === undefined);
    assert(typeof res.data === 'object');
    assert(res.data.name === name);
  });

  it('delete method should ok', async () => {
    const res = await http.delete(url, data);

    assert(typeof res === 'object');
    assert(res.success === true);
  });

  it('delete method hould ok(onlyData: false)', async () => {
    const res = await http.delete(url, {
      onlyData: false
    });

    assert(res.statusCode === 200);
    assert(res.statusMessage === 'OK');
    assert(res.headers && typeof res.headers === 'object');
    assert(res.statusCode === 200);
    assert(res.request === undefined);
    assert(res.response === undefined);
    assert(typeof res.data === 'object');
    assert(res.data.success === true);
  });

  it('post buffer should ok', async () => {
    const res = await http.post(`${url}/buffer-or-stream?type=buffer`, Buffer.from(abc));
    const data = await fs.promises.readFile(filename, {
      encoding: 'utf8'
    });

    assert(typeof res === 'object');
    assert(res.success === true);
    assert(data === abc);
  });

  it('post stream should ok', async () => {
    const readStream = fs.createReadStream(testfile);
    const res = await http.post(`${url}/buffer-or-stream?type=stream`, readStream);
    const data = await fs.promises.readFile(filename, {
      encoding: 'utf8'
    });

    assert(typeof res === 'object');
    assert(res.success === true);
    assert(data === testFileText);
  });

  it('post formdata should ok', async () => {
    const readStream = fs.createReadStream(testfile);
    const form = new FormData();

    form.append('name', name);
    form.append('buffer', Buffer.from(abc));
    form.append('file', readStream, filename);

    const formHeaders = form.getHeaders();
    const res = await http.post(`${url}/formdata`, form, {
      headers: {
        ...formHeaders,
      },
    });
    const data = await fs.promises.readFile(filename, {
      encoding: 'utf8'
    });

    assert(typeof res === 'object');
    assert(res.success === true);
    assert(res.name === name);
    assert(res.buffer === abc);
    assert(data === testFileText);
  });
});