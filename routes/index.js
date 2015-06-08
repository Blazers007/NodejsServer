var express = require('express');
var router = express.Router();
var Bmob = require('bmob').Bmob;


/* Connect to database 这个方法相当于是全局方法 因为NodeJS在读取的时候就会执行该段代码 */
var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://127.0.0.1:27017");
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

/* Init Bmob 来实现管理员验证 */
Bmob.initialize("f0d74dc5fda96aa9becdbd2a0875225c", "d9c4567879453b95bb2b948a801e5691");
var AdminTable = Bmob.Object.extend("AdminTable");
var queryLogin = new Bmob.Query(AdminTable);


/* 登陆界面 */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        /* 已经登陆过 则直接导向主页*/
        res.redirect('/index');
    } else {
        res.render('login', {
            title: 'Heart'
        });
    }
});

/* 登陆的验证 验证通过则保存session 否则重新导向'/'登陆 */
router.post('/', function(req, res, next) {
    console.log("User : [" + req.body.username + "]  try to login");
    /* 向服务器查询用户信息 */
    queryLogin.equalTo('username', req.body.username);
    queryLogin.equalTo('password', req.body.password);
    queryLogin.count({
        success: function(count) {
            if (count) {
                req.session.user = req.body.username;
                return res.redirect('/index');
            }
            return res.redirect('/');
        },
        error : function(error) {
            return res.redirect("/");
        }
    });
});

/* 登出用户 既清空访问该页面的用户的session */
router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});

/* Visit the main page */
router.get('/index', function(req, res, next) {
    if (req.session.user) {
        res.render('index', { title: 'Heart'})
    } else {
        req.session.error = "请先登录";
        res.redirect('/');
    }
});

/* Form Control Page */
router.get('/forms', function(req, res, next) {
    res.render('forms',{
        title: 'Heart'
    })
});

/* Angular test */
router.get('/app', function(req, res, next) {
    res.render('app',{
        title: 'AngularJS'
    })
});


/* 录入到数据库中 */
var blogSchema = new mongoose.Schema({
    name: {type:String},
    age : {type:Number, default: 18},
    gender: {type:Boolean, default: true}
});

var BlogModel = db.model('test1', blogSchema);

router.post('/app', function(req, res, next) {
    //var model = new BlogModel({
    //    name : 'Blazers',
    //    age : 25,
    //    gender: true
    //});
    //model.save(function(error, doc) {
    //    if (error) {
    //        console.log(error);
    //    } else {
    //        console.log(doc);
    //    }
    //});
    BlogModel.find({}, function(error, docs) {
        console.log(docs);
    })
});


module.exports = router;
