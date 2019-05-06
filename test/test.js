const request = require('../src/request');
require('../utils/node_colors');

(async () => {
  const httpsRes = await request.get('https://cnodejs.org/api/v1/topics?limit=1')
  console.log('httpsRes:'.red)
  console.log(httpsRes)
  
  const httpRes = await request.get('http://baidu.com')
  console.log('httpRes:'.red)
  console.log(httpRes)
})().catch(console.error)