/**
 * Created by Root on 2015/7/26.
 */

define(['ajax','dialog','valid', 'jForm', 'urlQuery','spinner'],function(ajax,dialog){
    return {
        change: function (){
            $('#produce-maker,#produce-sort').change(function(){
                var param = $('#search-form-faster').formSerialize();
                var map = window.location.hash.split('&');
                var p1 = $.query.load(map[0] + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        productStorage : function(){
            $('#sock_storage-form').validate({
                submitHandler: function (form) {
                    var is_btn = true;
                    $(form).find('.selectpicker').each(function(){
                        var stock = $(this).val();
                        if(stock==null||stock==''){
                            dialog.popupTip('','您有仓库未选，请选择！');
                            return is_btn= false;
                        }
                    });
                    if(is_btn){
                        $(form).find('#sockStorageBtn').attr('disabled',true).html('保存中...');
                        $(form).ajaxSubmit({
                            url: '../StorageInit/addStorage',
                            type: 'POST',
                            dataType: 'json',
                            success: function (resp) {
                                if(resp && resp.status === 1){
                                    dialog.popupTip('',resp.info);
                                    $(form).find('#sockStorageBtn').attr('disabled',true)
                                    $(form).find('#sockStorageBtn').attr('disabled',false).html('保存');
                                    var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                    window.location.href = p1;
                                } else {
                                    dialog.popupTip('','初始化库存失败！');
                                    $(form).find('#sockStorageBtn').attr('disabled',false).html('保存');
                                }
                            }
                        });
                    }

                }
            });
        }
    }
});
