/**
 * Created by Root on 2015/7/1.
 */

define(['dialog', 'ajax', 'jForm', 'urlQuery', 'valid', 'qtip', 'spinner', 'fancybox'], function(dialog, ajax) {
    function search(batchUrl) {
        $("#product-name").val($.trim($("#product-name").val()));
        var param = $("#product-search").formSerialize();
        $("#product-table").load(batchUrl, param);
    }

    function deleteAdd(batchUrl, btn) {
        var id = $("#id").val();
        var pid = $(btn).attr("data-id");
        var act = $("#act").val();
        var obj = $($(btn).attr("data-remove") == "false" ? btn : $("#add_" + pid));
        ajax.todo('post', batchUrl, {id: id, pid: pid, act: act}, function (resp) {
            if(resp && resp.status === 1) {
                obj.attr("data-original-title", "添加");
                obj.removeClass("remove-add");
                obj.addClass("add-product");
                obj.find("i").attr("class", "glyphicon glyphicon-plus-sign");
                $("#re_" + pid).remove();
            } else {
                dialog.popupTip('', resp.info);
            }

            if($("#product-add-table").find("input[type='text']").length == 0) {
                $("#next").addClass("hidden");
            } else {
                $("#next").removeClass("hidden");
            }
        });
    }

    //下一步
    function next() {
        $("#next").click(function() {
            var name = $.trim($("#packgage_name").val());
            if(name == '') {
                $(".name-error").text("请填写名称");
            } else {
                $("#next").attr('disabled',true).html('提交中...');
                var id = $("#id").val();
                var act = $("#act").val();
                ajax.todo('post', "../ProductPackage/next", {id: id, name: name, act: act}, function (resp) {
                    if(resp && resp.status === 1){
                        window.location.href = "#/platform/productPackage/addEdit/&id=" + resp.info + "&_=" + Math.random();
                    } else {
                        dialog.popupTip('', resp.info);
                    }
                });
            }
        });
    }

    function plusOrMinusNum() {
        var id = $("#id").val();
        var act = $("#act").val();
        $("#product-add-table").on('click', '.spinner-buttons', function(){
            var obj = $(this).parent().find("input");
            var pid = $(obj).attr("data-id");
            var quantity = $(obj).val();
            ajax.todo('post','../ProductPackage/quantity', {id : id, pid: pid, act: act, val : quantity}, function(resp) {
                if(resp && resp.status !== 1) {
                    dialog.popupTip('', resp.info);
                }
            });
        });

        $("#product-add-table").on("change", "input[type='text']", function() {
            var pid = $(this).attr("data-id");
            var quantity = $(this).val();
            ajax.todo('post','../ProductPackage/quantity', {id : id, pid: pid, act: act, val : quantity}, function(resp) {
                if(resp && resp.status !== 1) {
                    dialog.popupTip('', resp.info);
                }
            });
        });
    }

    function myQtip(obj, fn, msg) {
        var warnMsg =  msg ? msg : "您确定删除吗？";
        var btn = $(obj);
        btn.qtip({
            hide: {event: 'unfocus'},
            style : {width: 130},
            content: {
                text: '<p class="font-m">'+warnMsg+'</p>'+"<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
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

    //添加推荐产品
    function relate() {
        $("#packageModal").on('click', 'a.add-relate', function () {
            var indexId = $("#index-id").val();     //成套设备产品id（明细表）
            var pid = $(this).attr("data-id");
            var obj = $(this);
            ajax.todo('post', "../ProductPackage/doRelate", {id: indexId, pid: pid}, function (resp) {
                if(resp && resp.status === 1) {
                    obj.attr("data-original-title", "取消推荐");
                    obj.removeClass("add-relate");
                    obj.addClass("remove-relate");
                    obj.find("i").attr("class","glyphicon glyphicon-trash");
                    $("#ids").val(resp.info);
                    $("#package-detail-table").load("../ProductPackage/detailList", {id: $("#id").val()});
                } else {
                    dialog.popupTip('', resp.info);
                }
            });
        });

        $("#packageModal").on("click", "a.remove-relate", function() {
            var indexId = $("#index-id").val();     //成套设备产品id（明细表）
            var pid = $(this).attr("data-id");  //推荐产品pid
            var obj = $(this);
            myQtip(obj, function() {
                ajax.todo('post', "../ProductPackage/delRelate", {id: indexId, pid: pid}, function (resp) {
                    if(resp && resp.status === 1){
                        obj.attr("data-original-title", "推荐");
                        obj.removeClass("remove-relate");
                        obj.addClass("add-relate");
                        obj.find("i").attr("class","glyphicon glyphicon-thumbs-up");
                        $("#ids").val(resp.info);
                        $("#package-detail-table").load("../ProductPackage/detailList", {id: $("#id").val()});
                    } else {
                        dialog.popupTip('', resp.info);
                    }
                });
            }, "您确定取消推荐吗？");
        });
    }

    function productSearch() {
        var param = $('#product-search').formSerialize();
        $("#relate-modal-body").load("../ProductPackage/relateProduct?" + param);
    }
    function searchChange(){
        $("#packageModal").on("change", "select.selectpicker", function(){
            productSearch()
        });
        $("#packageModal").on("click", "#search-btn", function(){
            productSearch()
        });
    }

    //产品推荐分页
    function loadProducts() {
        $('#packageModal').on('click', '.modal-pagination-nav .num', function (e) {
            //阻止默认事件，  就是#锚点跳走
            e.preventDefault();
            //页码
            var p = $(this).attr('data-val');
            var param = $('#product-search').formSerialize();
            $("#relate-modal-body").load("../ProductPackage/relateProduct?" + param + "&p=" + p);
        })
    }

    return {
        searchPackge: function (){
            $("#search-btn").click(function(){
                var param = $("#search-package-form").formSerialize();
                var p1 = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        loadProduct: function(batchUrl) {
            $('#maker, #sort').change(function(){
                search(batchUrl);
            });
            $('#clickSearch').click(function(){
                search(batchUrl);
            });
            search(batchUrl);   //第一次加载页面
        },
        loadAdd: function(batchUrl) {
            var id = $("#id").val();
            var act = $("#act").val();
            $("#product-add-table").load(batchUrl, {id:id,act: act}, function() {
                next();
                $('.plus-minus').spinner({value:0, step: 1, min: 1, max: 999});
                plusOrMinusNum();//数量添加
            });
        },
        addProduct: function(batchUrl, addUrl) {
            $("#product-table").on('click', 'a.add-product', function () {
                var id = $("#id").val();
                var pid = $(this).attr("data-id");
                var act = $("#act").val();
                var obj = $(this);
                ajax.todo('post', batchUrl, {id: id, pid: pid, act: act}, function (resp) {
                    if(resp && resp.status === 1) {
                        obj.attr("data-original-title", "删除");
                        obj.removeClass("add-product");
                        obj.addClass("remove-add");
                        obj.find("i").attr("class","glyphicon glyphicon-trash");
                        $("#product-add-table").load(addUrl, {id:id,act: act}, function() {
                            next();
                            $('.plus-minus').spinner({value:0, step: 1, min: 1, max: 999});
                        });
                    } else {
                        dialog.popupTip('', resp.info);
                    }
                });
            });
        },
        delProduct : function(batchUrl){
            $(".panel-body").on("click", "a.remove-add", function () {
                var obj = this;
                myQtip(obj, function() {
                    deleteAdd(batchUrl, obj);
                });
            });
        },
        quantity: function() {
            $("#sale-product-list").on('blur', 'input',function() {
                var id = $(this).attr("data-id");
                var pid = $(this).attr("data-val");
                var val = $(this).val();
                var act = $("#act").val();
                var obj = this;
                ajax.todo('post', "../ProductPackage/quantity", {id: id, pid: pid, val: val, act: act}, function (resp) {
                    if(resp && resp.status === 1){
                        $(obj).val(resp.info);
                    } else {
                        dialog.popupTip('', resp.info);
                    }
                });
            });
        },
        checkName : function() {
            $("#packgage_name").blur(function() {
                var name = $.trim($("#packgage_name").val());
                if(name != '') {
                    var id = $("#id").val();
                    var act = $("#act").val();
                    $("#packgage_name").val(name);
                    ajax.todo('post', "../ProductPackage/check", {id: id, name: name, act: act}, function (resp) {
                        if(resp || resp == "true"){
                            $(".name-error").text("");
                        } else {
                            $(".name-error").text("名称已存在");
                        }
                    });
                } else {
                    $(".name-error").text("请填写名称");
                }
            });
        },
        edit: function(url) {
            $('#products-list-table').on('click','span.delete',function(){
                var json = $.parseJSON($(this).attr('data-val'));
                ajax.todo('post', url, {package_id:json.package_id,price_id:json.price_id}, function (resp) {
                    if(resp && resp.status === 1){
                        var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                        window.location.href = p1;
                    } else {
                        dialog.popupTip('', resp.info);
                    }
                });
            });
        },
        validForm: function () {
            $('#package-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[package_name]': {
                        required: true,
                        rangelength: [2,50],
                        remote: {
                            url:"../ProductPackage/check",
                            type: "post",
                            dataType: "json",
                            data: {id: $("#id").val(), act: $("#act").val()}
                        }
                    },
                    'postDB[lead_time]': {
                        required: true,
                        digits: true
                    },
                    'postDB[package_des]': {
                        minlength: 2
                    }
                },
                messages: {

                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../ProductPackage/saveUpdate',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/platform/productPackage/&p=1";
                            } else {
                                $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                    return false;
                }
            });
        },
        initiateFancybox : function(){
            $(".fancybox").fancybox();
        },
        removePackage: function(batchUrl) {
            $("#packageModal").on("click", "a.remove-relate", function() {
                var id = $("#index-id").attr("data-id");  //成套设备产品id（明细表）
                var pid = $(this).attr("data-id");  //推荐产品pid
                var obj = this;
                myQtip(obj, function() {
                    ajax.todo('post', batchUrl, {id: id, pid: pid}, function (resp) {
                        if(resp && resp.status === 1){
                            $(obj).parent().parent().remove();
                            $("#package-detail-table").load("../ProductPackage/detailList", {id: $("#id").val()});
                        } else {
                            dialog.popupTip('', resp.info);
                        }
                    });
                });
            });
        },
        relateProduct: function(){
            relate();
            searchChange();
            loadProducts();
        }
    }
});