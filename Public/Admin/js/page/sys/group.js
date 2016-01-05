/**
 * Created by Root on 2015/6/11.
 */

define(['dialog', 'ajax', 'valid', 'jForm'],function (dialog, ajax) {
    function checkName(fn) {
        var id = $("#id").val();
        var name = $.trim($("#group_name").val());
        $("#group_name").val(name);
        if(name != '') {
            ajax.todo("../Group/check", {id:id, groupname: name}, function(resp) {
                if(resp) {
                    if(typeof fn == "function") {
                        fn();
                    }
                } else {
                    dialog.popupTip('', "组名称已存在");
                }
            });
        }
    }

    $("#group_name").blur(function() {
        checkName();
    });

    return {
        canceBtn: function() {
            $("#cancelBtn").click(function() {
                $("#id").val("");
                $("#group_name").val("");
                $("#submitGroup").html("添加");
                $("#cancelBtn").addClass("hidden");
            });
        },
        submitForm: function () {
            $('#submitGroup').click(function() {
                var name = $.trim($("#group_name").val());
                    if(name != '') {
                        checkName(function() {
                            $("#group-form").ajaxSubmit({
                                url: '../Group/save',
                                type: 'POST',
                                dataType: 'json',
                                success: function (resp) {
                                    if(resp && resp.status === 1){
                                        window.location.href = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                    } else {
                                        dialog.popupTip('',resp.info);
                                        $("#submitGroup").attr('disabled',false);
                                    }
                                }
                            });
                        });
                    } else {
                        dialog.popupTip('', "请填写用户组名称");
                    }

            });
            return false;
        },
        editGroup: function () {
            $("#group-table").on("click", "span.group-edit",function() {
                var group = $.parseJSON($(this).attr('data-val'));
                $("#id").val(group.id);
                $("#group_name").val(group.group_name);
                $("#submitGroup").html("修改");
                $("#cancelBtn").removeClass("hidden");
            });
        },
        sortGroup: function() {
            $("#group-table").on("click", "#submitStSort",function() {
                $("#group-sort-form").ajaxSubmit({
                    url: '../Group/sortGroup',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if(resp && resp.status === 1){
                            window.location.href = $.query.load(window.location.hash).set('_',Math.random()).toString();
                        } else {
                            dialog.popupTip('',resp.info);
                        }
                    }
                });
                return false;
            });

        }
    }


});