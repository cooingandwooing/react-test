const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs') // 和 nodejs fs中的api一样 只不过把实现输出 等文件 在内存中操作 加快速度 输出到硬盘上效率低，其使用方法和nodejs fs 一样 在nodejs fs 文档中找 方法资料就好
const path = require('path')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')
const proxy = require('http-proxy-middleware') // 这个是 express 的中间件 做代理用的

// 服务端的渲染
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/index.html')
            .then(res => {
                resolve(res.data)
            })
            .catch(reject)
    })

}
const Module = module.constructor
const mfs = new MemoryFs()
// webpack 本身提供一种在nodejs中调用的方式 不是仅仅作为一个命令行工具
const serverCompiler = webpack(serverConfig)
// 写道内存上 加快打包速度
serverCompiler.outputFileSystem = mfs

let serverBundle
// 可以监听 entry 下面的文件是否有变化 一旦有变化会重新去打包
// 在nodejs 中监听 webpack 的打包过程 主要是 我们需要其打包出来的内容
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    // stats 是 webpack 在打包过程中输出的信息
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(warn => console.warn(warn))

    // 读取 bundle 信息
    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )
// webpack 输出的内容是字符串 不是可以在代码中直接使用的模块 通过下面可以转化 下面在nodejs 官网没有api的讲解
    const bundle = mfs.readFileSync(bundlePath, 'utf-8')
    const m = new Module()
    // bundle是传入的内容， 后面的'server-entry.js' 是指定的文件名
    m._compile(bundle, 'server-entry.js')
    serverBundle = m.exports.default
})

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }))

    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDomServer.renderToString(serverBundle)
            res.send(template.replace('<!-- app -->', content))
        })
    })
}