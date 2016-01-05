/**
 * Created by zq123 on 2015/7/26.
 */
define(['ajax','dialog', 'valid', 'jForm','urlQuery'],function(ajax,dialog){
    return {
        bindStorageInStep1 : function(){
            $('#order_number').focusin(function(){
                $(this).next('small').html('');
            });
            $('#in_type').focusin(function(){
                $(this).next('small').html('');
            });
            $('#sell_name').focusin(function(){
                $(this).next('small').html('');
            });
            $('.next-step').click(function(){
                    var is_submit = true;

                    var order_numberInput = $('#order_number');//采购单号
                    var in_typeInput = $('#in_type');//入库类型
                    var sell_nameInput = $('#sell_name');
                    if(!$.trim(order_numberInput.val())){
                        order_numberInput.next('small').html('该输入项必填');
                        is_submit = false;
                    }
                    if(!$.trim(sell_nameInput.val())){
                        sell_nameInput.next('small').html('该输入项必填');
                        is_submit = false;
                    }
                    if(!$.trim(in_typeInput.val())){
                        in_typeInput.next('small').html('该输入项必填');
                        is_submit = false;
                    }
                if(is_submit) {
                    $(this).attr('disabled', true);
                    $("#storageIn-step1").ajaxSubmit({
                        url: "../StorageIn/saveAddStep_1",
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                //var p1 = $.query.load("#/storage/storageIn/&p=1").set('_', Math.random()).toString();
                                window.location.href = '#/storage/storageIn/addStep_2/&sin_id='+resp.sin_id;
                            } else {
                                $('#storageIn-step1').find('#submitBtn').attr('disabled', false);
                                dialog.popupTip('', resp.info);
                            }
                        }
                    });
                }
            });
        },
        storageInForm : function(){
            $('#search-btn').click(function(){
                var param = $('#storageInSearch-form').formSerialize();
                var map = window.location.hash.split('&');
                var p1 = $.query.load(map[0] + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
            $('#end-date').change(function(){
                var param = $('#storageInSearch-form').formSerialize();
                var map = window.location.hash.split('&');
                var p1 = $.query.load(map[0] + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        storageInSearch : function(bsselect){
            var _this = this;
            //输入框查询
            $('#clickSearch').click(function(){
                var  sort_id = $('#sort_id').val();
                var maker_id = $('#maker_id').val();
               var product_name = $('#product_name').val();
                _this.storageLoadPage('storageInAdd-table','../StorageIn/tableAdd?product_name='+product_name+'&sort_id='+sort_id+'&maker_id='+maker_id,function(){
                    //加载下拉框
                    bsselect.bsSelect();
                });
            });
            //按分类,生产厂家 查询
            $('#sort_id,#maker_id').change(function(){
                var  sort_id = $('#sort_id').val();
                var maker_id = $('#maker_id').val();
                var product_name = $('#product_name').val();
                _this.storageLoadPage('storageInAdd-table','../StorageIn/tableAdd?sort_id='+sort_id+'&maker_id='+maker_id+'&product_name='+product_name,function(){
                    //加载下拉框
                    bsselect.bsSelect();
                });

            });

            $('#order_number').focusin(function(){
                $(this).next('small').html('');
            });
        },
        storagePageTable: function (bsselect) {
            var _this = this;
           $("#storageInAdd-table").on("click", ".pagination-nav .num",function(e) {
               //阻止默认事件，  就是#锚点跳走
               e.preventDefault();
               var p = $(this).attr('data-val');
               var product_name = $('#product_name').val();
               var sort_id = $('#sort_id').val();
               var maker_id = $('#maker_id').val();
               _this.storageLoadPage('storageInAdd-table',"../StorageIn/tableAdd?p="+p+'&product_name='+product_name+'&sort_id='+sort_id+'&maker_id='+maker_id,function(){
                   //加载下拉框
                   bsselect.bsSelect();
               });
           });
        },
        storageLoadPage : function(id, url, callback){
            $.ajax({
                cache: false,
                type: "GET",
                url: url,
                dataType: "html"
            }).done(function (html) {
                $('#'+id).html(html);
                if (typeof callback === 'function') {
                    return callback && callback(html);
                }
            });
        },
        submitStorageInForm: function () {    //保存添加
            $("#submitBtn").click(function() {
                $(this).attr('disabled', true);
                $("#storageIn-form").ajaxSubmit({
                    //url: "../StorageIn/setProductStorage",
                    url: "../StorageIn/saveAddStep_2",
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if (resp && resp.status === 1) {
                            //var p1 = $.query.load("#/storage/storageIn/&p=1").set('_', Math.random()).toString();
                            //window.location.href = p1;
                            window.location.href = "#/storage/storageIn/&p=1";
                        } else {
                            $('#storageIn-form').find('#submitBtn').attr('disabled', false);
                            dialog.popupTip('', resp.info);
                        }
                    }
                });
            });
        }
    }
});
