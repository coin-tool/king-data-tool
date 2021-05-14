# king-data-tool

#### start

```
git clone https://github.com/handoing/okex-grid
cd okex-grid
npm install
```

监控使用钉钉群进行消息通知，config目录下新建user.json，配置自己的钉钉token

```
// config/user.json
{
  "dingdingWebHook": "https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx"
}
```

#### run
```
node index.js
```