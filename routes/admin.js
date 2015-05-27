var express = require('express');
var router = express.Router();

/* Get Login. */
router.get('/', function(req, res, next) {
    res.render("admin", { title: 'User Login'});
});

module.exports = router;