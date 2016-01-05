/**
 * Created by Administrator on 2015/6/11.
 */

define(['dialog','valid', 'jForm'], function (dialog) {
    return {
        change: function (){
            $('#produce-maker,#produce-sort,#start-date,#end-date').change(function(){
                var param = $('#search-form-faster').formSerialize();
                var map = window.location.hash.split('&');
                var p1 = $.query.load(map[0] + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        gotoTab: function (){
            $('.tabbable-line li a').on('click',function(){
                var tab = $(this).attr('data-tab');
                var map = window.location.hash.split('&');
                var p1 = $.query.load(window.location.hash + '&tab=' + tab).set('p',1).toString();
                window.location.href = p1;
            });
        },
        buttonDisabled: function (){
            $('input[class="check-one"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-one"]:checked').length;
                if(checkedLen > 0) {
                    $('.panel-body').find('#submitBtn').attr('disabled',false);
                } else {
                    $('.panel-body').find('#submitBtn').attr('disabled',true);
                }
            });
            $('input[class="check-all"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-all"]:checked').length;
                var checkOneLen = $('.panel-body').find('input[class="check-one"]').length;
                if(checkedLen > 0 && checkOneLen > 0) {
                    $('.panel-body').find('#submitBtn').attr('disabled',false);
                } else {
                    $('.panel-body').find('#submitBtn').attr('disabled',true);
                }
            });
        },
        validForm: function (mod) {
            var mod = mod ? mod : 'ProductPrice';
            var btn;
            if(mod == 'ProductCode') {
                btn = '保存编码';
            } else if(mod == 'PurchasePrice'){
                btn = '批量保存';
            } else {
                btn = '保存价格';
            }
            $('#product-price-form').validate({
                submitHandler: function (form) {
                    var isSubmit = true;
                    $('#product-price-form input[type="text"]').each(function(){
                        var type = $(this).attr('data-type') ? $(this).attr('data-type') : '';
                        var val = $(this).val();
                        if(type == "date") {
                            if(!val.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                                $(this).css('border-color', '#f00');
                                isSubmit = false;
                            }
                        } else if(type == "code"){
                            isSubmit = true;
                        } else {
                            if(!val.match(/^[0-9]*[\.]?[0-9]*$/)) {
                                $(this).css('border-color', '#f00');
                                isSubmit = false;
                            }
                        }
                    });
                    if (isSubmit) {
                        $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                        $(form).ajaxSubmit({
                            url: '../' + mod + '/savelist',
                            type: 'POST',
                            dataType: 'json',
                            success: function (resp) {
                                if (resp && resp.status === 1) {
                                    if(resp.exist && resp.exist !== null) {
                                        $.each(resp.exist,function(sellid,priceidarr) {
                                            $.each(priceidarr,function(name,priceid) {
                                                $('input[name="code['+sellid+']['+priceid+'][sku_code]"]').css('border-color', '#f00');
                                            });
                                        });
                                        $(form).find('#submitBtn').attr('disabled', false).html(btn);
                                    } else {
                                        var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                        window.location.href = p1;
                                    }
                                } else {
                                    $(form).find('#submitBtn').attr('disabled', false).html(btn);
                                    dialog.popupTip('', resp.info);
                                }
                            }
                        });
                    }
                }
            });
            $("#product-price-form").find('input[type="text"]').focus(function(){
                $(this).css('border-color',"#ccc");
            });
        }
    }
});