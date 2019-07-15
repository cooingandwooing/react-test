从NodeJS搭建中间层再谈前后端分离
2017年03月27日 11:54:52 小学生999 阅读数 29578
之前在知道创宇的项目中有用到过nodejs作中间层，当时还不太理解其背后真正的原因；后来在和一位学长交谈的过程中，也了解到蚂蚁金服也在使用类似的方法，使用nodejs作为中间层去请求真实后台的数据；之后人到北京，也见到现在的公司也在往nodejs后端方向靠拢。随着知识的增加，加之自己查阅资料，慢慢总结出了一些原理。

从做微信小程序引发的思考
最近出于爱好，写了个音乐播放器的微信小程序（原本想用vue写的，后来因为公司业务原因，年后可能去做微信小程序，所以就换了前端技术栈），源码在我的GitHub上： wx-audio 。

思考：后端出于性能和别的原因，提供的接口所返回的数据格式也许不太适合前端直接使用，前端所需的排序功能、筛选功能，以及到了视图层的页面展现，也许都需要对接口所提供的数据进行二次处理。这些处理虽可以放在前端来进行，但也许数据量一大便会浪费浏览器性能。因而现今，增加node端便是一种良好的解决方案。

在我的微信小程序demo的server端代码中，我通过http模块对真实后台（网易云音乐API）发起http请求，然后通过express模块搭建后端服务。

发起请求：

// http.js
var formatURL = require('./formatURL.js');
var http = require('http');
const POSThttp = function(request){
  return new Promise((resolve, reject) => {
    let body = '';
    // http模块拿到真实后台api的数据
    http.get(formatURL(request.body.musicname), function(res){
      res.on('data', (data) => {
        body += data;
      }).on('end', () => {
        // 格式化
        const {
          name,
          audio: musicUrl,
          page,
          album: {
            name: musicName,
            picUrl,
          },
          artists: [{
            name: singer,
          }],
        } = JSON.parse(body).result.songs[0];
        const reply = {
          name,
          picUrl,
          musicUrl,
          page,
          singer,
        };
        resolve(reply);
      });
    });
  });
};
module.exports = POSThttp;
得到数据传回前端：

var express = require('express');
var POSThttp = require('./POSThttp.js');
var bodyParser = require('body-parser');
// 使用body-parser解析post请求的参数，如果没有，req.body为undefined。
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/', (req, res) => {
  POSThttp(req).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});
app.listen(3000, () => {
  console.log('open wx-audio server successful!')
});
这几十行代码也就实现了一个简单的中间层的demo，并做到了在中间层格式化参数，便于前端进行使用的过程。

为什么需要中间层？
其实这个问题，我认为跟面试常考的题：“为什么需要前后端分离？”是类似的，其原因可以归纳为以下几点：

现今网站存在问题
之前有向一位在百度有多年工作经验的老前辈交谈这类问题，我所提到的搜狐公司代码冗余、前后端耦合的问题，他是这么回答并且给予我这样的建议：




其实，提炼出来，现今大公司的老项目（包括百度、搜狐等公司所采用的后端渲染等），或多或少都会存在这样的一些 问题 ：

前端代码越来越复杂
前后端依旧高度耦合
无法良好的支持跨终端
前辈们提出的解决方案
参考 淘宝前后端分离解决方案

前端代码越来越复杂，我们希望尽可能地减少工作量，开始使用类似MV*的分层结构，使前端后分离成为必要。
前端需要处理更多的工作，希望有权操控View，Router（如：SPA的尝试）
各种终端设备的兴起，需要我们把页面适配到更多的地方。
开始：我们所尝试的CLIENT-SIDE MV* 框架，后端暴露数据接口、处理业务逻辑，前端接收数据、处理渲染逻辑。

关于MVC的定义：

MVC是一种设计模式，它将应用划分为3个部分：数据（模型）、展现层（视图）和用户交互（控制器）。换句话说，一个事件的发生是这样的过程：
　　1. 用户和应用产生交互。
　　2. 控制器的事件处理器被触发。
　　3. 控制器从模型中请求数据，并将其交给视图。
　　4. 视图将数据呈现给用户。
我们不用类库或框架就可以实现这种MVC架构模式。关键是要将MVC的每部分按照职责进行划分，将代码清晰地分割为若干部分，并保持良好的解耦。这样可以对每个部分进行独立开发、测试和维护。

如：Backbone, EmberJS, KnockoutJS, AngularJS等框架。


但这样的方式仍旧存在问题：

各层职责重叠
Client-side Model 是 Server-side Model 的加工
Client-side View 跟 Server-side是 不同层次的东西
Client-side的Controller 跟 Sever-side的Controller 各搞各的
Client-side的Route 但是 Server-side 可能没有
性能问题
渲染，取值都在客户端进行，有性能的问题
需要等待资源到齐才能进行，会有短暂白屏与闪动
在移动设备低速网路的体验奇差无比
重用问题
模版无法重用，造成维护上的麻烦与不一致
逻辑无法重用，前端的校验后端仍须在做一次
路由无法重用，前端的路由在后端未必存在
跨终端问题
业务太靠前，导致不同端重复实现
逻辑太靠前，造成维护上的不易
渲染都在客户端，模版无法重用，SEO实现 麻烦
NodeJS作为中间层的全栈开发方案
有了NodeJS之后，前端可以更加专注于视图层，而让更多的数据逻辑放在Node层处理。


我们使用Node层：

转发数据，串接服务
路由设计，控制逻辑
渲染页面，体验优化
中间层带来的性能问题，在异步ajax转成同步渲染过程中得到平衡
更多的可能
其实更为重要的是，对于前端来说，NodeJS的学习成本是相当低的：我们无需学习一门新的语言，就能做到以前开发帮我们做的事情，一切都显得那么自然。

技术在不断变化中，唯有跟上技术革新的浪潮，才能不被时代所淘汰，不管是人还是企业。