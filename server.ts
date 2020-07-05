import Koa from 'koa';

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = 'hello';
  await next();
  ctx.body += ' Eminem';
});

app.use(async (ctx, next) => {
  ctx.body += ' world';
  await next();
});


app.use(async (ctx, next) => {
  ctx.set('Content-Type', 'text/html; charset=utf-8');
  await next();
});


app.listen(3000);
