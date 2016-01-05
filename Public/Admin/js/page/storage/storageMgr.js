/**
 * Created by MuYe on 2015/7/21.
 */
define(['ajax','dialog', 'valid', 'jForm'],function(ajax,dialog){
    return {
        submitStorage: function() {
                $('#storageMgrModal').on('click', '#modalBtn', function (e) {
                    var is_submit = true;
                    var stockNameInput = $('#stock_name');//仓库名称
                    var stockAddressInput = $('#stock_address');//仓库地点
                    var areaIdInput = $('#area_id');
                    var comment = $('#comment').val();
                   if(!$.trim(stockNameInput.val())){
                       stockNameInput.next('small').html('该输入项必填');
                       is_submit = false;
                   }
                    if(!$.trim(areaIdInput.val())){
                        $('#area').next('small').html('该输入项必填');
                        is_submit = false;
                    }

                    if(!$.trim(stockAddressInput.val())){
                        stockAddressInput.next('small').html('该输入项必填');
                        is_submit = false;
                    }
                    if(is_submit){
                        $('#modalBtn').attr('disabled', true);
                        $('#storageMgrModal').modal('hide')
                        $('#modalForm').ajaxSubmit({
                            success : function(resp){//请求成功后返回的数据,类是 Object { status=0, info="对不起，服务器忙请稍候重试"}
                                if(resp && resp.status == 1){
                                    ajax.loadData({
                                        id : 'storageMgr-table',
                                        url : '../StorageMgr/table'
                                    });
                                }
                            }
                        });
                    }
                });
            },
        bindStart :function(){
            $('#get_address').click(function(){
                $('small').remove('#show_area_error');
                $('#area').removeClass().addClass('form-group');
            });
        },
        bindIsWork : function(){
            $('#storageMgr-table').on('click','a.is_work',function(){
                var id = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                ajax.todo('POST', '../StorageMgr/doIsWork', {stock_id:id,is_active:val},function(resp){
                    if(resp && resp.status === 1){
                        var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                        window.location.href = p1;
                    } else {
                        dialog.popupTip('',resp.info);
                    }
                });
            });
        },
        validForm: function () {
            $('#storageMgr-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'pDB[stock_name]': {
                        required: true
                    },
                    'pDB[stock_address]':{
                        required: true
                    }
                },
                messages: {
                    'pDB[stock_name]': {
                        required: "该选项必填！"
                    },
                    'pDB[stock_address]': {
                        required: "该选项必填！"
                    }
                },
                submitHandler: function (form) {
                    if($('#area_name').val()==''){
                        $("#area").addClass('has-error');
                        $('<small id="show_area_error" class="error pull-left mt-10">&nbsp;请选择所属区域</small>').insertAfter(".area-error");
                        return false;
                    }
                    $(form).find('#submitBtn').attr('disabled', true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../StorageMgr/doAddStorage',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                //var p1 = $.query.set('_',Math.random()).toString();
                                window.location.href = '#/storage/storageMgr/&p=1';
                            } else {
                                $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });
        }
    }
});
