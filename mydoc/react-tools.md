最简单的安装React Devtools调试工具
2018年07月04日 17:40:05 ygman 阅读数 13311
 版权声明：本文为博主原创文章，转载请注明出处 https://blog.csdn.net/one_girl/article/details/80916232
在运行一个react项目的时候浏览器控制台会提醒你去安装react devtools调试工具

Download the Re最简单的安装React Devtools调试工具
               2018年07月04日 17:40:05 ygman 阅读数 13311
                版权声明：本文为博主原创文章，转载请注明出处 https://blog.csdn.net/one_girl/article/details/80916232
               在运行一个react项目的时候浏览器控制台会提醒你去安装react devtools调试工具
               
               Download the React DevTools for a better development experience: https://fb.me/react-devtools
               1
               但是上面的链接我基本上没打开过
               
               记录下我安装React Devtools调试工具的步骤： 
               1、去git上下载react-devtools文件到本地，https://github.com/facebook/react-devtools 
               这里写图片描述
               
               2、进入到react-devtools-master文件夹，用npm安装依赖
               
               npm --registry https://registry.npm.taobao.org install
               1
               这里写图片描述
               
               3、安装依赖成功后，我们便可以打包一份扩展程序出来
               
               npm run build:extension:chrome 
               1
               这里写图片描述
               出现上面的部分就说明安装成功了 
               并且会在你的项目目录中生成一个新的文件夹，react-devtools -> shells -> chrome -> build -> unpacked文件夹
               
               4、打开chrome扩展程序chrome://extensions/，加载已解压的扩展程序，选择第3步中的生成的unpacked文件夹。这时就会添加一个新的扩展程序react-devtools，并在你的浏览器右上角会有个react标志, 就表示成功啦。 
               这里写图片描述
               这里写图片描述act DevTools for a better development experience: https://fb.me/react-devtools
1
但是上面的链接我基本上没打开过

记录下我安装React Devtools调试工具的步骤： 
1、去git上下载react-devtools文件到本地，https://github.com/facebook/react-devtools 
这里写图片描述

2、进入到react-devtools-master文件夹，用npm安装依赖

npm --registry https://registry.npm.taobao.org install
1
这里写图片描述

3、安装依赖成功后，我们便可以打包一份扩展程序出来

npm run build:extension:chrome 
1
这里写图片描述
出现上面的部分就说明安装成功了 
并且会在你的项目目录中生成一个新的文件夹，react-devtools -> shells -> chrome -> build -> unpacked文件夹

4、打开chrome扩展程序chrome://extensions/，加载已解压的扩展程序，选择第3步中的生成的unpacked文件夹。这时就会添加一个新的扩展程序react-devtools，并在你的浏览器右上角会有个react标志, 就表示成功啦。 
这里写图片描述
这里写图片描述