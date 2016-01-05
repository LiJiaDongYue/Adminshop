/**
 * Created by Administrator on 2015/6/11.
 */

define(['bootstrapSelect'], function () {
    function removeLabel() {
        $('button[class*="dropdown-toggle"]').find("span.filter-option").each(function(){
            var txt = $(this).text();
            $(this).text(txt.replace(/>/g, ''))
        });
    }
    return {
        bsSelect: function (){
            $('.selectpicker').selectpicker({
                size: 10
            });
            removeLabel();
        },
        removeLabels: function() {
            removeLabel();
        }
    }
});