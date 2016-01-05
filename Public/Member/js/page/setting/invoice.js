/**
 * Created by Administrator on 2015/6/11.
 */
define(['dialog','valid', 'jForm'], function (dialog) {
    return {
        validInvocieForm : function () {
            // 联系电话(手机/电话皆可)验证
            jQuery.validator.addMethod("isTel", function(value,element) {
                var length = value.length;
                var mobile = /^(((13[0-9]{1})|(12[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
                return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));
            }, "请正确填写您的联系方式");
            $('#invoice-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[company_name]': {
                        required: true
                    },
                    'postDB[identification_number]': {
                        required: true
                    },
                    'postDB[address]': {
                        required: true
                    },
                    'postDB[telphone]': {
                        required: true,
                        isTel:true
                    },
                    'postDB[bank_deposit]': {
                        required: true
                    },
                    'postDB[account_number]': {
                        required: true,
                        number:true,
                        range:[999999999999999999,9999999999999999999999]
                    }
                },
                messages:{
                    'postDB[company_name]': {
                        required: "请填写单位名称"
                    },
                    'postDB[identification_number]': {
                        required: "请填写纳税人识别码"
                    },
                    'postDB[address]': {
                        required: "请填写地址"
                    },
                    'postDB[telphone]': {
                        required: "请填写电话",
                        isTel:"请填写的座机或手机号码"
                    },
                    'postDB[bank_deposit]': {
                        required: "请填写开户行"
                    },
                    'postDB[account_number]': {
                        required: "请填写账号",
                        number:"请输入数字账号",
                        range:"请输入19位到22位账号"
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Invoice/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                window.location.href = p1;
                            }else if(resp.status === 2) {
                                $(form).find('.company').attr("value","");
                                window.location.href="#/setting/invoice/&p=1";
                            }else {
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