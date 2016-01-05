/**
 * Created by zq123 on 2015/7/20.
 */
define([],function(){
    return {
        bindCollapsePrice : function (){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.td-row');
                //var icon1 = $(this).parent().parent().parent().find('span[title="付款"]');
                var icon2 = $(this).parent().parent().parent().find('span[icon-title="打印"]');
                var icon3 = $(this).parent().parent().parent().find('span[icon-title="详情"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon2.html('打印');
                    icon2.addClass('icon-txt');
                    icon3.html('详情');
                    icon3.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon2.html('<i class="glyphicon glyphicon-print"> </i>');
                    icon2.removeClass('icon-txt');
                    icon3.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon3.removeClass('icon-txt');
                }
            });
        }
    }
});
