/**
 * Created by Administrator on 2015/7/19.
 */
define(['ajax', 'dialog'], function (ajax, dialog) {
        return {
            /** 产品 *******************************************/
            addProducts : function(addUrl, loadUrl, tableID){
                $('#main-content-right').on('click', '.modal .modal-body .add-product', function (e) {
                    var btn = $(this);
                    var json = '{' + $(this).attr('data-json') + '}';
                    try {
                        var param = $.parseJSON(json);
                        ajax.todo('get', addUrl, param, function(resp){
                            if(resp && resp.status == 1){
                                //更改状态
                                btn.parent().html('<small class="btn btn-xs font-s font-grey">已添加</small>');
                                if(tableID && loadUrl){
                                    ajax.loadData({
                                        id : tableID,//table id
                                        url : loadUrl,
                                        param : param,
                                        callback : function(){
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
                                        }
                                    });
                                }
                            } else {
                                dialog.popupTip('', resp.info);
                            }
                        });
                    } catch(e){
                        alert('参数错误!');
                    }
                })
            },
            loadProducts: function () {
                $('#main-content-right').on('click', '.modal-pagination-nav .num', function (e) {
                    //阻止默认事件，  就是#锚点跳走
                    e.preventDefault();
                    //页码
                    var p = $(this).attr('data-val');
                    var makerId = parseInt($('#maker_id').val()) || 0;
                    var sortId = parseInt($('#sort_id').val()) || 0;
                    var proName = $.trim($('#product-name').val());
                    var param = $.trim($('#query-id').val());
                    ajax.loadData({
                        id: 'modal-content',
                        url: '../PurchasePlan/loadProducts?p=' + p,
                        param: {
                            sort_id : makerId,
                            maker_id : sortId,
                            product_name : proName,
                            param : param
                        },
                        callback: function () {

                        }
                    });
                })
            },
            searchProducts: function () {
                $('.panel-body').on('click', '#clickSearch', function () {
                    search();
                });
                $('.panel-body').on('change', '#maker_id,#sort_id', function () {
                    search();
                });
            }
        }
        function search() {
            var makerId = parseInt($('#maker_id').val()) || 0;
            var sortId = parseInt($('#sort_id').val()) || 0;
            var proName = $.trim($('#product-name').val());
            ajax.loadData({
                id  : 'modal-content',
                url : '../PurchasePlan/loadProducts',
                param : {
                    sort_id: sortId,
                    maker_id: makerId,
                    product_name: proName
                }
            });
        }
    }
);