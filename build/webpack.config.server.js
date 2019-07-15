//要用到该包的命令执行任务的就需要全局安装，要通过require引入使用的就需要本地安装
const path = require('path')
// 不需要生产html文件
module.exports = {
    target: 'node',//使用在哪种环境中执行
    entry: {
        // 根据app的依赖关系 将工程整体打包
        app: path.join(__dirname, '../client/server-entry.js'),
    },
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname, '../dist'),
        // 加在静态资源前面 前缀区分，部署网上的时候 非常有用比如 添加域名
        publicPath: '/public',// /public
        libraryTarget: 'commonjs2', // 打包模块方案出来的规范 ,commonjs2最新的规范 适用于nodejs端
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
}

//public/app/hash.js