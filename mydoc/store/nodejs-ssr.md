基于 React.js 和 Node.js 的 SSR 实现方案
1. SSR：即服务端渲染(Server Side Render)；传统的服务端渲染可以使用Java，php等开发语言来实现，随着 Node.js和相关技术的成熟，前端同学可以基于此完成独立的服务端渲染。



2. 过程：浏览器发送请求->服务器运行react代码生成页面->服务器返回页面->浏览器下载HTML文档->页面准备就绪
即：当前页面的内容是服务器生成好给到浏览器的

3. 对应CSR：即客户端渲染(Client Side Render)
过程：浏览器发送请求->服务器返回空白html(html里包含一个root节点和js文件)->浏览器下载js文件->浏览器运行react代码->页面准备就绪
即：当前页面的内容是js渲染出来



4. 如何区分页面是否服务端渲染：右键，显示网页源代码，如果页面上的内容在html文档里，是服务端渲染，否则就是客户端渲染

5. 对比：

 CSR：首屏渲染时间长，react代码运行在浏览器，消耗的是浏览器的性能
 SSR：首屏渲染时间短，react代码运行在服务器，消耗的是服务器的性能
6. 为什么要用服务端渲染

首屏加载时间优化: 由于SSR是直接返回生成好内容的html；而普通的CSR是先返回空白的html，再js下载并渲染好后页面才有内容；所以SSR首屏加载更快，减少白屏的时间，用户体验更好
SEO(搜索引擎优化): 搜索关键词的时候排名，对大多数搜索引擎，不识别js内容, 只识别html内容
（注：原则上可以不用服务端渲染时最好不用，所以如果只有seo要求，可以用预渲染等技术去替代）

7. 构建一个服务端渲染的项目

(1)使用node作为服务端和客户端的中间层，承担proxy代理，处理cookie等

(2)hydrate的使用：在有服务端渲染情况下，使用hydrate代替render，它的作用主要是将相关的事件注水进html页面中(即：让React组件的数据随着HTML文档一起传递给浏览器网页),这样可以保持服务端数据和浏览器端一致，避免闪屏，使第一次加载体验更高效流畅。

 

ReactDom.hydrate(<App />, document.getElementById('root'))
(3) 服务端代码webpack编译：通常会建一个webpack.server.js文件，除了常规的参数配置外，还需要设置target参数为'node'


const serverConfig = {
target: 'node',
entry: './src/server/index.js',
output: {
filename: 'bundle.js',
path: path.resolve(__dirname, '../dist')
},
externals: [nodeExternals()],
module: {
rules: [{
test: /\.js?$/,
loader: 'babel-loader',
exclude: [
path.join(__dirname, './node_modules')
]
}
...
]
}
(此处省略样式打包，代码压缩，运行坏境配置等等...)
...
};
(4) 使用react-dom/server下的renderToString方法在服务器上把各种复杂的组件和代码转化成HTML字符串返回到浏览器，并在初始请求时发送标记以加快页面加载速度，并允许搜索引擎抓取页面以实现SEO目的

复制代码
const render = (store, routes, req, context) => {
const content = renderToString((
<Provider store={store}>
<StaticRouter location={req.path} context={context}>
<div>
{renderRoutes(routes)}
</div>
</StaticRouter>
</Provider>
));
return `
<html>
<head>
<title>ssr</title>
</head>
<body>
<div id='root'>${content}</div>
<script src='/index.js'></script>
</body>
</html>
`;
}
app.get('*', function (req, res) {
...
const html = render(store, routes, req, context);
res.send(html);
})
复制代码
与renderToString类似功能的还有：
i. renderToStaticMarkup：区别在于renderToStaticMarkup 渲染出的是不带data-reactid的纯html,在js加载完成后,因为不认识之前服务端渲染的内容,导致重新渲染(可能页面会闪一下)
ii. renderToNodeStream：将React元素渲染为其初始HTML，返回一个输出HTML字符串的可读流。
iii. renderToStaticNodeStream：与renderToNodeStream此类似，除了这不会创建React在内部使用的额外DOM属性，例如data-reactroot。

(5) 使用redux承担数据准备，状态维护的职责，通常搭配react-redux, redux-thunk(中间件：发异步请求用到action)使用。（本猿目前使用比较多是就是Redux和Mobx，这里以Redux为例）
1. 创建store(服务器每次请求都要创建一次，客户端只创建一次):

