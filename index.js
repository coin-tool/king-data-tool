const { resolve } = require('path');
const startMonitor = require('./src/kingDataMonitor');

startMonitor({
  configPath: resolve(__dirname, './config/user.json')
})