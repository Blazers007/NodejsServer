$(function(){
    /*Bind contacts click*/
    var div = $("#contact-tab");
    $(".contact-item").click(function() {
        // 00  If not show the chat div  show it
        // 01  Get this item info
        contactId = $(this).attr("contact");
        // 02  Get target ul element  --- div
        // 03  Compare if exist  if   bring it front   else  add to it  
        ifExistBringItFront(contactId);
        // 04  Call replace div function if add then adjust the div scrollbar
        return false;
    })

    function ifExistBringItFront(contactId) {
        div.children().removeClass("active")
        var tag = false;
        div.children("li").each(function(index) {
            if ($(this).attr("conversation") == contactId) {
                tag = true;
                $(this).addClass("active").attr("conversation", contactId).insertBefore(div.children().first());
                return false;
            }
        });
        // Add and return false
        if (!tag) {
            var add = '<li role="presentation" class="active" conversation="'+contactId+'"><a href="#">'+contactId+'</a></li>';
            div.children("li").first().before(add);
        }
        return tag;
    }
});