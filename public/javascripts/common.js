/**
 * Created by liang on 2015/6/4.
 */
$(function() {
    /* 主要功能页的切换操作 */
    var navItems = $("#nav-items").children().click(function() {
        if($(this).hasClass('active'))
            return false;
        navItems.removeClass('active');
        var role = '#' + $(this).addClass('active').attr('role');
        $(".function").hide();
        $(role).show();
    });
});