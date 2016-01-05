/**
 * Created by MuYe on 2015/7/8.
 */

define(['dialog','valid','jForm','urlQuery'], function (dialog) {
    return {
        orderDelivery : function(){
            $('#delivery-order-form').validate({
                submitHandler: function (form) {
                    $(form).find('.submitOrderBtn').attr('disabled',true).html('确定发货中...');
                    $(form).ajaxSubmit({
                        url: '../DeliveryOrder/saveSend',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                dialog.popupTip('',resp.info);
                                $(form).find('.submitOrderBtn').attr('disabled',true).html('确定发货');
                                $(form).find('.submitProductPrint').removeAttr("disabled");
                                var id = $(form).find('.submitProductPrint').attr('data-id');
                                var drs = $(form).find('.submitProductPrint').attr('data-val');
                                var url = "../DeliveryOrder/callPrint?order_id="+id+"&r_address_id="+drs;
                                $(form).find('.submitProductPrint').attr("href",url);
                            } else {
                                dialog.popupTip('','发货操作失败！');
                                $(form).find('.submitOrderBtn').attr('disabled',false).html('确定发货');
                            }
                        }
                    });
                }
            });
        },
        bindDeliveryOrderCollapse: function () {
            $('a[data-toggle="collapse"]').click(function () {
                var i = $(this).find('i');
                if (i.hasClass('glyphicon glyphicon-chevron-down')) {
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                }
            });
        },
        bindCollapDeliveryOrder : function(){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.text-center');
                var icon3 = $(this).parent().parent().parent().find('span[icon_title="详情"]');
                var icon2 = $(this).parent().parent().parent().find('span[icon_title="发货"]');
                var icon1 = $(this).parent().parent().parent().find('span[icon_title="打印"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon3.html('详情');
                    icon3.addClass('icon-txt');
                    icon2.html('发货');
                    icon2.addClass('icon-txt');
                    icon1.html('打印');
                    icon1.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon3.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon3.removeClass('icon-txt');
                    icon2.html('<i class="glyphicon glyphicon-send"> </i>');
                    icon2.removeClass('icon-txt');
                    icon1.html('<i class="glyphicon glyphicon-send"> </i>');
                    icon1.removeClass('icon-txt');
                }
            });
        }
    }

});
