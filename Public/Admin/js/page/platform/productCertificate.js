/**
 * Created by Root on 2015/7/1.
 */

define(['dialog', 'ajax', 'jForm', 'urlQuery', 'valid'], function(dialog ,ajax) {
    return {
        submitModal : function(modalId, modalForm, modalBtn){
            modalId   = modalId ? '#' + modalId : '.modal';
            modalForm = modalForm || 'modalForm';
            modalBtn  = modalBtn || 'modalBtn';
            $('#viewSort').on('click', '#modalBtn', function (e) {
                var falge = true;
                var code =  $(this).parent().parent().find(".code");
                var issue =  $(this).parent().parent().find(".issue");
                var pic =  $(this).parent().parent().find(".id-input-file");
                var from = $(this).parent().parent().parent();
                var error = $(this).next('small');
                var btn = $(this);
                if(code.val()==null||code.val()==''){
                    code.next('small').html('请填写证书编号');
                    falge=false;
                }else{
                    code.next('small').html('');
                }

                if(issue.val()==null||issue.val()==''){
                    issue.next('small').html('请填写发证单位');
                    falge=false;
                }else{
                     issue.next('small').html('');
                }
                if(pic.val()==null||pic.val() ==''){
                    pic.next('small').html('请选择证书图片');
                     falge=false;
                }else{
                    pic.next('small').html('');
                }
                if(falge){
                    btn.attr('disabled', true).html('录入中...');
                    from.ajaxSubmit({
                        success : function(resp){//请求成功后返回的数据,类是 Object { status=0, info="对不起，服务器忙请稍候重试"}
                            if(resp && resp.status == 1){
                                btn.attr('disabled', true).html('已录入');
                            }else {
                                $(modalId).modal('show');
                                error.html("添加出错");
                            }
                        }
                    });
                }
            });
        }

    }
});