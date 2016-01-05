/**
 * Created by Root on 2015/6/17.
 */
define(['dialog','valid', 'jForm'], function(dialog) {

    function checkIbkNamT(_this, fn) {
        var obj = $(_this);
        $("#pibkNamT-error").remove();
        if($.trim($("#ibkNamT").val()).length > 1) {
            $("#pibkNamT").removeClass('has-error');
            $.ajax({
                cache: false,
                url:"../BankAccountSetting/checkNamT",
                type: "post",               //数据发送方式
                dataType: "json",           //接受数据格式
                data: {                     //要传递的数据
                    bocFlag: $("#bocFlag").val(),
                    ibkNamT: $("#ibkNamT").val()
                },
                success: function(response) {
                    if(response === true || response === "true") {
                        $("#pibkNamT").removeClass('has-error');
                        $("#pibkNamT-error").remove();
                        if(fn) {
                            fn();
                        }
                    } else {
                        if(obj.parent().find("small").length != 0) {
                            obj.parent().find("small").html("&nbsp;请准确输入收款账户开户网点");
                        } else {
                            $("#pibkNamT").addClass('has-error');
                            $('<small id="pibkNamT-error" class="error">&nbsp;请准确输入收款账户开户网点</small>').insertAfter("#ibkNamT");
                        }
                    }
                }
            });
        } else {
            if(obj.parent().find("small").length != 0) {
                obj.parent().find("small").html("&nbsp;请填写收款账户开户网点");
            } else {
                $("#pibkNamT").addClass('has-error');
                $("#pibkNamT-error").html("");
                $('<small id="pibkNamT-error" class="error">&nbsp;请填写收款账户开户网点</small>').insertAfter("#ibkNamT");
            }
        }
    }

    return {
        setDefaul : function(){
            $('#account-table').on('click','a.is-active',function(){
                var id = $(this).attr('data-id');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../BankAccountSetting/setDefaul?id=' + id,
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
        checkNamT:  function () {
            $("#ibkNamT").blur(function() {
                checkIbkNamT(this);
            });
            $("#bocFlag").change(function() {
                checkIbkNamT(this);
            });
        },
        validForm: function () {
            $('#maker-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[actnamT]': {
                        required: true,
                        minlength: 2,
                        maxlength: 15
                    },
                    'postDB[actnumT]': {
                        required: true,
                        number: true,
                        minlength: 12,
                        maxlength: 22,
                        remote: {
                            url:"../BankAccountSetting/check",
                            type: "post",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                id: function() {return $("#id").val();}
                            }
                        }
                    }
                },
                messages: {
                    'postDB[actnumT]': {
                        remote: "账户已存在"
                    }
                },
                submitHandler: function (form) {
                    checkIbkNamT($("#ibkNamT"), function() {
                        $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                        $(form).ajaxSubmit({
                            url: '../BankAccountSetting/saveUpdate',
                            type: 'POST',
                            dataType: 'json',
                            success: function (resp) {
                                if(resp && resp.status === 1){
                                    window.location.href = "#/sys/bankAccountSetting/&p=1";
                                } else {
                                    $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                    dialog.popupTip('',resp.info);
                                }
                            }
                        });
                    });
                }
            });
        }
    }
});