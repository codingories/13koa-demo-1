---
title: 高级前端养成13nodeJS框架03之Koa全解
date: 2020-07-05 11:38:28
tags: 高级前端
---

1. Koa 的时间线

- Express
  - 2010 年 6 月,TJ 开始编写 Exporess
  - 2014 年发展到 v0.12,基本成熟，移交 StrongLoop
- Koa

  - 2013 年 8 月,TJ 开始编写 Koa
  - 2015 年 8 月，Koa 发布 v1.0.0 版本

- Node.js
  - 2013 年 3 月，Node.js v0.10 发布
  - 2014 年 12 月，io.js 不满 Node.js 的管理发起分裂
  - 2015 年 2 月，Node.js v0.12 发布
  - 2015 年 9 月，Node.js 与 io.js 合并成为 Node.js v4.0
- koa 对 Node.js 的支持
  - 2015 年 2 月，Koa 放弃对 Node v0.11 以下的支持，并开始支持 io,js
  - 2015 年 10 月，Koa 放弃对 Node v4.0 以下的支持，并用 ES6 重写所有代码，发布 v2.0.0 内测版

2. Koa 对比 Express

- 编程模型不同
  - Express 的中间件是线型的
  - Koa 的中间件是 U 型的
- 对语言特性的使用不同
  - Express 使用回调函数 next()
  - Koa v1.x 使用 generator 语法
  - Koa v2.x 使用 async/await 语法
- 总结
  - 2011 ～ 2016 年，大概率使用 Express
  - 2017 年之后，可能会使用 Koa

3. Koa 的中间件的模型

- ![koa模型.png](https://i.loli.net/2020/07/05/CpeNvzrWQA9toaG.png)

4. 工具安装

- node-dev
- ts-node-dev
- 注意
  - 如果用 ts,需要运行 tsc --init 初始化 tsconfig.json
  - 还需要安装@types/koa

5. koa 的 hello world

```
yarn add koa
yarn add @types/koa
tsc --init
```

6. await next() 是什么意思

```
app.use(async (ctx, next) => {
  // 空
  await next(); // 等待 下一个中间件
  const time = ctx.response.get('X-Response-Time');
  console.log(`${ctx.url} - ${time}`);
});
```

- next() 表示进入下一个函数
- 下一个函数会返回一个 Promise 对象，称为 p
- 下一个函数所有代码执行完毕后，将 p 置为成功
- await 会等待 p 成功后，再回头执行剩余代码

7. await next()改写成 promise 的写法

```
app.use(async (ctx, next) => {
  const start = Date.now();
  return next().then(()=>{
    const time = ctx.response.get('X-Response-Time');
    console.log(`${ctx.url} - ${time}`);
  })
});
```

- 一定要写 return ,因为中间件必须返回 Promise 对象
- 错误处理再这里有点反模式，因为你不知道下一个中间件会产生什么错误，这么写就耦合了，用 app.on('error 更方便点')

8. 思考

- Express 里如何计算 response time
  - 思路一: 用两个 app.use 加 res.locals
  - 思路二: 搜业界方案，看源码
  - 推荐带着问题看源码,tj 做了两件事情，1.记录开始时间 process.hrtime(startAt)，2.调用 onHeader 库知道用户什么时候写 header,

9. koa 的 api

   - app.xxx // application
     - [文档](https://koajs.com/#application)
     - API
       - app.env
       - app.proxy
       - app.subdomainOffset
       - app.listen()
       - app.callback()
       - **app.use(fn)--插入中间件**
       - app.keys
       - app.context 见 ctx
       - **app.on('error',fn)--错误处理**
       - **app.emit--触发时间**
   - ctx.xxx // context

     - [文档](https://koajs.com/#context)
     - API

       - ctx.req // Node.js 封装的请求
       - ctx.res
       - ctx.request // KOA 封装的 js 请求
       - crx.response
       - crx.state--跨中间件分享数据
       - ctx.app
       - ctx.cookies.get/set
       - ctx.throw
       - ctx.assert
       - ctx.respond 不推荐使用
       - request 委托，response 委托

         ```
          // ctx.body = 'hi'
          // ctx.response.body = 'hi'
          // 称ctx是response的委托
          // 委托模式的源代码实现
         Object.defineProperty(ctx, 'body', {
           get(){
             return ctx.response.body
           },
           set(v){
             ctx.response.body = v
           }
         })
         ```

       - 建议直接用真实的方法，因为容易混

10. ctx.request.xxx

- request.method
- request.path
- request.query
- request.idempotent,幂等，多次操作是否会有一样的影响。get 有，get 获取几次都一样。post,一遍两遍是不一样的。幂等不管多少次都一样，http 中常用只有 get 是幂等的，还有 option
- request.get(field)

11. ctx.response.xxx
    -response.status
    -response.body*5,string 字符串，buffer 文件读到内存里就是 Buffer,也就是没有文件编码的内容,Stream 流，json 化的 Object,null
    -response.set()*2 key value 和对象
    -response.append()，添加响应头

12. 总结

- Koa 原理
  - 封装请求和响应
  - 通过 U 型模型
- 跟 Express 的区别
  - 模型不同
  - 语法特性不同 7.6.0 版本之后完全支持
  - 没有内置中间件
- Koa API
  - 平平无奇，几乎和 Express 一样

13. 谁在用 Koa

- egg.js
- next.js(推荐)/NUXT/Nest

14. [案例代码](https://github.com/codingories/13koa-demo-1)
