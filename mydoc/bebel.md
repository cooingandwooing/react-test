@babel/preset-env解决的是将高版本写法转化成低版本写法的问题
polyfill的理解：polyfill我们又称垫片，见名知意，所谓垫片也就是垫平不同浏览器或者不同环境下的差异，因为有的环境支持这个函数，有的环境不支持这种函数，
可以简单的把Babel Preset视为Babel Plugin的集合。比如babel-preset-es2015就包含了所有跟ES6转换有关的插件。

@babel/plugin-transform-runtime 所有帮助程序都将引用该模块，@babel/runtime以避免编译输出中的重复。运行时将编译到您的构建中。它会将重复的已require 模块方式引入。

@babel/runtime-corejs2 编译自带ES5语法

@babel/plugin-transform-object-assign 编译Object.assign

@babel/plugin-proposal-class-properties 解析类的属性

@babel/plugin-proposal-decorators  装饰器
