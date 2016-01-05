/**
 * Created by MuYe on 2015/7/8.
 */

define(['dialog', 'ajax'],function(dialog,ajax){

    return {
        bindCollapse : function(){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.td-row');
                var icon1 = $(this).parent().parent().parent().find('span[icon-title="付款"]');
                var icon2 = $(this).parent().parent().parent().find('span[icon-title="打印"]');
                var icon3 = $(this).parent().parent().parent().find('span[icon-title="订单详情"]');
                var icon4 = $(this).parent().parent().parent().find('span[icon-title="付款详情"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon1.html('付款');
                    icon1.addClass('icon-txt');
                    icon1.css("width",'70px');
                    icon2.html('打印');
                    icon2.addClass('icon-txt');
                    icon3.html('订单详情');
                    icon3.addClass('icon-txt');
                    icon4.html('付款详情');
                    icon4.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon1.html('<i class=" glyphicon glyphicon-yen"> </i>');
                    icon1.removeClass('icon-txt');
                    icon1.css("width",'22px');
                    icon2.html('<i class="glyphicon glyphicon-print"> </i>');
                    icon2.removeClass('icon-txt');
                    icon3.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon3.removeClass('icon-txt');
                    icon4.html('<i class="glyphicon glyphicon-ok-circle"> </i>');
                    icon4.removeClass('icon-txt');
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
        bindPayNext : function(){//（临时用来让流程走通）付款，
            $('#purchase_pay-table').on('click','span.is_pay',function(){
                //var val = $(this).attr('data-val');
                var order_id = $(this).attr('data-id');

                ajax.todo('POST', '../PayOrder/doPay', {order_id:order_id},function(resp){
                    if(resp && resp.status === 1){
                        var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                        window.location.href = p1;
                    } else {
                        dialog.popupTip('',resp.info);
                    }
                });

            });
        },
        bindUnPay   : function() {
            var un_pay = 0;
            $('input[class="check-one"]').click(function () {
                var val = $(this).attr('data-val');
                if($(this).attr('checked')){
                    un_pay += parseFloat(val);
                }else{
                    un_pay = (un_pay - parseFloat(val)) > 0 ? un_pay - parseFloat(val):0;
                }
                $('#un_pays').html('￥'+un_pay.toFixed(2));
            });
            $('input[class="check-all"]').click(function(){
                if($(this).attr('checked')){
                    $('input[class="check-one"]').each(function(){
                        var val2 = $(this).attr('data-val');
                        un_pay +=parseFloat(val2);
                    });
                }else{
                    un_pay = 0;
                }
                $('#un_pays').html('￥'+un_pay.toFixed(2));
            });
        }/*,
        bindSubmit  : function(form,order_ids){
            alert(order_ids);
            $(form).ajaxSubmit({
                url: '../Order/paySave',
                data:'{"order_ids":"'+order_ids+'"}',
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status === 1) {
                        var p1 = $.query.set('_',Math.random()).toString();
                        window.location.href = p1;
                    } else {
                        $(form).find('#submitBtn').attr('disabled', false).html('提交');
                        $('#role_name').after('<small class="error">' + resp.info + '</small>');
                    }
                }
            });
        }*/

    }

});
