'use strict';

const http = require('../index');
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const url = `http://localhost:${port}/`;

describe('http', function () {
  let server;
  const message = 'Hello World!';
  const optionsRes = 'GET,HEAD,POST,PUT,PATCH,DELETE';
  const name = 'zfx';
  const data = { name };

  before(function () {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app
      .get('/', (req, res) => res.send(message))
      .post('/', function (req, res) {
        res.send(req.body);
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

  after(function () {
    server.close();
  });

  it('get method should ok', async () => {
    const res = await http.get(url);
    assert(res === message);
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
});