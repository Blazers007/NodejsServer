var express = require('express');
var router = express.Router();
var Bmob = require('bmob').Bmob;
/* Connect to database */

Bmob.initialize("f0d74dc5fda96aa9becdbd2a0875225c", "d9c4567879453b95bb2b948a801e5691");
var AdminTable = Bmob.Object.extend("AdminTable");
var queryLogin = new Bmob.Query(AdminTable);


router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'Heart'
    });
});

/* Submit data to the login site */
router.post('/', function(req, res, next) {
    console.log("User : [" + req.body.username + "]  try to login");
    /* Get Info from Bmob */
    queryLogin.equalTo('username', req.body.username);
    queryLogin.equalTo('password', req.body.password);
    queryLogin.count({
        success: function(count) {
            if (count)
                return res.redirect('/index');
            return res.redirect('/');
        },
        error : function(error) {
            return res.redirect("/");
        }
    });
});

/* Visit the main page */
router.get('/index', function(req, res, next) {
    res.render('index', { title: 'Heart'})
});

/* Form Control Page */
router.get('/forms', function(req, res, next) {
    res.render('forms',{
        title: 'Heart'
    })
});

module.exports = router;
