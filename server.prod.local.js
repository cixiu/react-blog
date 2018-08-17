// process.env.NODE_ENV = 'production';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const favicon = require('serve-favicon');
const proxy = require('http-proxy-middleware');
const dotenv = require('dotenv');
const clientConfig = require('./build/webpack.client.prod');

const outputPath = clientConfig.output.path;
const app = express();

dotenv.config({ path: '.env.test' });

app.use(favicon(path.join(__dirname, './favicon.ico')));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 线上发布使用nginx进行反向代理
app.use(
  '/api',
  proxy({
    target: process.env.PROXY_URL,
  }),
);

// 因为http-proxy-middleware代理请求post请求时是不需要app.use(bodyParser.json())的
// 因此app.use(bodyParser.json())要在http-proxy-middleware之后使用 否则在post请求时会导致请求发送不出
app.use(bodyParser.json());
// 代理登录接口 存储cookie 保持登录状态
app.use('/user', require('./server/proxy'));

const clientStats = require('./dist/buildClient/stats.json');
const serverRender = require('./dist/buildServer/main.js').default;

app.use(express.static(outputPath));
app.use(serverRender({ clientStats, outputPath }));

const port = process.env.PORT || 9003;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
