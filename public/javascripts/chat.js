$(document).ready(function(){

    var template = '<% if ( type > 0) { %>' 
        + '<li class="odd">'
        + '<% } else { %>'
        + '<li class="even">'
        + '<% } %>'
        + '<a href="#" class="user">'
        + '<img src="/images/avatar-1.png" class="img-responsive avatar_">'
        + ' <span class="user-name"><%= sender %></span> </a>'
        + '<div class="reply-content-box">'
        + '<span class="reply-time"><%= date %></span>'
        + '<div class="reply-content pr">'
        + '<span class="arrow">&nbsp;</span>'
        + '<% if (Math.abs(type) == 1) { %>'
        + '<%= content %>'
        + '<% } else if (Math.abs(type) == 2 ) { %>'
        + '<img class=\'reply-image\'  src=\'<%= content %>\' />'
        + '<% } %>'
        + '</div></div></li>';


    Bmob.initialize("f0d74dc5fda96aa9becdbd2a0875225c", "d9c4567879453b95bb2b948a801e5691");
        //  Bind send event

        var ChatModel = Bmob.Object.extend("ChatModel");
        var query = new Bmob.Query(ChatModel);

        $("#send").click(function(){
            var content = $("#text-area").val();
            $("#text-area").val("");
            
            var chat = new ChatModel();
            chat.set("type", -1);
            chat.set("content", content);
            chat.set("toId", "1");
            chat.set("fromId", "患者");
            chat.set("date", "2015年05月28日22:21:09");
            // fill to html
            message = ejs.render(template, {
                'type': -1,
                'content': content,
                'sender': 'Doctor',
                'date': '2015年05月28日22:21:09'
            });
             var ul = $("#chat-list");
             ul.html(ul.html() + message);
            chat.save(null, {
                success: function(data) {

                },
                error: function(chat, error) {
                    // If send failed show the resend button
                }
            });
        });
        BmobSocketIo.initialize("f0d74dc5fda96aa9becdbd2a0875225c");

        // Update table by login doctor id
        BmobSocketIo.updateTable("ChatModel");
        BmobSocketIo.onUpdateTable = function(tablename,data) {    
             message = ejs.render(template, data);
             var ul = $("#chat-list");
             ul.html(ul.html() + message);
        };
})

function render() {

}