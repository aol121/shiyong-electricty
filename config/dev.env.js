var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
//      process.env 是读取系统环境变量的，比如你在启动服务的时候，
//      设置环境变量为production或者development
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
