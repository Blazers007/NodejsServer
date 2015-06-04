$(function(){
    /* 读取联系人列表 */
    var ContactModel = Bmob.Object.extend("ContactModel");

    var ChatModel = Bmob.Object.extend("ChatModel");
    var query = new Bmob.Query(ChatModel);

    /*Bind contacts click*/
    $(document).on('click', '.contact-item', function() {
        /* 如果没有打开窗口则直接打开 */
        var wrapper = $("#chat-wrapper").show();
        /* 如果有打开的窗口看看是否是当前窗口 */
        var contactId = $(this).attr("contact");
        var tab = $("#conversation-tab");
        if (tab.attr("conversation") == contactId)
            return false;
        /* 若不是当前窗口则重新加载新窗口   -- 关闭减少了一些复杂度 但需要在后期完成对其的优化 */
        //  删除原先的内容
        $("#chat-list").children().remove();
        //  更换标题名字
        tab.attr("conversation", contactId).children('a').text(contactId);
        //  加载信息
        $("#conversation-info").text(contactId);
        //  加载对话
        query.equalTo("toId", '1');
        query.find({
            success: function(objects) {
                fillInData(objects);
            },
            error: function(error) {
                alert(error);
            }
        });
        return false;
    });
});



function fillInData(objects) {
    var message = '';
    for (var i = 0; i < objects.length; i++) {
        message = message + render(objects[i]) + '\n';
    }
    var ul = $("#chat-list");
    ul.html(ul.html() + message);
    /* 滑动到最底部 */
}

function render(content) {
    var msg;
    if (Math.abs(content.get("type")) == 1) {
        msg = content.get('content');
    } else {
        msg = '<img class=\'reply-image\'  src=\''+content.get('content')+'\' />'
    }
    var template;
    if (content.get('type') > 0) {
        template = ''
            + '<li class="odd">'
            + '<a href="#" class="user">'
            + '<img src="/images/patient.png" class="img-responsive avatar_">'
            + ' <span class="user-name">'+content.get('fromId')+'</span> </a>'
            + '<div class="reply-content-box">'
            + '<span class="reply-time">'+content.get('date')+'</span>'
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
            + ' <span class="user-name">'+content.get('fromId')+'</span> </a>'
            + '<div class="reply-content-box">'
            + '<span class="reply-time">'+content.get('date')+'</span>'
            + '<div class="reply-content pr">'
            + '<span class="arrow">&nbsp;</span>'
            + msg
            + '</div></div>'
            + '</div></li>';
    }
    return template;
}