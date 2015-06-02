var express = require('express');
var fp = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var hbs = require('express-hbs');
/* materialize-css */

var routes = require('./routes/index');
// 创建Express实例
var app = express();

 function relative(path) {
    return fp.join(__dirname, path);
  }
  
 var viewsDir = relative('views');

//app.use(favicon(__dirname + '/public/favicon.ico'));
// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义COOKIE解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(relative('public')));

  // Hook in express-hbs and tell it where known directories reside
  app.engine('hbs', hbs.express4({
    partialsDir: [relative('views/partials'), relative('views/partials-other')],
    defaultLayout: relative('views/layout/default.hbs')
  }));
  app.set('view engine', 'hbs');
  app.set('views', viewsDir);

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


// 匹配路径和路由
app.use('/', routes);

// Use simple Routers

app.get('/login', function(req, res, next) {
  res.render('login', {
    title: "Login Page"
  })
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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

module.exports = app;
