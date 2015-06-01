var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');

// 创建Express实例
var app = express();

// 定义EJS模板引擎和模板文件位置  JADE 也可
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义COOKIE解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', routes);
app.use('/users', users);
app.use('/dev', test);
app.use("/admin", require('./routes/admin'));

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

/* Mongoose DB */
//var Mongodb = require("mongodb"),
//    Db = Mongodb.Db,
//    Connection = Mongodb.Connection,
//    Server = Mongodb.Server;
//
//var mongo = new Db("testDb",new Server("localhost",Connection.DEFAULT_PORT),{safe:true});
//
//mongo.open(function(err,db){
//  db.collection("test_table",function(err,collection){
//    collection.save({name:'Test 01'},{safe:true},function(err,app){
//      mongo.close();
//      console.log(app);
//    });
//  });
//})

module.exports = app;
