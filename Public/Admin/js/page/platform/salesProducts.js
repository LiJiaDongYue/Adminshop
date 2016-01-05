/**
 * Created by Root on 2015/7/1.
 */

define(['dialog', 'ajax', 'jForm'], function(dialog, ajax) {
    function myQtip(obj, fn) {
        var btn = $(obj);
        btn.qtip({
            hide: {event: 'unfocus'},
            style : {width: 130},
            content: {
                text: '<p class="font-m">更产品规格属性会导致以前发布的产品失效，您确定更新吗？</p>'+"<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
                "<a class='btn btn-default btn-xs ml-10 font-s' id='close'>关闭</a></div>  ",
                title: {text: "提示"}
            },
            model : true,
            events : {
                render: function(event, api) {
                    $('#close', api.elements.content).click(function(e) {
                        api.hide(e);
                    });
                    $('#confirm', api.elements.content).click(function(e) {
                        api.hide(e);
                        btn.unbind("click");
                        fn();
                    });
                }
            },
            position: {at: 'top left', my: 'bottom right'},
            show: {ready: true, event: 'click'}
        });
    }
    return {
        relatePic: function(saveUrl) {
            $("#saleModal").on("click", "img.img-thumbnail", function() {
                $(this).parent().parent().find("i").remove();
                $(this).after('<i class="glyphicon glyphicon-ok selected-pic font-red"> </i>');
            });

            $("#saleModal").on("dblclick", "img.img-thumbnail", function() {
                $(this).parent().parent().find("i").remove();
            });

            $("#saleModal").on("click", "#save-pic", function() {
                var id = $("#ralate-modal-body").attr("data-id");      //价格表的id
                var pid = $("#ralate-modal-body").find("i").parent("div").attr("data-id");  //图片id
                if(typeof(pid) == "") {
                    $("#showModelError").text("请选择图片");
                } else {
                    ajax.todo('post', saveUrl, {id: id, pid: pid}, function (resp) {
                        if(resp && resp.status === 1) {
                            $('#saleModal').modal('hide');
                            window.location.href = $.query.load(window.location.hash).set('_', Math.random()).toString();
                        } else {
                            $("#showModelError").text(resp.info);
                        }
                    });
                }
            });

        },
        change: function (){
            $('#maker, #sort, #start-date,#end-date').change(function(){
                var param = $('#search-form').formSerialize();
                var p1 = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        submitForm: function (batchUrl, onBtn) {
            $("#sales-products-table").on("click", "button" + onBtn, function() {
                if($("#products-form").find('input[class="check-one"]:checked').length > 0) {
                    $(this).attr('disabled',true);
                    $("#products-form").ajaxSubmit({
                        url: batchUrl,
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                window.location.href = p1;
                            } else {
                                dialog.popupTip('',resp.info);
                                $(this).attr('disabled',false);
                            }
                        }
                    });
                } else {
                    dialog.popupTip('', '请选择产品');
                    return false;
                }
            });
        },
        updateProductAttr: function(batchUrl, clazz) {
            $("#sales-products-table").on("click", clazz, function() {
                var obj = this;
                myQtip(obj, function() {
                    ajax.todo('post', batchUrl, {id: $(obj).attr("data-id")}, function (resp) {
                        if(resp && resp.status === 1) {
                            if(resp.info > 0) {
                                dialog.popupTip('', "有 " + resp.info + " 条数据更新");
                                window.location.href = $.query.load(window.location.hash).set('_', Math.random()).toString();
                            } else {
                                dialog.popupTip('', "没有可以更新的数据");
                            }
                        } else {
                            dialog.popupTip('', resp.info);
                        }
                    });
                });
            });
        }
    }
});