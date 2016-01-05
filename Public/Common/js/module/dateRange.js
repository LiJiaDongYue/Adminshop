/**
 * Created by Administrator on 2015/6/11.
 */

define(['daterangepicker'], function () {
    return {
        dateRange: function (){
            $('.panel-main').on('focus','#start-date',function(){
                var endVal = $('#end-date').val(), startVal = $(this).val();
                if(endVal == ''){
                    setdate(this);
                } else {
                    setdate(this,'',endVal);
                }
            });
            $('.panel-main').on('focus','#end-date',function(){
                var endVal = $(this).val(), startVal = $('#start-date').val();
                if(startVal == ''){
                    setdate(this);
                } else {
                    setdate(this,startVal);
                }
            });
        },
        singleDateRange:function (){
            $('.panel-main').on('focus','input[class*="singledaterange"]',function(){
                setdate(this);
            })
        }
    }
    function setdate(obj,minLimit,maxLimit) {
        $(obj).daterangepicker({
            singleDatePicker: true,
            language: 'zn-ch',
            format: 'YYYY-MM-DD',
            startDate: new Date(),
            endDate: new Date(),
            minDate:minLimit,
            maxDate:maxLimit,
            locale: {
                'applyLabel': '确定',
                'cancelLabel': '取消',
                'fromLabel': '开始',
                'toLabel': '结束',
                'monthNames': "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
                'daysOfWeek': "一_二_三_四_五_六_日".split("_")
            }
        });
    }
});