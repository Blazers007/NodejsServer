/**
 * Created by liang on 2015/6/11.
 */
var main = function() {
    /* 由于https的限定无法使用ajax直接读取消息? 是否有解决跨与的可能性？ */

    var messageBox = $('#message');

    $('#btn-send').click(function(){
        var message = messageBox.val();
        /* Ajas */
        $.get('/weixin/send',{'message': message}, function(data){
            alert(data);
        });
        /* empty */
        messageBox.val('');

    });
};

$(document).ready(main);