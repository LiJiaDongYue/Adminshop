/**
 * Created by Administrator on 2015/6/11.
 */
define(['dialog','valid', 'jForm','urlQuery'], function (dialog) {
    return {
        productSort : function(){
            $('#product-sort-form').validate({
                submitHandler: function (form) {
                    $(form).find('#submitProductBtn').attr('disabled',true).html('批量修改...');
                    $(form).ajaxSubmit({
                        url: '../ProductSort/sort',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                dialog.popupTip('',resp.info);
                                $(form).find('#submitProductPrint').attr('disabled',true)
                                $(form).find('#submitProductBtn').attr('disabled',false).html('批量修改');
                            } else {
                                dialog.popupTip('','排序失败！');
                                $(form).find('#submitProductBtn').attr('disabled',false).html('批量修改');
                            }
                        }
                    });
                }
            });
        },

        productSortIsActive : function(){
            $('#product-table').on('click','a.is-active',function(){
                var id = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../ProductSort/activeSort?id=' + id + '&flag=' + val,
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
            $('#product_form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[parent_id]': {
                        required: true
                    },
                    'postDB[sort_name]': {
                        required: true,
                        maxlength: 50
                    },
                    'postDB[class]': {
                        required: true
                    },
                    'postDB[is_active]': {

                        required: true
                    }
                },
                messages: {
                    'postDB[parent_id]': {
                        required: "请选择父类分类名称"
                    },
                    'postDB[sort_name]': {
                        required: "请填写分类名称",
                        maxlength: 50
                    },
                    'postDB[class]': {
                        required: "请选择分类级别"
                    },
                    'postDB[is_active]': {
                        required: "请选择状态"
                    }
                    },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../ProductSort/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                history.go(-1);
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