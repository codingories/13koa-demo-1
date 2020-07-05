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
