//要用到该包的命令执行任务的就需要全局安装，要通过require引入使用的就需要本地安装
const webpackMerge = require('webpack-merge'); // 合并webpack 配置
const baseConfig = require('./webpack.base');
const path = require('path');
// 不需要生产html文件
module.exports = webpackMerge(baseConfig, {
  target: 'node',//使用在哪种环境中执行
  entry: {
    // 根据app的依赖关系 将工程整体打包
    app: path.join(__dirname, '../client/server-entry.js'),
  },
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2', // 打包模块方案出来的规范 ,commonjs2最新的规范 适用于nodejs端
  },
  mode: 'development',
});

//public/app/hash.js
