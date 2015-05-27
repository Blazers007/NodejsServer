var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Doctor' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'User Login'})
});

router.post('/login', function(req, res, next) {
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

router.get('/logout', function(req, res, next) {
    res.redirect('/');
});

router.get('/home', function(req, res, next) {
    res.render('home', { title : 'Home', user : 'Admin'})
});

module.exports = router;
