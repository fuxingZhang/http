const http = require('../index');
const assert = require('assert');

describe('#indexOf()', function () {
  it('http get should ok', async () => {
    const httpRes = await http.get('http://baidu.com');
    assert(httpRes.includes('<html>'));
  });

  it('https get should ok', async () => {
    const httpsRes = await http.get('https://cnodejs.org/api/v1/topics?limit=1&mdrender=false');
    assert(httpsRes.success === true);
  });
});