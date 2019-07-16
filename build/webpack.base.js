const path = require('path');
module.exports = {
  output: {
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
};
