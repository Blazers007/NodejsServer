var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Nodejs & HTML & CSS' ,
    veggies: veggies,
    layout: 'layout/veggie'
    });
});

module.exports = router;