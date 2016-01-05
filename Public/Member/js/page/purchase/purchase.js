/**
 * Created by Administrator on 2015/6/30.
 */
define(['dialog', 'ajax', 'spinner', 'qtip'], function (dialog, ajax) {
    return {
        /** 新增采购计划**************************************************************/
        clickNextStep: function (pt) {
            $('.panel-body').on('click', '.next-step #next-submit', function () {
                var container = new Array();
                $('input[name^="long_ids"]:checked').each(function () {
                    var inputVal = $(this).val();
                    if (inputVal) {
                        container.push(inputVal);
                    }
                });
                ajax.todo('POST', '../PurchasePlan/add', {
                    ids: container.join(','),
                    pt: pt.toString()
                }, function (resp) {
                    var obj = resp.info;
                    if (resp && resp.status == 1 && obj.plan_id > 0) {//成功param: {pt: obj.pt, plan_id: obj.plan_id},
                        window.location.href = "#/purchase/purchasePlan/confirm/&pt=" + obj.pt + "&plan_id=" + obj.plan_id;
                    } else if (resp && resp.status == 0) {
                        dialog.popupTip('', resp.info);
                    }
                });
            });
        },
        checkLongCheck: function () {
            $('.panel-body').on('click', 'input[name^="long_ids"]', function () {
                var chkLen = $('input[name^="long_ids"]:checked').length;
                $('.next-step #next-submit').attr('disabled', chkLen == 0);
            });
        },
        editLongPlan: function () {
            $('.panel-body').on('click', '.edit', function () {
                var obj = $.parseJSON($(this).attr('data-val'));
                $('#long_id').val(obj.long_id);
                $('#plan_name').css('border-color', '').val(obj.plan_name);
                $('#plan_comment').val(obj.plan_comment);
                $('#long-plan-add').html('<i class="glyphicon glyphicon-edit"> </i>修改');
            });
        },
        addLongPlan: function () {
            var $this = this;
            $('#long-plan-add').on('click', function () {
                var _this = $(this);
                var long_id = $.trim($('#long_id').val());//采购计划单id
                var plan_name = $.trim($('#plan_name').val());//采购计划名称
                var plan_comment = $.trim($('#plan_comment').val());//采购计划描述
                var pt = $.trim($('#hidden-pt').val());//采购计划描述
                if (plan_name && plan_name != '' && pt) {
                    ajax.todo('post', '../PurchasePlan/addLongPlan', {
                        long_id: long_id,
                        plan_name: plan_name,
                        plan_comment: plan_comment
                    }, function (resp) {
                        if (resp && resp.status == 1) {//保存成功
                            //if(_this.find('i').hasClass('glyphicon glyphicon-edit')){
                            //    _this.next('button').trigger('click');
                            //}
                            _this.parent().find('input[type!=hidden]').val('');
                            ajax.loadData({
                                id: 'long-plan-table',
                                url: '../PurchasePlan/table',
                                param: {pt: pt},
                                callback: function () {
                                    $this.showComment();
                                }
                            });
                        }
                    });
                } else {
                    $.trim($('#plan_name').css('border-color', '#f40'));
                }
            });
        },
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
        rebuy: function () {
            var $this = this;
            $('#collection-order-table').on('click', '.rebuy', function () {
                var collection_id = parseInt($(this).attr('data-val')) || 0;
                var pt = $(this).attr('data-pt');
                if (collection_id > 0 && pt != '') {
                    ajax.todo('post', '../PurchasePlan/add.html', {
                        collection_id: collection_id,
                        pt: pt
                    }, function (resp) {
                        var obj = resp.info;
                        if (resp && resp.status == 1 && obj.plan_id > 0) {//成功
                            ajax.loadData({
                                id: 'collection-add-table',
                                url: '../PurchasePlan/loadAddedTable?',
                                param: {pt: obj.pt, plan_id: obj.plan_id},
                                callback: function (html) {
                                    //改变按钮状态
                                    $this.countNum();
                                    $this.printSubmit();
                                }
                            });
                            //console.log(resp);
                        } else if (resp && resp.status == 0) {
                            dialog.popupTip('', resp.info);
                        }
                    });
                }
            });
        },
        printSubmit: function () {
            $('#print-submit').on('click', '.submit', function () {
                var $btn = $(this);
                var plan_id = $btn.attr('data-pid');
                //var i = $btn.find(i);
                //if(i.hasClass('glyphicon glyphicon-ok-sign')){//提交计划单
                //} else if(i.hasClass('glyphicon glyphicon-print')){//打印计划单
                ajax.todo('post', '../PurchasePlan/submitPlan.html', {plan_id: plan_id}, function (resp) {
                    if (resp && resp.status == 1) {//成功
                        window.location.href = "#/purchase/purchasePlan/lists/&p=1";
                    } else if (resp) {
                        dialog.popupTip('', resp.info);
                    }
                });
                //}

            });
        },
        plusOrMinusNum: function () {
            $('.panel-body').on('keyup', '.spinner-input', function () {
                updateNum($(this).next('div.spinner-buttons'));
            });

            $('.panel-body').on('click', '.spinner-buttons', function () {
                updateNum($(this));
            });
        },
        //从计划单中移除产品
        delFromPlan: function () {
            $('.panel-body').on('click', '.delFromPlan', function () {
                var btn = $(this);
                btn.qtip({
                    hide: {
                        event: 'unfocus'
                    },
                    style: {
                        width: 130
                    },
                    content: {
                        text: '<p class="font-m">您确定删除吗？</p>' + "<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
                        "<a class='btn btn-default btn-xs ml-10 font-s' id='close'>关闭</a></div>  ",
                        title: {
                            text: "提示"
                        }
                    },
                    model: true,
                    events: {
                        render: function (event, api) {
                            $('#close', api.elements.content).click(function (e) {
                                api.hide(e);
                            });
                            $('#confirm', api.elements.content).click(function (e) {
                                api.hide(e);
                                doDel(btn);//确定删除
                            });
                        }
                    },
                    position: {
                        at: 'top left',
                        my: 'bottom right'
                    },
                    show: {
                        ready: true,
                        event: 'click'
                    }
                });
            });
        },
        //添加产品到计划单中
        addToPlan: function () {
            var $this = this;
            $('#purchase-plan-table').on('click', '.addToPlan', function () {
                var btn = $(this);
                var priceId = parseInt($(this).attr('data-val')) || 0;
                var pt = $(this).attr('data-pt');
                if (priceId > 0 && pt != '') {
                    ajax.todo('post', '../PurchasePlan/add', {price_id: priceId, pt: pt}, function (resp) {
                        var obj = resp.info;
                        if (resp && resp.status == 1 && obj.plan_id > 0) {//成功
                            ajax.loadData({
                                id: 'purchase-add-table',
                                url: '../PurchasePlan/loadAddedTable?',
                                param: {pt: obj.pt, plan_id: obj.plan_id},
                                callback: function (html) {
                                    //改变按钮状态
                                    btn.attr('class', '').html("<small class=\"font-grey\">已添加</small>");
                                    $this.countNum();
                                    $this.printSubmit();
                                }
                            });
                            //console.log(resp);
                        } else if (resp && resp.status == 0) {
                            dialog.popupTip('', resp.info);
                        }
                    });
                }
            });
        },
        countNum: function () {
            //初始化
            $('.plus-minus').spinner({value: 1, step: 1, min: 1, max: 999});
        },
        selSource: function () {
            $('.nav li[role="presentation"]').on('click', function () {
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                var liVal = $(this).attr('data-val');
                if (liVal) {
                    $('a.next-step').attr('href', '#/purchase/purchasePlan/fill/&pt=' + liVal);
                }
            });
        },
        purchaseSearch: function (tableId) {
            tableId = tableId ? tableId : 'purchase-plan-table';
            $('.panel-body').on('click', '#clickSearch', function () {
                search(tableId);
            });
            $('.panel-body').on('change', '#maker_id,#sort_id', function () {
                search(tableId);
            });
        }
        /** 新增采购计划End **********************************************************/
    }

    function updateNum($this){
        var i = $this.find('i');
        var price_id = parseInt(i.attr('data-val')) || 0;
        var id = parseInt(i.attr('data-id')) || 0;
        var quantity = parseInt($('#q_' + price_id).val()) || 0;

        if (price_id > 0 && id > 0 && quantity > 0) {
            ajax.todo('post', '../PurchasePlan/updateNum.html', {id: id, quantity: quantity});
        }
    }

    function search(tableId) {
        var makerId = parseInt($('#maker_id').val()) || 0;
        var sortId = parseInt($('#sort_id').val()) || 0;
        var proName = $.trim($('#product-name').val());
        var plan_name = $.trim($('#plan_name').val());//计划名称
        var pt = $.trim($('#hidden-pt').val());
        ajax.loadData({
            'url': '../PurchasePlan/table',
            'param': {
                pt: pt ? pt : 'D1201',
                sort_id: sortId,
                maker_id: makerId,
                product_name: proName,
                plan_name: plan_name
            },
            'id': tableId
        });
    }

    function doDel(btn) {
        //采购计划id
        var plan_id = parseInt(btn.attr('data-pid')) || 0;
        //采购计划明细id
        var id = parseInt(btn.attr('data-id')) || 0;
        //价格id
        var price_id = parseInt(btn.attr('data-val')) || 0;

        if (id > 0 && plan_id > 0 && price_id > 0) {
            ajax.todo('post', '../PurchasePlan/delPlan.html', {id: id, plan_id: plan_id}, function (resp) {
                if (resp && resp.status == 1) {//删除成功
                    //移除当前操作的数据
                    btn.parent().parent().remove();
                    //将'已添加'状态改为可以'添加'btn btn-default btn-xs
                    $('#btn_' + price_id).addClass('addToPlan').addClass('btn').addClass('btn-default').addClass('btn-xs');
                    $('#btn_' + price_id).attr('title', '添加').html('<i class="glyphicon glyphicon-plus-sign"> </i>');
                    if ($('#add-tbody').find('tr').length == 0) {
                        //移除打印、提交按钮
                        $('#print-submit').remove();
                    }
                } else {
                    dialog.popupTip('', resp.info);
                }
            });
        }
    }
});