/**
 * Created by zq123 on 2015/7/13.
 */
define(['dialog','valid','jForm','urlQuery'],function(dialog){
    return {
        bindCollapse : function(){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = parseInt($(this).attr('data-row')) + 1;
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.td-row');
                var icon1 = $(this).parent().parent().parent().find('span[icon-title="确认收款"]');
                // icon2 = $(this).parent().parent().parent().find('span[title="打印"]');
                var icon3 = $(this).parent().parent().parent().find('span[icon-title="详情"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon1.html('确认收款');
                    icon1.addClass('icon-txt');
                    //icon2.html('打印');
                    //icon2.addClass('icon-txt');
                    icon3.html('&nbsp;&nbsp;&nbsp;详&nbsp;情&nbsp;&nbsp;&nbsp;');
                    icon3.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon1.html('<i class=" glyphicon glyphicon-ok"> </i>');
                    icon1.removeClass('icon-txt');
                    //icon1.css("width",'22px');
                    //icon2.html('<i class="glyphicon glyphicon-print"> </i>');
                    //icon2.removeClass('icon-txt');
                    icon3.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon3.removeClass('icon-txt');
                }
            });
        },
        bindConfirm : function (){
            $('#confirm-table').on('click', 'a.is_pay_confirm', function(){
                var id = $(this).attr('data-id');
                var order_num = $(this).attr('data-val');
                var qy_name = $(this).attr('data-name');

                //var actType = $(this).attr('data-actType');
                var actnumT = $(this).attr('data-actnumT');
                var actnamT = $(this).attr('data-actnamT');
                $('#order_id').val(id);
                $('#order_number').html(order_num);
                $('#qy_name').html(qy_name);
            });
        },
        bindPayConfirmForm : function(ajaxPage){//自动代入的方式
            $(function(){
                $('#PayConfirmModal').on('focusin','#comment',function(){
                    $(this).next('small').html('');
                });
                $('#PayConfirmModal').on('click','#modalBtn',function(){
                    if($('#comment').val()==''){
                        $('#comment').next('small').html('该项不能为空');
                    }else{
                        ajaxPage.submitModal();
                        $('#PayConfirmModal').modal('hide')
                    }

                });
            });
        },
        validForm : function (){
            $('#is_confirm-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[comment]': {
                        required: true
                    }
                },
                messages: {
                    'postDB[comment]': {
                        required: "请填写备注"
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../PayConfirm/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                $('#myModal').modal('hide');
                                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                window.location.href = p1;
                            } else {
                                $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });
        }
    }
});
