const app = require('koa')();
const logger = require('koa-logger');
const json = require('koa-json');
const views = require('koa-views');
const onerror = require('koa-onerror');
const router = require("koa-router")();

const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: '{views}'
}));
app.use(require('koa-bodyparser')());
app.use(json());
if (process.env.NODE_ENV !== 'production')
  app.use(logger());

app.use(function* (next) {
  yield next;
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

// mount root routes
app.use(router.routes());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

/* 捕获未知结束任务 */
process.on('uncaughtException', function (err) {
  console.log(err);
});

module.exports = app;
