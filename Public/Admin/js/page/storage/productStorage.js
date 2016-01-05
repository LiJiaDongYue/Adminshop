/**
 * Created by Root on 2015/7/26.
 */

define(['ajax','dialog', 'jForm', 'urlQuery','spinner'],function(ajax,dialog){
    return {
        searchStorageChange: function (){
            $("#stock, #maker, #sort").change(function(){
                var param = $('#search-form').formSerialize();
                window.location.href = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
            });
            $("#search-btn").click(function(){
                var param = $('#search-form').formSerialize();
                window.location.href = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
            });
        },
        submitStorageForm: function () {    //修改库存上下限
            $(".storage-btn").click(function() {
                $(".storage-btn").attr('disabled',true);
                $("#storage-form").ajaxSubmit({
                    url: "../ProductStorage/doStorage",
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if(resp && resp.status === 1){
                            window.location.href = $.query.load(window.location.hash).set('_', Math.random()).toString();
                        } else {
                            $(".storage-btn").attr('disabled', false);
                            dialog.popupTip('', resp.info);
                        }
                    }
                });
            });
        }
    }
});
