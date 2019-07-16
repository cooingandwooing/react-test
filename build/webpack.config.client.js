//要用到该包的命令执行任务的就需要全局安装，要通过require引入使用的就需要本地安装
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    // 根据app的依赖关系 将工程整体打包
    app: path.join(__dirname, '../client/app.js'),
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    // 加在静态资源前面 前缀区分，部署网上的时候 非常有用比如 添加域名
    publicPath: '/public/',// /public  太坑了  /public/  这样写才行  不然 hot 不能热更新
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]

      },
      {
        // 哪种类型文件
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        // 哪种类型文件
        test: /.js$/,
        exclude: [
          path.join(__dirname, '../node_modules')
        ],
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
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
};
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