const reducer = combineReducers({
home: homeReducer,
page1: page1Reducer,
page2: page2Reducer
});
 
export const getStore = (req) => {
return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios(req))));
}
 
export const getClientStore = () => {
return createStore(reducer, window.STATE_FROM_SERVER, applyMiddleware(thunk.withExtraArgument(clientAxios)));
}
2. action: 负责把数据从应用传到store，是store数据的唯一来源

export const getData = () => {
return (dispatch, getState, axiosInstance) => {
return axiosInstance.get('interfaceUrl/xxx')
.then((res) => {
dispatch({
type: 'HOME_LIST',
list: res.list
})
});
}
}
3.reducer：接收旧的state和action，返回新的state，响应actions并发送到store


export default (state = { list: [] }, action) => {
switch(action.type) {
case 'HOME_LIST':
return {
...state,
list: action.list
}
default:
return state;
}
}
4. 使用react-redux的connect,Provider把组件和store连接起来

Provider 将之前创建的store作为prop传给Provider

const content = renderToString((
<Provider store={store}>
<StaticRouter location={req.path} context={context}>
<div>
{renderRoutes(routes)}
</div>
</StaticRouter>
</Provider>
))
`
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])接收四个参数
常用的是前两个属性
mapStateToProps函数允许我们将store中的数据作为props绑定到组件上
mapDispatchToProps将action作为props绑定到组件上


connect(mapStateToProps(),mapDispatchToProps())(MyComponent)
(6) 使用react-router承担路由职责
服务端路由不同于客户端，它是无状态的。React提供了一个无状态的组件StaticRouter，向StaticRouter传递当前url，调用ReactDOMServer.renderToString()就能匹配到路由视图

服务端


import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config'
import routes from './router.js'
 
<StaticRouter location={req.path} context={{context}}>
{renderRoutes(routes)}
</StaticRouter>
浏览器端


import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config'
import routes from './router.js'
 
<BrowserRouter>
{renderRoutes(routes)}
</BrowserRouter>
当浏览器的地址栏发生变化的时候，前端会去匹配路由视图，同时由于req.path发生变化，服务端匹配到路由视图，这样保持了前后端路由视图的一致，在页面刷新时，仍然可以正常显示当前视图。
如果只有浏览器端路由，而且是采用BrowserRouter，当页面地址发生变化后去刷新页面时，由于没有对应的html，会导致页面找不到，但是加了服务端路由后，刷新发生时服务端会返回一个完整的html给客户端，页面仍然正常显示

推荐使用react-router-config插件,然后如上代码在StaticRouter和BrowserRouter标签的子元素里加renderRoutes(routes)：
建一个router.js文件


const routes = [{ component: Root,
routes: [
{ path: '/',
exact: true,
component: Home,
loadData: Home.loadData
},
{ path: '/child/:id',
component: Child,
loadData: Child.loadData
routes: [
path: '/child/:id/grand-child',
component: GrandChild,
loadData: GrandChild.loadData
]
}
]
}]
在浏览器端请求一个地址的时候，server.js里在实际渲染前可以通过matchRouters这种方式确定要渲染的内容,调用loaderData函数进行action派发，返回promise->promiseAll->renderToString，最终生成html文档返回。

import { matchRoutes } from 'react-router-config'
 
const loadBranchData = (location) => {
const branch = matchRoutes(routes, location.pathname)
 
const promises = branch.map(({ route, match }) => {
return route.loadData
? route.loadData(match)
: Promise.resolve(null)
})
 
return Promise.all(promises)
}
(7) 写组件注意代码同构(即：一套React代码在服务端执行一次，在客户端再执行一次)
由于服务器端绑定事件是无效的，所以服务器返回的只有页面样式(&注水的数据)，同时返回js文件，在浏览器上下载并执行js时才能把事件绑上，而我们希望这个过程只需编写一次代码，这个时候就会用到同构，服务端渲染出样式，在客户端执行时绑上事件。

优点： 共用前端代码，节省开发时间
弊端： 由于服务器端和浏览器环境差异，会带来一些问题，如document等对象找不到，DOM计算报错，前端渲染和服务端渲染内容不一致等；前端可以做非常复杂的请求合并和延迟处理，但为了同构，所有这些请求都在预先拿到结果才会渲染。