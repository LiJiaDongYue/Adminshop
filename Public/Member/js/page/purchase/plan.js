/**
 * Created by on 2015/7/8.
 */
define(['dialog','ajaxPage','ajax','valid', 'jForm','urlQuery','spinner', 'page/bootstrap-select'], function (dialog,ajaxPage,ajax) {
    return {
        showComment: function () {
            $('.show-comment').each(function () {
                $(this).qtip({
                    hide: {
                        event: 'mouseout'
                    },
                    style: {
                        width: 300
                    },
                    content: {
                        text: '<span class="font-m">' + $(this).attr('data-content') + "</span>"
                    },
                    position: {
                        at: 'top center',
                        my: 'bottom right'
                    },
                    show: {
                        event: 'mouseover'
                    }
                });
            });
        },
        plusOrMinusNumForPlan : function(){
            $('.panel-body').on('keyup', '.spinner-input', function () {
                updateNum($(this).next('div.spinner-buttons'));
            });

            $('.panel-body').on('click', '.spinner-buttons', function () {
                updateNum($(this));
            });
        },
        bindPlan : function(){
            $('.plandiv i').on('click',function(){
                if($(this).hasClass('glyphicon glyphicon-pencil')) {
                    $(this).removeClass('glyphicon glyphicon-pencil').addClass('glyphicon glyphicon-ok');
                    $(this).parent().find('span').hide();
                    $(this).parent().find('input').removeClass('hidden');
                } else {
                    $(this).removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-pencil');
                    var span = $(this).parent().find('span');
                    span.show();
                    var oldVal = span.text();
                    var input =  $(this).parent().find('input');
                    input.addClass('hidden');
                    var id = input.attr('data-id');
                    var name = input.val();
                    if($.trim(name) && id > 0 && oldVal != name){
                        ajax.todo('POST','../PurchasePlan/updatePlanName',{id:id,name: name}, function() {
                            span.text(name);
                        });
                    }
                };
            });
        }
    }
    function updateNum($this){
        var i = $this.find('i');
        var price_id = parseInt(i.attr('data-val')) || 0;
        var id = parseInt(i.attr('data-id')) || 0;
        var quantity = parseInt($('#q_' + price_id).val()) || 0;

        if (price_id > 0 && id > 0 && quantity > 0) {
            ajax.todo('post', '../PurchasePlan/alterNumber.html', {id: id, quantity: quantity});
        }
    }
});
