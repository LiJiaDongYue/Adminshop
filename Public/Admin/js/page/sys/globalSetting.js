/**
 * Created by Administrator on 2015/7/2.
 */

define(['dialog', 'jForm'],function(dialog){

    return {
        submitGlobalSetting : function(){
            $('#submitGlobalBtn').on('click',function(){
                var _this = $(this);
                _this.attr('disabled',true).html('提交中...');
                $('#global-setting-form').ajaxSubmit({
                    url: '../GlobalSetting/save',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        _this.attr('disabled',false).html('提交');
                        dialog.popupTip('',resp.info);
                    }
                });
            });
        },
        submitEmailSetting : function () {
            $('#submitEmailBtn').on('click', function(){
                var btn = $(this);
                var server = $("#web_mail_server").val();
                var acc = $("#web_mail_acc").val();
                var pas = $("#web_mail_pas").val();
                var port = $("#web_mail_port").val();
                if(server==null||server==""){
                    dialog.popupTip('',"请填写SMTP服务器！");
                    return false;
                }
                if(acc==null||acc==""){
                    dialog.popupTip('',"请填写邮箱账号！");
                    return false;
                }
                if(pas==null||pas==""){
                    dialog.popupTip('',"请填写邮箱密码！");
                    return false;
                }
                if(port==null||port==""){
                    dialog.popupTip('',"请填写SMTP端口！");
                    return false;
                }
                btn.attr('disabled',true).html('提交中...');
                $('#email-setting-form').ajaxSubmit({
                    url: '../GlobalSetting/save',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        btn.attr('disabled',false).html('提交');
                        dialog.popupTip('',resp.info);
                    }
                });
            });
        }
    }
});
