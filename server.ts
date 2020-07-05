import Koa from 'koa';

const app = new Koa();

// 记录开始到写完hello world整个的用时
app.use(async (ctx, next) => {
  // 空
  await next();
  const time = ctx.response.get('X-Response-Time');
  console.log(`${ctx.url} - ${time}`);
});

app.use(async (ctx, next) => {
  const start = Date.now(); // 记录开始时间
  await next();
  const time = Date.now() - start; // 记录结束时间 - start = 总耗时
  ctx.set('X-Response-Time', `${time}ms`); // 写到response header里
});

app.use(async ctx => {
  ctx.body = 'Hello World';
  for(let i=0; i<= 10000;i++){
    ctx.body += ' Hello World'
  }

  // 最后中间件可以不写 await next()
});


app.listen(3000);
