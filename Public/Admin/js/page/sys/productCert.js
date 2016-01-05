/**
 * Created by Administrator on 2015/6/11.
 */
define(['dialog','valid', 'jForm'], function (dialog) {
    return {
        productIsActive : function(){
            $('#productCert-table').on('click','a.is-active',function(){
                var id = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../ProductCert/active?id=' + id + '&flag=' + val,
                    dataType: "json",
                    success : function(resp){
                        if(resp && resp.status === 1){
                            var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                            window.location.href = p1;
                        } else {
                            dialog.popupTip('',resp.info);
                        }
                    }
                });
            });
        },
        validProductCertForm : function () {
            $('#product-cert-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[renzheng_name]': {
                        required: true
                    },
                    'postDB[renzheng_code]': {
                        required: true
                    },
                    'postDB[is_active]': {
                        required: true
                    }
                },
                messages:{
                    'postDB[renzheng_name]': {
                        required: "请填写证书名称"
                    },
                    'postDB[renzheng_code]': {
                        required: "请填写证书编码"
                    },
                    'postDB[is_active]': {
                        required: "请选择是否"
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../ProductCert/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                history.go(-1);
                               // window.location.href = "#sys/productCert/&p=1";
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