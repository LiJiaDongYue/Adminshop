/**
 * Created by MuYe on 2015/7/8.
 */

define(['dialog'],function(dialog){

    return {
        bindOrderPriceCollapse: function () {
            $('a[data-toggle="collapse"]').click(function () {
                var i = $(this).find('i');
                if (i.hasClass('glyphicon glyphicon-chevron-down')) {
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                }
            });
        },
        bindCollapsePrice : function(){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.text-center');
                var icon3 = $(this).parent().parent().parent().find('span[icon_title="详情"]');
                var icon2 = $(this).parent().parent().parent().find('span[icon_title="打印"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon3.html('详情');
                    icon3.addClass('icon-txt');
                    icon2.html('打印');
                    icon2.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon3.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon3.removeClass('icon-txt');
                    icon2.html('<i class="glyphicon glyphicon-print"> </i>');
                    icon2.removeClass('icon-txt');
                }
            });
            /*$('a[data-toggle="collapse"]').click(function(){
             var i = $(this).find('i');
             if(i.hasClass('glyphicon glyphicon-chevron-down')){
             i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
             } else {
             i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
             }
             });*/
        },
        bindPrice : function(){
            $('.amount_div i').on('click',function(){
                if($(this).hasClass('glyphicon glyphicon-pencil')) {
                    $(this).removeClass('glyphicon glyphicon-pencil').addClass('glyphicon glyphicon-ok');
                    $(this).parent().find('span').hide();
                    $(this).parent().find('input').show();
                } else {
                    $(this).removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-pencil');
                    var span = $(this).parent().find('span');
                    span.show();
                    var oldVal = span.text();
                    var input =  $(this).parent().find('input');
                    input.hide();
                    var id = input.attr('data-id');
                    var name = input.val();
                    if($.trim(name) && id > 0 && oldVal != name){
                        $.ajax({
                            cache: false,
                            type: "GET",
                            url:  '../OrderPrice/priceUpdate?id=' + id + '&price=' + name,
                            dataType: "json",
                            success : function(resp){
                                span.text("￥"+name);
                            }
                        });
                    }
                };
            });
        }
    }

});
