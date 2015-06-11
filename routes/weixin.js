/**
 * Created by liang on 2015/6/11.
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var bl = require('bl');
/* 读取配置项 */
var setting = require('../setting.json');


/*localhost:3000/weixin/*/
router.get('/', function(req, res, next) {
    /* 获取根据角色取出不同的secret token */
    https.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+setting.corpid+'&corpsecret='+setting.corpsecret, function(response) {
        response.setEncoding('utf-8');
        response.pipe(bl(function(err, data){
            if (err) {
                res.render('weixin',{
                    title: '企业号发送',
                    message: '认证失败!请重新刷新本页面'
                })
            } else {
               /* 转化json */
                var json = JSON.parse(data.toString());
                if (json.errcode) {
                    console.log(json.errmsg);
                    res.render('weixin',{
                        title: '企业号发送',
                        message: json.errmsg,
                    })
                } else {
                    console.log(json.access_token);
                    token = json.access_token;
                    res.render('weixin',{
                        title: '企业号发送',
                        message: json.access_token,
                        token: json.access_token,
                    })
                }
            }
        }));
    });
});

router.get('/send', function(req, res, next) {
    /* 避免再次判断是否过期 直接请求token后再次进行上传 */
    /* 如果有文本 媒体消息 需要首先调用上传文件 并获取id后进行上传 */
    /* 指定分组 内容 类型 进行 json 的组装 */
    var data = JSON.stringify({
        "touser": "admin",
        "msgtype": "text",
        "agentid": "0",
        "text": {
            "content": req.query.message/* 需要先对数据进行校验  并返回处理结果 */
        },
        "safe":"0"
    });
    var options = {
        hostname: 'qyapi.weixin.qq.com',
        path: '/cgi-bin/message/send?access_token=A1uY5ee0SslSaQPwKD1pJ-9k2mcggafMRtDnLfRH9EvA8PL-wGXHby59_IkyuEdP',
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };

    var request = https.request(options, function(response) {
        console.log("statusCode: ", response.statusCode);
        console.log("headers: ", response.headers);
        response.on('data', function(d) {
            process.stdout.write(d);
        });
        res.end('done');
    });
    request.write(data.toString());
    request.end();
    request.on('error', function(e){
        console.log(e);
        res.end('error');
    });
});


/* 根据收到的参数组装并生成查询Url并转发给指定的用户 并反馈这次的操作结果 */
router.get('/sendForm', function(req, res, next) {
    getToken(function(err, token){
        if (err) throw err;
        if (token) {
            /* 根据种类生成Url与参数 */
            var url = formUrl();
            var doctor = "张良";
            /* 调用函数封装Body */
            var content = "尊敬的"+ doctor +"医生,您有一份新的复诊预约请求,请点击(" + url + ")查看.如有疑问请致电:" + setting.serviceNumber + "咨询详细情况";
            var data = JSON.stringify({
                "touser": "admin",
                "msgtype": "text",
                "agentid": "0",
                "text": {
                    "content": content/* 需要先对数据进行校验  并返回处理结果 */
                },
                "safe":"0"
            });
            console.log(data);
            /* 拼装Options */
            var options = formOptions(token, data);
            /* 发起请求 并反馈服务人员操作结果 */
            var request = https.request(options, function(response) {
                response.setEncoding('utf-8');
                response.on('data', function(d) {
                    console.log(d);
                    /* 判断结果 */
                    var wechatReturn = JSON.parse(d);
                    if (wechatReturn.errcode === 0 ) {
                        res.end('已经通过微信发送给医生!');
                    } else {
                        res.end(wechatReturn.errmsg)
                    }
                });

            });
            request.write(data.toString());
            request.end();
            request.on('error', function(e){
                console.log(e);
                res.end('error');
            });
        }
    })
});

/* 以下为封装的方法 */
function getToken(callback){
    https.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+setting.corpid+'&corpsecret='+setting.corpsecret, function(response) {
        response.setEncoding('utf-8');
        response.pipe(bl(function(err, data){
            if (err) {
                callback(err);
            } else {
                /* 转化json */
                var json = JSON.parse(data.toString());
                if (json.errcode) {
                    console.log(json.errmsg);
                    /* 提示获取失败 */
                    callback(null, null);
                } else {
                    console.log(json.access_token);
                    callback(null, json.access_token);
                }
            }
        }));
    });
}

/* 最好能直接生成本地的网站 则不需要在搭建在BAE GAE 等云上面 便于维护与开发 */
function formUrl() {
    return "http://blazers.duapp.com"
}

function formOptions(token, data) {
    console.log(Buffer.byteLength(data, 'utf8'));
    return {
        hostname: 'qyapi.weixin.qq.com',
        path: '/cgi-bin/message/send?access_token=' + token,
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json;charset=UTF-8',
            'Content-Length': Buffer.byteLength(data, 'utf8') /* 由于中文的原因 导致如果果断则认为文档已经传输完毕 无法读取到 content 的内容 */
        }
    }
}

module.exports = router;