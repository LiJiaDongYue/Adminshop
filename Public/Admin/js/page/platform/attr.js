/**
 * Created by Administrator on 2015/6/11.
 */

define(['dialog', 'valid', 'jForm', 'tagsInput'], function (dialog) {
    return {
        //tags input
        inputTags: function () {
            $('.select-tags').tagsinput({
                tagClass: 'label label-primary'

            });

        },
        validForm: function () {
            $('#attradd-form').validate({
                submitHandler: function (form) {

                    $("#attrname").focus(function () {
                        $(this).css('border-color', '#66afe9');
                    });

                    $("#attrvalue").next('.bootstrap-tagsinput').find('input').focus(function(){
                        $(this).parent().css('border-color', '#66afe9');
                    });
                    var $attrname = $("#attrname");
                    var $attrvalue = $("#attrvalue");

                    var isSubmit = true;
                    if (!$attrname || !$.trim($attrname.val())) {
                        $attrname.css('border-color', '#f00');
                        isSubmit = false;
                    }
                    if (!$attrvalue || !$.trim($attrvalue.val())) {
                        $attrvalue.next('.bootstrap-tagsinput').css('border-color', '#f00');
                        isSubmit = false;
                    }

                    if (isSubmit) {
                        $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                        $(form).ajaxSubmit({
                            url: '../ProductSort/attrSave',
                            type: 'POST',
                            dataType: 'json',
                            success: function (resp) {
                                if (resp && resp.status === 1) {
                                    var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                    window.location.href = p1;
                                    //window.location.href = "#/product/attribute/&sortid="+resp.sortid+"&_=" + new Date().getTime();
                                } else {
                                    $(form).find('#submitBtn').attr('disabled', false).html('提交');
                                    dialog.popupTip('', resp.info);
                                }
                            }
                        });
                    }
                }
            });
        }
    }
});