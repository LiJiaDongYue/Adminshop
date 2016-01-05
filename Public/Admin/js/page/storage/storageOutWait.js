/**
 * Created by MuYe on 2015/7/21.
 */
define(['ajax','dialog', 'jForm', 'urlQuery','spinner'],function(ajax,dialog){
    return {
        bindCollapseWaitOut : function (){
            $('a[data-collapse="collapse"]').click(function(){
                var i = $(this).find('i');
                var row = $(this).attr('data-row');
                var hid = $(this).attr('data-id');
                var td = $(this).parent().parent().parent().find('.td-rowspan');
                var icon1 = $(this).parent().parent().parent().find('a[class*="export"]');
                var icon2 = $(this).parent().parent().parent().find('a[class*="zoom-in"]');
                if(i.hasClass('glyphicon glyphicon-chevron-down')){
                    i.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
                    td.attr('rowspan',row);
                    $('tr[data-cid="'+hid+'"]').show();
                    icon1.html('出库');
                    icon1.addClass('icon-txt');
                    icon2.html('详情');
                    icon2.addClass('icon-txt');
                } else {
                    i.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
                    td.attr('rowspan','1');
                    $('tr[data-cid="'+hid+'"]').hide();
                    icon1.html('<i class="glyphicon glyphicon-export"> </i>');
                    icon1.removeClass('icon-txt');
                    icon2.html('<i class="glyphicon glyphicon-zoom-in"> </i>');
                    icon2.removeClass('icon-txt');
                }
            });
        },
        plusOrMinusNum: function() {    //增加出库数量不能大于订单数量
            $(".plus-minus").each(function() {
                var obj = $(this).find("input");
                var max = $(obj).attr("data-val");
                $("#" + $(this).attr("id")).spinner({value:0, step: 1, min: 1, max: max});
            });

            $("#wait-out-form").on('click', '.spinner-buttons', function(){
                var obj = $(this).parent().find("input");
                var max = $(obj).attr("data-val");
                var val = $(obj).val();
                if(val > max) {
                    $(obj).val(max);
                }
            });

            $("#wait-out-form").on("change", "input[class*='spinner-input']", function() {
                var max = parseInt($(this).attr("data-val"));
                var val = parseInt($(this).val());
                if(val < 1) {
                    $(this).val(1);
                } else if(val > max) {
                    $(this).val(max);
                }
            });
        },
        submitOutForm: function () {    //确认出库
            $("#wait-out-btn").click(function() {
                var obj = $(this);
                obj.attr('disabled',true);
                $("#wait-out-form").ajaxSubmit({
                    url: "../StorageOut/doWaitOut",
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if(resp && resp.status === 1){
                            var p1 = $.query.load("#/storage/storageOutWait/&p=" + $("#last-page").val()).set('_', Math.random()).toString();
                            window.location.href = p1;
                        } else {
                            $("#out-arror").html(resp.info);
                            obj.attr('disabled',false);
                        }
                    }
                });
            });
        },
        orderSearch: function() {
            $("#search-btn").click(function(){
                var param = $('#search-form').formSerialize();
                window.location.href = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();;
            });
        }
    }
});
