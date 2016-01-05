/**
 * Created by MuYe on 2015/7/8.
 */

define(['dialog','ajaxPage','jForm', 'urlQuery'],function(dialog,ajaxPage){
    return {
        cancel: function() {
            $('#cancel').on('click',function(){
                $('#new-address').modal('hide');
            });
        },
        nextStep : function(param){
            $('.next-step').on('click',function(){
                //var queryString = $('input[name="order_id"]').fieldSerialize();
                var orderId = $('input[name="order_id"]').val();
                var address=new Array();
                $('input[type="checkbox"]:checked').each(function(){
                    if($(this).val()){
                        address.push($(this).val());
                    }
                });
                var addressStr = address.join(',');
                var deliverType = $('input[name="deliver_type"]:checked').val();

                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../Order/deliverRequests_1?job=save&order_id=' + orderId + '&address=' + addressStr + '&deliver_type=' + deliverType,
                    dataType: "json",
                    success : function(resp){
                        if(resp && resp.status === 1){
                            var url = $.query.load("#/order/lists/deliver_2/&" + param);
                            window.location.href =  url;
                        } else {
                            dialog.popupTip('',resp.info);
                        }
                    }
                });


            });

            $('.next-step-2').on('click',function(){
                var isSubmit = true;
                $('tr[class="tr-info"]').each(function(){
                    var qty = parseInt($(this).find("span[date-name='qty']").html());
                    var nums = 0;
                    $(this).find("input").each(function(){
                        var num = $(this).val();
                        nums = parseInt(nums) + parseInt(num);
                    });
                    if(qty != nums) {
                        $(this).find("input").css('border-color', '#f00');
                        isSubmit = false;
                    }
                });
                if (isSubmit) {
                    var form = '#qty-form';
                    $(form).find('.next-step-2').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Order/deliverRequests_3',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                var tab = $.query.load(window.location.hash).get('tab');
                                var url = $.query.load("#/order/lists/&p=1").set('tab',tab);
                                window.location.href =  url;
                            } else {
                                $(form).find('.next-step-2').attr('disabled', false).html('提交财务付款');
                                dialog.popupTip('', resp.info);
                            }
                        }
                    });
                }
            });
            $("#qty-table").find('input').focus(function(){
                $(this).css('border-color',"#ccc");
            });
        }
    }
});
