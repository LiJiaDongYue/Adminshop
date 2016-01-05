/**
 * Created by zq123 on 2015/6/25.
 */

define(['dialog', 'valid', 'jForm'], function (dialog) {
    return {
        setDefaul : function(){
            $('#address-table').on('click','a.is-deaul',function(){
                var id = $(this).attr('data-id');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../ReceiveAddress/setDefault?id=' + id,
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
        checkMessage : function (){
            $('#phone_number').focusin(function(){
                $('small').remove('#pt_error');
            });
            $('#tel_number').focusin(function(){
                $('small').remove('#pt_error');
            });
            $('#get_address').click(function(){
                $('small').remove('#show_area_error');
                $('#area').removeClass().addClass('form-group');
            });
            $('#tel_number').click(function(){
                $('small').remove('#show_area_error');
            });
        },
        validForm: function (modal) {
            $('#receive_address-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[address]': {
                        required: true
                    },
                    'postDB[contact_person]':{
                        required: true,
                        maxlength: 25
                    },
                    'postDB[phone_number]': {
                        mobile: true
                    },
                    'postDB[tel_number]': {
                        phone: true
                    },
                    'postDB[zip_code]': {
                        required: true
                    }
                },
                messages: {
                    'postDB[address]': {
                        required: "请输入选择地区"
                    },
                    'postDB[contact_person]': {
                        required: "请输入收货人姓名",
                        maxlength: "姓名长度不能大于25个字符"
                    },
                    'postDB[zip_code]': {
                        required: "请输入邮政编码"
                    }
                },
                submitHandler: function (form) {
                    if($('#area_name').val()==''){
                        $("#area").addClass('has-error');
                        $('<small id="show_area_error" class="error pull-left mt-10">&nbsp;请选择所属区域</small>').insertAfter(".area-error");
                        return false;
                    }
                    if($('#tel_number').val() == '' && $('#phone_number').val() == ''){
                        $('#phone_error').after('<small id="pt_error" class="error pull-left mt-10">手机号或电话号码必填一项</small>');
                        return false;
                    }
                    $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../ReceiveAddress/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                if(modal) {
                                    $('#new-address').modal('hide');
                                    if($('.modal-backdrop').length > 0) $('.modal-backdrop').hide();
                                    var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                    window.location.href = p1;
                                } else {
                                    //window.location.href = '#/setting/receiveAddress/&p=1';
                                    history.go(-1);
                                }
                            } else {
                                $(form).find('#submitBtn').attr('disabled', false).html('提交');
                                $('#role_name').after('<small class="error">' + resp.info + '</small>');
                            }
                        }
                    });
                }
            });
        }
    }
});
