/* 负责调度管理企业号 http://doxmate.cool/node-webot/wechat-enterprise/Getting%20start.html */
var express = require('express');
var router = express.route();
var API = require('wechat').API;
var api = new API('appid', 'secret', 'agentid');

module.exports = router;