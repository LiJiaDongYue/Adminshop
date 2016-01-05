/**
 * Created by Administrator on 2015/6/13.
 */

define(function () {
    return {
        /**
         * @param checkAll 全选<input class="check-all" type="checkbox"/>
         * @param checkOne 单选<input class="check-one" type="checkbox" value="{$vo['uid']}"/>
         */
        inputCheck: function (chkAll, chkOne) {
            var chkAllClass = chkAll ? chkAll : 'check-all';
            var chkOneClass = chkOne ? chkOne : 'check-one';
            //全选
            $('.panel-body').on('click', 'input[class="' + chkAllClass + '"]', function () {
                $('.panel-body').find('input[class="' + chkOneClass + '"]').attr('checked', $(this).attr('checked') ? true : false);
            });
            $('.panel-body').on('click', 'input[class="' + chkOneClass + '"]', function () {
                var checkedLen = $('.panel-body').find('input[class="' + chkOneClass + '"]:checked').length;
                var chkLen = $('.panel-body').find('input[class="' + chkOneClass + '"]').length;
                $('.panel-body').find('input[class="' + chkAllClass + '"]').attr('checked', checkedLen === chkLen);
            });
        },
        getCheckedVal: function (chkOne, oper) {
            var chkOneClass = chkOne ? chkOne : 'check-one';
            oper = oper ? oper : ',';
            var checkedArr = new Array();
            $('.panel-body').find('input[class="' + chkOneClass + '"]:checked').each(function () {
                checkedArr.push($(this).val());
            });
            return checkedArr.length <=0 ? '' : checkedArr.join(oper);
        }
    }
});