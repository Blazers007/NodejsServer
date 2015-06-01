var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    res.render('test', {
        title: 'dev'
    });
})

module.exports = router;