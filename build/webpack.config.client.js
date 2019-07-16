//要用到该包的命令执行任务的就需要全局安装，要通过require引入使用的就需要本地安装
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // 合并webpack 配置
const baseConfig = require('./webpack.base');
const isDev = process.env.NODE_ENV === 'development';
// 后面的内容  对比覆盖前面的内容 没有则插入 有则覆盖
const config = webpackMerge(baseConfig, {
  entry: {
    // 根据app的依赖关系 将工程整体打包
    app: path.join(__dirname, '../client/app.js'),
  },
  output: {
    filename: '[name].[hash].js',
  },
  mode: 'development',
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "../client/template.html")
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
});
//config.plugins.push(new webpack.HotModuleReplacementPlugin())
// http://localhost:8888/filename
if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js'),
    ]
  };

  //开发环境的常用配置
  config.devServer = {
    host: '0.0.0.0',//可以用127 或localhost 或 本机ip 访问
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,//启动webpack.HotModuleReplacementPlugin//enable HMR on the server
    inline: true,//?
    headers: {'Access-Control-Allow-Origin': '*'},
    overlay: {
      errors: true //任何错误在网页中黑色背景 弹窗 // 只显示错误信息 不现实warning
    },
    stats: {colors: true},
    //注意使用client时 要删除 dist目标 webpack-dev-server 检测硬盘有没有dist目录  有的话 直接访问 不删除就 生不出当前版本的js
    publicPath: '/public/',
    //单页面开发，所有的错误都返回下面
    historyApiFallback: {//制定index是public下面的index就是dist下面的
      index: '/public/index.html'
    }

  }
}
module.exports = config;
//public/app/hash.js
