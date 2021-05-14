const nconf = require('nconf');
const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');

const instance = axios.create({
  baseURL: 'https://ikingdata.com/',
  timeout: 5000
});

let cacheData = [];

function sendDD(content) {
  const url = nconf.get('dingdingWebHook');
  axios.post(url, {
    msgtype: "text",
    text: { content }
  })
}

function getKingData() {
  return instance.get('/api/v2/posts', { params: { page: 1, page_size: 10 } }).then(function (response) {
    return response.data;
  });
}

function uselessFilter(list) {
  return list.filter(function({ type }) {
    return type !== 1;
  })
}

function getDifference(arr1, arr2) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const id1 = obj1.id;
    let flag = false;
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      const id2 = obj2.id;
      if (id2 == id1) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      result.push(obj1);
    }
  }
  return result;
}

function getContent(list) {
  const content = list.reduce(function(total, item) {
    return `${total}\n${item.chart.name}\n${item.content}\n发布时间：${moment(item.published_at * 1000).format('YYYY-MM-DD HH:mm:ss')}\n==========`
  }, '');
  return `大老king来嗑儿了：\n==========${content}`
}

module.exports = async function({ configPath }) {
  nconf.file({ file: configPath });
  schedule.scheduleJob('0 * * * * *', async function() {
    const { code, data } = await getKingData();
    if (code === 0) {
      const res = uselessFilter(data.results);
      const list = getDifference(res, cacheData);
      if (list.length > 0) {
        cacheData = res;
        const content = getContent(list);
        sendDD(content);
      }
    } else {
      console.log('数据获取失败');
    }
  })
}