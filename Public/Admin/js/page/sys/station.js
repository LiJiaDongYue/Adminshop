/**
 * Created by Root on 2015/6/26.
 */
define(['dialog', 'ajax', 'jForm', 'valid'], function (dialog, ajax) {
    return {
        validStationForm: function () {
            $('#station-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[username]': {
                        required: true,
                        rangelength: [2, 32],
                        remote: {
                            url:"../Member/check",
                            type: "post",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                id: function() {return $("#uid").val();}
                            }
                        }
                    },
                    'postDB[true_name]': {
                        required: true,
                        rangelength: [2, 10]
                    },
                    'postDB[phone_number]': {
                        required: true,
                        mobile: true
                    },
                    'postDB[contacts_tel]': {
                        required: true,
                        phone: true
                    },
                    'postDB[email]': {
                        required: true,
                        email: true,
                        maxlength: 25
                    },
                    'postDB[user_qq]': {
                        qq: true
                    },
                    'postDB[user_duty]': {
                        rangelength: [2, 10]
                    },
                    'postDB[identity_number]': {
                        idCardNo: true
                    },
                    'postDB[home_address]': {
                        rangelength: [2, 50]
                    },
                    'postDB[comment]': {
                        rangelength: [2, 50]
                    }
                },
                messages: {
                    'postDB[username]': {
                        required: "请输入经办人帐号",
                        maxlength: "经办人帐号长度不能大于16个字符",
                        remote: '经办人帐号已经存在'
                    },
                    'postDB[email]': {
                        required: "请输入Email地址",
                        email: "请输入正确的Email地址",
                        rangelength: [6, 32]
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Member/updateSave',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/sys/station/&p=1";
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