$(document).ready(function(){
        Bmob.initialize("f0d74dc5fda96aa9becdbd2a0875225c", "d9c4567879453b95bb2b948a801e5691");
        var ChatModel = Bmob.Object.extend("ChatModel");
        var query = new Bmob.Query(ChatModel);

        $("#text-area").keydown(function(e) {
            if (e.keyCode == 13) {
                sendMessage();
            }
        });

        $("#send").click(function(){
            sendMessage();
        });


        BmobSocketIo.initialize("f0d74dc5fda96aa9becdbd2a0875225c");
        // Update table by login doctor id
        BmobSocketIo.updateTable("ChatModel");
        BmobSocketIo.onUpdateTable = function(tablename,data) {    
             message = render(data);
             ul = $("#chat-list");
             ul.html(ul.html() + message);
        };

        /* Render Function*/
        function render(content) {
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
            return template;
        }

        function sendMessage() {
            var content = $("#text-area").val();
            $("#text-area").val("");
            var chat = new ChatModel();
            chat.set("type", -1);
            chat.set("content", content);
            chat.set("toId", "1");
            chat.set("fromId", "Doctor");
            chat.set("date", "2015年05月28日22:21:09");
            // fill to html
            message = render({
                'type': -1,
                'content': content,
                'sender': '医生',
                'date': '2015年05月28日22:21:09'
            });
             // var ul = $("#chat-list");
             // ul.html(ul.html() + message);
            chat.save(null, {
                success: function(data) {

                },
                error: function(chat, error) {
                    // If send failed show the resend button
                }
            });
        }
});