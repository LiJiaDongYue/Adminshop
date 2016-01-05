/**
 * Created by Administrator on 2015/6/11.
 */
define(['dialog', 'valid', 'jForm'], function (dialog) {
    return {
        validRoleForm: function () {
            $('#role-btn').click(function(){
                var val = $('input[name="postDB[role_name]"]').val();
                if(!$.trim(val)){
                    dialog.popupTip('','角色名称必填');
                    return false;
                }
                $('#role-form').ajaxSubmit({
                    url: '../Role/save',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if(resp && resp.status === 1){
                            var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                            window.location.href = p1;
                        } else {
                            dialog.popupTip('',resp.info);
                        }
                    }
                });
            });
        },
        editRole : function(){
            $('#role-table').on('click','.role-edit',function(){
                var role = $.parseJSON($(this).attr('data-val'));
                $('input[name="postDB[role_name]"]').val(role.role_name);
                $('select[name="postDB[group_id]"]').val(role.group_id);
                $('input[name="postDB[id]"]').val(role.id);
                $('#role-btn').html('修改角色').removeClass().addClass('btn btn-danger');
                $('#cancel_role').removeClass().addClass('btn btn-default ml-20');
                $('.role-edit').attr('disabled',false);
                $(this).attr('disabled','disabled');

            });
        },
        bindCancelRole: function(){
            $('#cancel_role').click(function(){
                $('input[name="postDB[role_name]"]').val('');
                $('select[name="postDB[group_id]"]').val('');
                $('input[name="postDB[id]"]').val('');
                $('#cancel_role').removeClass().addClass('hidden');
                $('#role-btn').html('添加角色').removeClass().addClass('btn btn-warning');
                $('.role-edit').attr('disabled',false);
            });
        },
        bindCheck : function (){
            /*全选、分组选、单选*/
            $('#role-form #check-all').click(function(){
                $('#role-form input[class^="check-"]').attr('checked', $(this).attr('checked') ? true : false);
            });
            $('#role-form input[class^="check-group-"]').click(function(){
                var inputId = $(this).val();
                $('.check-one-' + inputId).attr('checked', $(this).attr('checked') ? true : false);

                var checkedLen = $('#role-form input[class^="check-group-"]:checked').length;
                var chkLen = $('#role-form input[class^="check-group-"]').length;
                $('#role-form #check-all').attr('checked', checkedLen === chkLen);

            });
            $('#role-form input[class^="check-one-"]').click(function(){

                var pId = $(this).attr('data-val');
                var checkedLen = $('#role-form input[class="check-one-'+pId+'"]:checked').length;


                $('#role-form .check-group-' + pId).attr('checked', checkedLen > 0 ? true : false);


                var checkedLen2 = $('#role-form input[class^="check-one-"]:checked').length;
                var chkLen2 = $('#role-form input[class^="check-one-"]').length;
                $('#role-form #check-all').attr('checked', checkedLen2 === chkLen2);

            });
        },
        PermissionSet : function () {
            $("#role-form").validate({
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Role/permissionSave',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                var p1 = $.query.load("#/sys/role/&p=1").set('_',Math.random()).toString();
                                window.location.href = p1;
                            } else {
                                $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                $('#role_name').after('<small class="error">'+resp.info+'</small>');
                            }
                        }
                    });
                }
            });

        }

    }
});