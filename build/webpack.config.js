//要用到该包的命令执行任务的就需要全局安装，要通过require引入使用的就需要本地安装
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        // 根据app的依赖关系 将工程整体打包
        app: path.join(__dirname, '../client/app.js'),
    },
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),
        // 加在静态资源前面 前缀区分，部署网上的时候 非常有用比如 添加域名
        publicPath: '',// /public
    },
    module: {
        rules: [
            {
                // 哪种类型文件
                test: /.jsx$/,
                loader: 'babel-loader'
            },
            {
                // 哪种类型文件
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [
                    path.join(__dirname, '../node_modules')
                ]
            }
        ]
    },
    mode: 'development',
    plugins: [
        new HTMLPlugin()
    ]
}

//public/app/hash.js