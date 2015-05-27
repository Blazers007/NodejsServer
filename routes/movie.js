/**
 * Created by Blazers on 15/5/27.
 */
var express = require('express');
var router = express.Router();

var Movie = require('./../models/Movie.js');

/* Add page. */
router.get('/add', function(req, res, next) {
    if (req.params.name) {
        return res.render('movie', {
            title:req.params.name+'|电影|管理|moive.me',
            label:'编辑电影:'+req.params.name,
            movie:req.params.name
        })
    } else {
        return res.render('movie',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影',
            movie:false
        });
    }
});

/* Commit add */
router.post('/add', function(req, res, next) {
    res.send({'success':true});
});

/* Query */
router.get('/:name', function(req, res, next) {
    var user = {
        username : 'admin',
        password : '1'
    }
    /* Check */
    if (req.body.username === user.username && req.body.password === user.password) {
        /* Must return or code will go on and make error! */
        return res.redirect('/home');
    }
    res.redirect("/login");
});


/* JSON */
router.get('/json/:name', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;
