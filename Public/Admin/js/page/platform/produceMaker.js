/**
 * Created by Root on 2015/6/17.
 */
define(['dialog','valid', 'jForm'], function(dialog) {

    return {
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
                    'postDB[maker_name]': {
                        required: true,
                        rangelength: [2,50],
                        remote: {
                            url:"../ProduceMaker/check",
                            type: "post",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                id: function() {return $("#maker_id").val();}
                            }
                        }
                    },
                    'postDB[short_name]': {
                        required: true,
                        remote: {
                            url:"../ProduceMaker/shortNameCheck",
                            type: "post",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                id: function() {return $("#maker_id").val();}
                            }
                        }
                    },
                    'postDB[leal_person]': {
                        rangelength: [2,10]
                    },
                    'postDB[contact_person]': {
                        required: true,
                        rangelength: [2,10]
                    },
                    'postDB[phone_number]': {
                        required: true,
                        isTel: true
                    },
                    /*'postDB[fax]': {
                        required: true
                    },*/
                    'postDB[zip]': {
                        postalcode:true
                    },
                    'postDB[email]': {
                        email:true
                    },
                    'postDB[contact_address]': {
                        required: true,
                        rangelength: [2,50]
                    }
                },
                messages: {
                    'postDB[maker_name]': {
                        required: "厂家名称必填",
                        maxlength: "厂家名称长度不能大于50个字符",
                        remote: "厂家名称已存在"
                    },
                    'postDB[short_name]': {
                        required: "厂家简称必填",
                        remote: "厂家简称已存在"
                    }
                   /* ,
                    'postDB[leal_person]': {
                        maxlength: "厂家名称长度不能大于50个字符"
                    }*/
                },
                submitHandler: function (form) {
                    var area = $.trim($("#get_address").html());
                    if(! (area == '' || area == '所在地区')) {
                        $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                        $(form).ajaxSubmit({
                            url: '../ProduceMaker/saveUpdate',
                            type: 'POST',
                            dataType: 'json',
                            success: function (resp) {
                                if(resp && resp.status === 1){
                                    window.location.href = "#/platform/produceMaker/&p=1";
                                } else {
                                    $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                    dialog.popupTip('',resp.info);
                                }
                            }
                        });
                    } else {
                        $("#area").addClass('has-error');
                        $('<small id="show_area_error" class="error" style="float: left; padding-top: 10px;">&nbsp;请选择厂家所属区域</small>').insertAfter(".area-error");
                    }
                    return false;
                }
            });
        }
    }
});