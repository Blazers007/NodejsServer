var express = require('express');
var fp = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var fs = require('fs');
var hbs = require('express-hbs');
var connect = require('connect');
/* 各部分的路由 */
var routes = require('./routes/index');
var route_weixin = require('./routes/weixin');

/* 初始化操作 */
var os = require('os');
console.log("Platform: " + os.platform() + "  Version: " + os.release() + " Type: " + os.type());
console.log("Current Directory: " + process.cwd());

/* 读取文件IO测试 */
fs.readdir("./", function(err, files){
  if (err) throw  err;
  console.log('Root directory: ' + files);
});

/* 获取路径函数 */
function relative(path) {
  return fp.join(__dirname, path);
}

function log(msg) {
  console.log("Console : " + msg);
}

/* 实例化Express */
var app = express();

//app.use(favicon(__dirname + '/public/favicon.ico'));
// 定义日志和输出级别
app.use(logger('dev'));

/* 定义解析POST请求的数据解析器 */
app.use(bodyParser.json());
/* 定义键值对 为true表示全部类型 false表示string*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// 定义COOKIE解析器
app.use(cookieParser());

/* 定义静态文件的目录 express.static是固定方法 返回一个固定对象 默认为 ./public/ 路径 */
app.use(express.static(relative('public')));

/* 设置模板文件的后缀名为 hbs */
app.set('view engine', 'hbs');
/* 设置模板文件的目录 默认为 ./views/ 目录 */
app.set('views', relative('views'));
/* 设置渲染模板 为 HBS 并定义HBS的路径 运行HBS模块 */
app.engine('hbs', hbs.express4({
    partialsDir: [relative('views/partials'), relative('views/partials-other')],
    defaultLayout: relative('views/layout/default.hbs')
}));

/* 设置Session */
app.use(session({
    secret: 'blazers',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*10 // 10分钟过期时间
    }
}));

// Register sync helper
hbs.registerHelper('link', function(text, options) {
    var attrs = [];
    for (var prop in options.hash) {
        attrs.push(prop + '="' + options.hash[prop] + '"');
    }
    return new hbs.SafeString(
        '<a ' + attrs.join(' ') + '>' + text + '</a>'
    );
});

// Register Async helpers
hbs.registerAsyncHelper('readFile', function(filename, cb) {
    fs.readFile(fp.join(viewsDir, filename), 'utf8', function(err, content) {
        if (err) console.error(err);
        cb(new hbs.SafeString(content));
    });
});

// 设置Session
//app.use(session({
//    store: new RedisStore({
//        host: "127.0.0.1",
//        port: 6379,
//        db: "test_session"
//    }),
//    resave:false,
//    saveUninitialized:false,
//    secret: 'keyboard cat'
//}));

/* 设置路由地址 设置了一个中间件 */
app.use('/', routes);
app.use('/weixin', route_weixin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

log("Initialize Server Done!");

module.exports = app;
