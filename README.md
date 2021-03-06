# 使用typescript + react服务端渲染构建个人博客
[![build status](https://travis-ci.org/cixiu/react-blog.svg?branch=master)](https://travis-ci.org/cixiu/react-blog)

## 前言
在入坑typescript后，一直都是看着ts的文档在写demo。我们知道，学习一门新技术，只写demo是远远不够的，想要熟练的使用新技术那还得自己做点东西出来，在手写项目的过程中，才能将文档中的内容消化理解，慢慢的达到熟练使用。之前一直想做个属于自己的博客，正好自己买的那个1核1G内存乞丐版的阿里云服务器还没到期，那还等什么，动手做把。

关于博客的主体风格，刚开始自己确实是拿不下主意。一直觉得掘金的pc端很清爽，纠结半天，最后干脆就用掘金了风格。所以，这个博客大体与掘金很像，支持**响应式**。

关于ts+react+ssr脚手架，没有使用next，都是自己搭的。自己重新搭个开发环境，一来可以更好的熟悉使用webpack，二来可以更好的定制一些自己想要的开发环境。我想要的是能够实现**按需加载第三方UI组件库**，**支持HRM**，**支持Css-Modules**(不太喜欢css-in-js那一套)，**支持Server-Side-Render**，**支持Code-Splitting**，**与Typescript无缝链接**的一套开发环境。幸运的是，react社区足够繁荣，这样一套开发环境，社区提供的第三方库可以用来实现。因为要去熟悉那些第三方库的使用，所以环境搭起来也算收获不少。

这是一个真正的前后端分离项目，项目共有3套代码：
* 一套[前台的博客页面](https://github.com/cixiu/react-blog)
* 一套[博客后台管理](https://github.com/cixiu/node-blog)页面，我已经把它们分别部署在不同的域名下了，下面有链接地址；
* 另外在[博客后台管理](https://github.com/cixiu/node-blog)仓库还有一套koa2 + mongodb的后端服务代码，它提供了博客所需的各API接口。

## 先睹为快
> 博客地址：https://www.tzpcc.cn/category/test

> 博客后台系统地址：https://manage.tzpcc.cn

> 博客的github地址： https://github.com/cixiu/react-blog

> 博客后台的github地址： https://github.com/cixiu/node-blog

## 项目截图（gif图片大小7M）
![博客截图](https://github.com/cixiu/react-blog/blob/master/screenshots/all.gif)

## 为什么使用Tyepscript
Typescript是Javascript的超集，这意味着他支持所有的Javascript语法。并在此之上对Javascript添加了一些扩展，如 class / interface / module 等。这样会大大提升代码的可阅读性。

Typescript强类型语言带来的如下好处：
  * 静态类型检查
  * IDE智能提示
  * 代码重构
  * 可读性

Typescript能够解决Javascript的弱类型所带来的痛点。有这么多优势，还有什么理由不使用呢。

### Typescript使用感受
1. 2017年入坑typescript，学习ts的时候，对着文档一个demo一个的写，由于ts是js的超集，所以与js的语法一致，学习起来并不难。在写完各种demo的时候，ts的静态类型检查和代码提示真的打动了我，编码体验提升了不少。
2. Typescript与框架的结合会出现各种各样的问题。如果是自己配置开发环境，你需要去找webpack对ts支持的loader和插件。由于ts代替了babel,很多babel插件不能使用了。还有一些小众的第三方库没有.d.ts文件，需要自己动手写。除了webpack,babel,.d.ts文件等问题，还有一些ts+react语法的问题，刚开始的时候，会出现各式各样的报错，让人很想放弃的。不过，踩完这些坑之后，那就是Typescript真好用。

    ![typescript is so good](https://github.com/cixiu/react-blog/blob/master/screenshots/wangjingze.gif)

3. 个人的博客项目的前端和后台系统都是用的tyepscript + react写的。在规划项目的时候，我将后台系统和node提供的后台接口服务写在了一个仓库里。考虑后台的东西都在一个仓库里，开发期需要独立开一个 tsc -w 独立进程来构建代码，带来临时文件位置纠结以及 npm scripts 复杂化。所以node后台就没有使用ts了。但是，当后台接口服务的代码多起来后，就开始想使用ts了。真是自从用了Typescript之后,再也不想用Javascript了。

## 项目说明
### 技术栈
> react + redux + typescript + webpack + server-side-rendering + code-splitting + css-modules

> 第三方UI组件库：Ant Design

> markdown编辑器：simplemde

> 富文本编辑器：Quill

#### 技术栈使用说明
##### 1. 为什么不用react-router?
答：我们来看下react-router官网上怎么说的。下图是react-router官网截图:

  ![react-router](https://github.com/cixiu/react-blog/raw/master/screenshots/react-router.png)

react官方把code-spliting + server-side-rendering问题的解决方法抛给了开发者个人。幸运的是，react社区足够繁荣，社区已经有造好的轮子来解决这个痛点了。在这里使用 [redux-first-router](https://github.com/faceyspacey/redux-first-router) , [react-universal-component](https://github.com/faceyspacey/react-universal-component) , [babel-plugin-universal-import](https://github.com/faceyspacey/babel-plugin-universal-import) ,  [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) 第三方库配合来做(code-spliting)懒加载。

##### 2. 为什么不使用webpack4?
答：项目开始的时候webpack4正式版本还没有发布。在webpack4发布后，升级到webpack4，项目直接报错。目前(2018-5-25)， [faceyspacey](https://github.com/faceyspacey)所维护的一套为code-spliting做的插件和库还没有支持webpack4。最近在`webpack-flush-chunks`项目的issue下说，在react发布17版本前是不打算在做更新了。所以最快的解决办法使用webpack3。

##### 3. 为什么使用服务端渲染?
答：服务端渲染优势:
  * 服务端直出 HTML 文档，让搜索引擎更容易读取页面内容，有利于 SEO。
  * 不需要客户端执行 JS 就能直接渲染出页面，大大减少了页面白屏的时间。

### 功能介绍
- [x] 用户的登录和注册
- [x] 文章分类
- [x] 文章详情
- [x] 用户对评论的点赞
- [x] 用户对文章评论
- [x] 图片的缩放
- [ ] 用户对文章的收藏 - 暂不支持
- [ ] 文章搜索 - 暂不支持
- [ ] 用户个人中心 - 暂不支持
- [ ] 消息通知 - 暂不支持


## 开发环境调试问题
> 开发环境运行项目使用了webpack-dev-middleware@2.0.6运行项目，并不能成功的把es6语法完全转化为es5，所以在不支持es6的浏览器中会报错例如大部分android自带低版本的浏览器

## 项目运行
> 注意: 这是博客的前台页面，运行项目前先需要开启后端服务。[博客后端项目地址](https://github.com/cixiu/node-blog)入口
```sh
git clone https://github.com/cixiu/react-blog.git

cd react-blog

# 安装依赖
npm install

# 启动本地前端项目
npm start
```
