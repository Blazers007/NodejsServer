/**
 * Created by liang on 2015/6/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('weixin', {
        title: '微信医生'
    });
});

module.exports = router;