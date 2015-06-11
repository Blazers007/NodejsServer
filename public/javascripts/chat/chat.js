/* 全局变量 */
var ChatModel;

$(function(){
    /* 聊天页面的信息 当切换到该页面后首先需要读取聊天历史数据 */
    ChatModel = Bmob.Object.extend("ChatModel");

    /* 绑定发送按钮以及回车发送事件 */
    $("#text-area").keydown(function(e) {
        if (e.keyCode == 13) {
            sendMessage();
        }
    });
    $("#send").click(function(){
        sendMessage();
    });

    /* 开始监听聊天信息的更新 页面内维护多个div来容纳用户信息 */
    BmobSocketIo.updateTable("ChatModel");
    BmobSocketIo.updateTable("AppointmentModel");
    BmobSocketIo.onUpdateTable = function(tablename,data) {
        /* 有新的数据更新 首先查看是否已经打开 没有则在右侧联系人添加(添加新的条目或添加圆点提示)*/
        /* 若无则在中间聊天框添加提示 点击后自动清除提示 并根据ID查询数据 该用户的数据存储在？ */
        switch (tablename) {
            case 'ChatModel':
                appendToChat(data);
                break;
            case 'AppointmentModel' :
                appendToTable(data);
                break;
        }
    };


    /* 临时放置 绑定row的点击 弹出model*/
    $(document).on('click', '.appointment-row', function(){
        /* 读取相关信息并生成样式 */
        $('#myModal').modal();
    });

    /* 临时放置 监听提交事件 */
    $('#btn-send-form').click(function(){
        /* 放入一些简单的消息! */
        $.get('/weixin/sendForm', function(data){
            alert(data);
        });
    });
});

/* 根据数据渲染生成 聊天信息 Li */
function appendToChat(content) {
    var msg;
    if (Math.abs(content.type) == 1) {
        msg = content.content;
    } else {
        msg = '<img class=\'reply-image\'  src=\''+content.content+'\' />'
    }
    var template;
    if (content.type > 0) {
        template = ''
            + '<li class="odd">'
            + '<a href="#" class="user">'
            + '<img src="/images/patient.png" class="img-responsive avatar_">'
            + ' <span class="user-name">'+content.fromId+'</span> </a>'
            + '<div class="reply-content-box">'
            + '<span class="reply-time">'+content.date+'</span>'
            + '<div class="reply-content pr">'
            + '<span class="arrow">&nbsp;</span>'
            + msg
            + '</div></div>'
            + '</div></li>';
    } else {
        template =  ''
            + '<li class="even">'
            + '<a href="#" class="user">'
            + '<img src="/images/doctor.png" class="img-responsive avatar_">'
            + ' <span class="user-name">'+content.fromId+'</span> </a>'
            + '<div class="reply-content-box">'
            + '<span class="reply-time">'+content.date+'</span>'
            + '<div class="reply-content pr">'
            + '<span class="arrow">&nbsp;</span>'
            + msg
            + '</div></div>'
            + '</div></li>';
    }
    $("#chat-list").append(template);
}

/* 发送消息 */
function sendMessage() {
    var content = $("#text-area").val();
    $("#text-area").val("");
    var chat = new ChatModel();
    chat.set("type", -1);
    chat.set("content", content);
    chat.set("toId", "1");
    chat.set("fromId", "Doctor");
    chat.set("date", "2015年05月28日22:21:09");
    chat.save(null, {
        success: function(data) {

        },
        error: function(chat, error) {
            // If send failed show the resend button
        }
    });
}

/* 添加并生成列 */
function appendToTable(data) {
    var template = '<tr class="appointment-row">'
    //+ '<td>' + + '</td>'
    + '<td>' + data.appointment + '</td>'
    + '<td>' + data.appointmentDate + '</td>'
    + '<td>' + data.detail + '</td>'
    + '<td>' + data.state + '</td>'
        + '</tr>';
    $('#table-appointment').children('table')
        .append(template);
}




