/**
 * Created by Administrator on 2015/6/11.
 */

define(['dialog','valid', 'jForm','tagsInput'], function (dialog) {
    return {
        //tags input
        inputTags: function (){
            $('.select-tags').tagsinput({
                tagClass: 'label label-primary'

            });
        },
        isActive : function(){
            $('#attribute-table').on('click','a.is-active',function(){
                var attrid = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../ProductSort/active?id=' + attrid + '&flag=' + val,
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
        buttonDisabled: function (){
            $('input[class="check-one"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-one"]:checked').length;
                if(checkedLen > 0) {
                    $('.panel-body').find('#submitBtn2').attr('disabled',false);
                } else {
                    $('.panel-body').find('#submitBtn2').attr('disabled',true);
                }
            });
            $('input[class="check-all"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-all"]:checked').length;
                var checkOneLen = $('.panel-body').find('input[class="check-one"]').length;
                if(checkedLen > 0 && checkOneLen > 0) {
                    $('.panel-body').find('#submitBtn2').attr('disabled',false);
                } else {
                    $('.panel-body').find('#submitBtn2').attr('disabled',true);
                }
            });
        },
        validForm: function () {
            $('#attr-form').validate({
                submitHandler: function (form) {
                    $(form).find('#submitBtn2').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../ProductSort/savelist',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                window.location.href = p1;
                                //window.location.href = "#/product/attribute/&sortid="+resp.sortid+"&_=" + new Date().getTime();
                            } else {
                                $(form).find('#submitBtn2').attr('disabled',false).html('批量修改');
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });
        }
    }
});