/**
 * Created by zq123 on 2015/8/5.
 */
define(['ajax','dialog','ZeroClipboard','editor','valid', 'jForm'],function(ajax,dialog,ZeroClipboard){
    return{
        initEditor: function () {
            window.ZeroClipboard = ZeroClipboard;
            //删除已创建的编辑器
            var editor = new UE.ui.Editor({initialFrameHeight: 250});
            editor.render('content');
            //UE.delEditor('content');
            //UE.getEditor('content',{initialFrameHeight:300});
        },
        shortInfoValidForm : function(){
            $('#shortInfo-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                /*rules: {
                 'postDB[qy_regmoney]': {
                 required: true
                 },
                 'postDB[qy_pro_ser]':{
                 required: true
                 },
                 'postDB[my_buy]': {
                 required: true
                 },
                 'postDB[qy_regplace]': {
                 required: true

                 }
                 },
                 messages: {
                 'postDB[qy_regmoney]': {
                 required: "该输入项必填！"
                 },
                 'postDB[qy_pro_ser]': {
                 required: "该输入项必填！"
                 },
                 'postDB[my_buy]': {
                 required: "该输入项必填！"
                 },
                 'postDB[qy_regplace]': {
                 required: "该输入项必填！"
                 }
                 },*/
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../CompanyInfo/saveShortInfo',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                dialog.popupTip('',resp.info);
                                //var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                //window.location.href = p1;
                                var p1 = $.query.load('#/sys/companyInfo/&p=3').set('_',Math.random()).toString();
                                window.location.href = p1;
                            } else {
                                dialog.popupTip('',resp.info);
                                $(form).find('#submitBtn').attr('disabled', false).html('提交');
                            }
                        }
                    });
                }
            });
        },
        contactValidForm : function(){
            $('#companyContact-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                /*rules: {
                    'postDB[qy_contact]': {
                        required: true
                    },
                    'postDB[qy_contact_zhiwei]':{
                        required: true
                    },
                    'postDB[qy_contact_mobile]': {
                        required: true,
                        mobile :true
                    },
                    'postDB[qy_contact_tel]': {
                        required: true,
                        phone :true

                    }
                },
                messages: {
                    'postDB[qy_contact]': {
                        required: "该输入项必填！"
                    },
                    'postDB[qy_contact_zhiwei]': {
                        required: "该输入项必填！"
                    },
                    'postDB[qy_contact_mobile]': {
                        required: "该输入项必填！"
                    },
                    'postDB[qy_contact_tel]': {
                        required: "该输入项必填！"
                    }
                },*/
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../CompanyInfo/saveContact',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                dialog.popupTip('',resp.info);
                                //var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                //window.location.href = p1;
                                var p1 = $.query.load('#/sys/companyInfo/&p=2').set('_',Math.random()).toString();
                                window.location.href = p1;
                            } else {
                                dialog.popupTip('',resp.info);
                                $(form).find('#submitBtn').attr('disabled', false).html('提交');
                            }
                        }
                    });
                }
            });
        },
        infoValidForm : function(){
            $('#get_address').click(function(){
                $('small').remove('#show_area_error');
                $('#area').removeClass().addClass('form-group');
            });
            $('#companyInfo-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'pDB[company_name]': {
                        required: true,
                        remote: {
                            url:"../companyInfo/checkName",
                            type: "post",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                rid: function() {return $("#rid").val();}
                            }
                        }
                    },
                    'pDB[my_trade]': {
                        required: true
                    },
                    'pDB[qy_cate]': {
                        required: true
                    }
                },
                messages: {
                    'pDB[company_name]': {
                        required: "请输入企业全称！",
                        remote: "企业名称已存在"
                    },
                    'pDB[my_trade]': {
                        required: "请输入企业所属行业"
                    },
                    'pDB[qy_cate]': {
                        required: "请选择经济性质"
                    }
                },
                submitHandler: function (form) {

                    if($('#area_name').val()==''){
                        $("#area").addClass('has-error');
                        $('<small id="show_area_error" class="error pull-left mt-10">&nbsp;请选择所属区域</small>').insertAfter(".area-error");
                        return false;
                    }
                    $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../CompanyInfo/saveInfo',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                //history.go(-1);
                                dialog.popupTip('',resp.info);
                                //var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                //window.location.href = p1;
                                var p1 = $.query.load('#/sys/companyInfo/&p=1').set('_',Math.random()).toString();
                                window.location.href = p1;
                                //window.location.href = '#/sys/companyInfo/&p=1&_'+Math.random();
                            } else {
                                dialog.popupTip('',resp.info);
                                $(form).find('#submitBtn').attr('disabled', false).html('提交');
                            }
                        }
                    });
                }
            });
        }
    }
});