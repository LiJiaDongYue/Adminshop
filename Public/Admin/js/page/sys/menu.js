/**
 * Created by Administrator on 2015/6/11.
 */
define(['treeTable','valid','jForm'], function () {
    return {
        initMenuTree : function(){
            $("#menu-tree-table").treetable({
                expandable: true,
                stringExpand: "展开",
                stringCollapse: "收起",
                indent:8
            });
            //高亮选中行
            $("#menu-tree-table tbody").on("mousedown", "tr", function() {
                $("#menu-tree-table .active").not(this).removeClass("active");
                $(this).toggleClass("active");
            });
        },
        selLoad : function(){
            var _this = this;
            $('#group-sel').on('change',function(){
                //获得组的id
                var gid = $(this).val();
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '../Menu/table?gid=' + gid,
                    dataType: "html"
                }).done(function (html) {
                    $('#menu-table').html(html);
                    _this.initMenuTree();
                    _this.menuSort();
                });
            });
        },
        menuSort : function(){
            $('#menu-tree-form').validate({
                submitHandler: function (form) {
                    $(form).find('#submitMenuBtn').attr('disabled',true).html('修改排序中...');
                    $(form).ajaxSubmit({
                        url: '../Menu/sort',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/sys/menu/&_=" + Math.random() ;
                            } else {
                                $(form).find('#submitMenuBtn').attr('disabled',false).html('修改排序');
                            }
                        }
                    });
                }
            });
        },
        validMenuForm : function () {
            $('#menu-form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[menu_name]': {
                        required: true
                    },
                    'postDB[menu_url]': {
                        required: true
                    },
                    'postDB[menu_key]': {
                        required: true
                    }
                    //,
                    //'postDB[menu_class]': {
                    //    required: true
                    //}
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Menu/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/sys/menu/&p="+ Math.random();
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