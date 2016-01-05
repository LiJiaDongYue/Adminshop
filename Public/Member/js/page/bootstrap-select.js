/**
 * Created by Administrator on 2015/6/11.
 */

define(['bootstrapSelect'], function () {
    return {
        bsSelect: function (){
            $('.selectpicker').selectpicker({
                size: 10
            });
        }
    }
});