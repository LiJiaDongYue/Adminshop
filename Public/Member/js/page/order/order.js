/**
 * Created by MuYe on 2015/7/8.
 */

define(['dialog'],function(dialog){
    return {
        bindCollapse : function(){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.td-row');
                var icon1 = $(this).parent().parent().parent().find('a[icon-title="关闭订单"]');
                var icon2 = $(this).parent().parent().parent().find('a[icon-title="打印"]');
                var icon3 = $(this).parent().parent().parent().find('a[icon-title="配送要求"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon1.html('关闭订单');
                    icon1.css({"width":"70px","margin-bottom":"5px"});
                    icon2.html('打印');
                    icon2.css({"width":"70px","margin-bottom":"5px"});
                    icon3.html('配送要求');
                    icon3.css({"width":"70px","margin-bottom":"5px"});
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon1.html('<i class="glyphicon glyphicon-trash"> </i>');
                    icon1.removeAttr("style")
                    icon2.html('<i class="glyphicon glyphicon-print"> </i>');
                    icon2.removeAttr("style")
                    icon3.html('<i class="glyphicon glyphicon-plane"> </i>');
                    icon3.removeAttr("style")
                }
            });
        },
        change: function (){
            $('#list-time').change(function(){
                var param = $('#search-form').formSerialize();
                var p1 = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        bindCollection: function (){
            $('span[data-name="收藏订单"]').click(function(){
                var num = $(this).attr('data-val');
                var pid = $(this).attr('data-pid');
                var uid = $(this).attr('data-uid');
                var time = new Date().getTime();
                if($(this).hasClass('font-blue')){
                    $(this).removeClass('font-blue').addClass('font-red');
                    //$(this).attr("title","取消收藏订单");
                    $(this).attr("data-original-title","取消收藏订单");
                    var status = 'add';
                } else {
                    $(this).removeClass('font-red').addClass('font-blue');
                    //$(this).attr("title","收藏订单");
                    $(this).attr("data-original-title","收藏订单");
                    var status = 'del';
                }
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../Order/collection?num=' + num + '&pid=' + pid + '&uid=' + uid + '&status=' + status,
                    dataType: "json",
                    success : function(resp){
                        if(!resp || resp.status !== 1){
                            dialog.popupTip('',resp.info);
                        }
                    }
                });
            });
        }
    }
});
