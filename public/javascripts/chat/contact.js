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
        // 04  Call replace div function
        return false;
    })

    function ifExistBringItFront(contactId) {
        div.children("li").each(function(index) {
            if ($(this).attr("role") == contactId) {
                return true;
            }
        });
        // Add and return false
        var add = '<li role="presentation"><a href="#">ABC </a></li>'
        return false;
    }
});