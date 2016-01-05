/**
 * Created by Administrator on 2015/7/20.
 */
define(['ajax', 'dialog', 'treeTable', 'qtip'], function (ajax, dialog) {
    return {
        updateCache: function () {
            $('#update-cache').qtip({
                hide: {
                    event: 'unfocus'
                },
                style: {
                    width: 130
                },
                content: {
                    text: '<p class="font-m">确定更新数据字典缓存文件吗？</p>' + "<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
                    "<a class='btn btn-default btn-xs ml-10 font-s' id='close'>关闭</a></div>  ",
                    title: {
                        text: "提示"
                    }
                },
                events: {
                    render: function (event, api) {
                        $('#close', api.elements.content).click(function (e) {
                            api.hide(e);
                        });
                        $('#confirm', api.elements.content).click(function (e) {
                            api.hide(e);
                            ajax.todo('GET', '../SysDict/updateSysDictCache', function (resp) {
                                if (resp){
                                    dialog.popupTip('', resp.info);
                                }
                            });
                        });
                    }
                },
                position: {
                    at: 'left center',
                    my: 'center right'
                },
                show: {
                    event: 'click'
                }
            });
        },
        initSysDictTree: function () {
            $("#sys-dict-tree").treetable({
                expandable: true,
                stringExpand: "展开",
                stringCollapse: "收起"
            });
            //高亮选中行
            $("#sys-dict-tree tbody").on("mousedown", "tr", function () {
                $("#sys-dict-tree .active").not(this).removeClass("active");
                $(this).toggleClass("active");
            });
        },
        selCodeRule: function () {
            $('#sysDictModal').on('click', 'input[name="code_rule"]', function () {
                var ruleVal = $(this).val();
                if ($(this).attr('checked') && ruleVal) {
                    ajax.todo('GET', '../SysDict/getSysDictCode', {type: ruleVal, json: 1}, function (resp) {
                        if (resp && resp.status == 1) {
                            $('input[name="dict_no"]').val(resp.info);
                        }
                    });
                }
            });
        },
        cloneItem: function () {
            $('#sysDictModal').on('click', '.pointer', function () {
                var _this = $(this);
                if (_this.find('i').hasClass('glyphicon glyphicon-minus')) {
                    _this.parent().remove();
                } else if (_this.find('i').hasClass('glyphicon glyphicon-plus')) {
                    var clone = _this.parent().clone();
                    clone.find('input').val('');
                    clone.find('.pointer').find('i').removeClass('glyphicon glyphicon-plus').addClass('glyphicon glyphicon-minus');
                    if (_this.parent().siblings('.clone').length > 0) {
                        clone.insertAfter(_this.parent().siblings('.clone').last());
                    } else {
                        clone.insertAfter(_this.parent());
                    }
                }
            });
        },
        submitSysDictEdit: function () {
            var _this = this;
            $('.panel-body').on('click', '#sysDictEditModal .submit-edit', function () {
                var $this = $(this);
                $('#sysDictEditForm input').focus(function () {
                    $(this).css('border-color', '#66afe9');
                });
                var dictNameInput = $('input[name="name"]');//字典名称
                var isOk = true;
                if (!$.trim(dictNameInput.val())) {
                    dictNameInput.css('border-color', '#f40');
                    isOk = false;
                }
                if (isOk) {
                    $this.attr('disabled', 'disabled');
                    $('#sysDictEditModal').modal('hide');
                    $('#sysDictEditForm').ajaxSubmit({
                        success: function (resp) {
                            if (resp && resp.status == 1 && resp.info > 0) {
                                $('#name_' + resp.info).text(dictNameInput.val());
                            }
                        }
                    });
                }
            })
        },
        submitSysDict: function () {
            var _this = this;
            $('#sysDictModal').on('click', '.submit', function () {
                var $this = $(this);
                $('#sysDictForm input').focus(function () {
                    $(this).css('border-color', '#66afe9');
                });

                var dictNoInput = $('input[name="dict_no"]');//字典编码
                var dictNameInput = $('input[name="dict_name"]');//字典名称

                var isOk = true;
                if (!$.trim(dictNoInput.val())) {
                    dictNoInput.css('border-color', '#f40');
                    isOk = false;
                }
                if (!$.trim(dictNameInput.val())) {
                    dictNameInput.css('border-color', '#f40');
                    isOk = false;
                }
                if (isOk) {
                    $this.attr('disabled', 'disabled');
                    $('#sysDictModal').modal('hide');
                    $('#sysDictForm').ajaxSubmit({
                        success: function (resp) {
                            if (resp && resp.status == 1) {
                                ajax.loadData({
                                    id: 'sys-dict-table',
                                    url: '../SysDict/table?p=1',
                                    callback: function () {
                                        _this.initSysDictTree();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }
});