require('babel-polyfill');
const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const webpack = require('webpack');
const proxy = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const clientConfig = require('../build/webpack.client.dev');
const serverConfig = require('../build/webpack.server.dev');
// const proxyUser = require('./proxy');

// const apiServerHost = 'http://127.0.0.1:3001'
// process.env.BASE_URL = apiServerHost
const DEV = process.env.NODE_ENV === 'development';
const publicPath = clientConfig.output.publicPath;
const outputPath = clientConfig.output.path;
const app = express();

const envDevPath = path.join(__dirname, '../.env.dev')
const envExamplePath = path.join(__dirname, '../.env.example')
const envProdPath = path.join(__dirname, '../.env.production')

if (DEV) {
  if (fs.existsSync(envDevPath)) {
    console.log('正在使用 .env.dev 文件来配置环境变量');
    dotenv.config({ path: envDevPath });
  } else {
    // 如果没有 .env.dev 文件， 那么就使用 .env.example 文件作为配置文件
    console.log('正在使用 .env.example 文件来配置环境变量');
    dotenv.config({ path: envExamplePath });
  }
} else {
  if (fs.existsSync(envProdPath)) {
    console.log('正在使用 .env.production 文件来配置环境变量');
    dotenv.config({ path: envProdPath });
  } else {
    // 如果没有 .env.production 文件， 那么就使用 .env.example 文件作为配置文件
    console.log('正在使用 .env.example 文件来配置环境变量');
    dotenv.config({ path: envExamplePath });
  }
}

app.use(favicon(path.join(__dirname, '../favicon.ico')));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  '/api',
  proxy({
    target: process.env.PROXY_URL,
    // logLevel: 'debug'
  }),
);

// 因为http-proxy-middleware代理请求post请求时是不需要app.use(bodyParser.json())的
// 因此app.use(bodyParser.json())要在http-proxy-middleware之后使用 否则在post请求时会导致请求发送不出
app.use(bodyParser.json());
// 代理登录接口 存储cookie 保持登录状态
app.use('/user', require('./proxy'));

if (DEV) {
  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  app.use(
    webpackDevMiddleware(multiCompiler, {
      publicPath,
      logLevel: 'warn',
      stats: { colors: true },
    }),
  );
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(
    // keeps serverRender updated with arg: { clientStats, outputPath }
    webpackHotServerMiddleware(multiCompiler, {
      serverRendererOptions: { outputPath },
    }),
  );
} else {
  const clientStats = require('../dist/buildClient/stats.json');
  const serverRender = require('../dist/buildServer/main.js').default;

  app.use(publicPath, express.static(outputPath));
  app.use(serverRender({ clientStats, outputPath }));
}

app.listen(8080, () => {
  // console.log('Listening at http://localhost:8080')
});
