/**
 * Created by Administrator on 2015/6/11.
 */
define(['dialog','valid', 'jForm','urlQuery'], function (dialog) {
    return {
        isActive : function(){
            $('#member-table').on('click','a.is-active',function(){
                var uid = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../Member/active?id=' + uid + '&flag=' + val,
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
        validForm: function () {
            $('#member-form').validate({
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
                        maxlength: 16
                    },
                    'postDB[email]': {
                        required: true,
                        email: true,
                        rangelength: [6, 32]
                    },
                    'postDB[password]': {
                        required: true,
                        minlength: 6
                    },
                    'postDB[re_password]': {
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    }
                },
                messages: {
                    'postDB[username]': {
                        required: "请输入用户名",
                        maxlength: "用户名长度不能大于16个字符"
                    },
                    'postDB[email]': {
                        required: "请输入Email地址",
                        email: "请输入正确的Email地址",
                        rangelength: $.validator.format("请输入长度为{0}至{1}之间的字符")
                    },
                    'postDB[password]': {
                        required: "请输入密码",
                        minlength: $.validator.format("密码不能小于{0}个字符")
                    },
                    'postDB[re_password]': {
                        required: "请输入确认密码",
                        minlength: $.validator.format("确认密码不能小于{0}个字符"),
                        equalTo: "两次输入密码不一致"
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Member/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/sys";
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