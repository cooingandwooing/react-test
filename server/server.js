const express = require('express'); // nodejs 的方式 模块全部载入
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const favicon = require('serve-favicon');
const isDev = process.env.NODE_ENV === 'development';
const path = require('path');

const app = express();
///public 静态文件
app.use(favicon(path.join(__dirname, '../favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '../dist')));

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default;

  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace('<!-- app -->', appString));
  })
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}
app.listen(3333, function () {
  console.log('server is listening on 3333')
});
