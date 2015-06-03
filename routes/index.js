var express = require('express');
var router = express.Router();


/* User Goto the Root of the Root
        One router likes a folder
. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Nodejs & HTML & CSS' ,
    content: 'Hello world!'
    });
});

/* Visit the login site */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'User Login'})
});

/* Submit data to the login site */
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

/* visit the logout site */
router.get('/logout', function(req, res, next) {
    res.redirect('/');
});

/* rediect to HOME */
router.get('/home', function(req, res, next) {
    res.render('home', { title : 'Home', user : 'Admin'})
});

/* TODO:how to rediect user form here to another router's subsites? */

module.exports = router;
