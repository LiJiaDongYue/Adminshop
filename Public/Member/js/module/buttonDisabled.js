/**
 * Created by Administrator on 2015/6/11.
 */

define([], function () {
    return {
        buttonDisabled: function (btn){
            var label = btn ? btn : "#submitBtn";
            $('input[class="check-one"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-one"]:checked').length;
                if(checkedLen > 0) {
                    $('.panel-body').find(label).attr('disabled',false);
                } else {
                    $('.panel-body').find(label).attr('disabled',true);
                }
            });
            $('input[class="check-all"]').click(function(){
                var checkedLen = $('.panel-body').find('input[class="check-all"]:checked').length;
                var checkOneLen = $('.panel-body').find('input[class="check-one"]').length;
                if(checkedLen > 0 && checkOneLen > 0) {
                    $('.panel-body').find(label).attr('disabled',false);
                } else {
                    $('.panel-body').find(label).attr('disabled',true);
                }
            });
        }
    }
});