const Koa = require('koa');
const json = require('koa-json');
const views = require('koa-views');
const logger = require('koa-logger');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');

const index = require('./routes/index');
const users = require('./routes/users');

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: '{views}'
}));

app.use(async (ctx, next) => {
  await next();
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

/* 捕获未知结束任务 */
process.on('uncaughtException', function (err) {
  console.error(`uncaughtException : ${err.stack || err}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`unhandledRejection reason: ${reason} -- p: ${p}`);
});

module.exports = app;
