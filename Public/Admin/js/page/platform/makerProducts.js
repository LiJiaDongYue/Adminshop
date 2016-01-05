/**
 * Created by Administrator on 2015/7/3.
 */
define(['dialog', 'ajax', 'ZeroClipboard', 'page/bootstrap-select','editor', 'jForm', 'tagsInput'], function (dialog, ajax, ZeroClipboard, select) {
    return {
        post_1: function () {
            $('.panel-footer .next-step').on('click', function () {

                $("input[name^='attr_names']").focus(function () {
                    $('#showError').html('');
                    $(this).css('border-color', '#66afe9');
                });
                $("input[name^='attr_values']").next('.bootstrap-tagsinput').find('input').focus(function () {
                    $('#showError').html('');
                    $(this).parent().css('border-color', '#66afe9');
                });

                var isSubmit = true;
                //验证属性名
                $("input[name^='attr_names']").each(function () {
                    if(!$(this).val() || $.trim($(this).val()) == ''){
                        $(this).css('border-color', '#f00');
                        isSubmit = false;
                    }
                });
                //验证属性值
                $("input[name^='attr_values']").each(function () {
                    if(!$(this).val() || $.trim($(this).val()) == '') {
                        $(this).next('.bootstrap-tagsinput').css('border-color', '#f00');
                        isSubmit = false;
                    }
                });
                //验证计量单位
                var product_unit = $('#product_unit');
                if(!product_unit || $.trim(product_unit.val()) == ''){
                    product_unit.css('border-color', '#f00');
                    isSubmit = false;
                }
                if (isSubmit) {
                    var queryString = $('input[name="id"],input[name="sort_id"]').fieldSerialize();
                    var btn = $(this);
                    //提交表单
                    btn.attr('disabled', true);
                    $('#product-info-1').ajaxSubmit({
                        url: '../MakerProducts/post_1',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                window.location.href = "#/platform/makerProducts/step_2/&j=2&" + queryString;
                            } else {
                                btn.attr('disabled', false);
                                dialog.popupTip('', resp.info);
                            }
                        }
                    });
                } else {
                    $('#showError').html('请填写带*号的信息，否则无法进行下一步');
                }
            });
        },
        initInputTags: function () {
            $(".select-tags").tagsinput();
        },
        initEditor: function () {
            window.ZeroClipboard = ZeroClipboard;
            //删除已创建的编辑器
            var editor = new UE.ui.Editor({initialFrameHeight: 300});
            editor.render('description');
            //UE.delEditor('description');
            //UE.getEditor('description',{initialFrameHeight:300});
        },
        addAttr: function () {
            var _t = this;
            $('.panel-body').on('click', '.custom-attr-add', function () {
                var _this = $(this);
                if (_this.find('i').hasClass('glyphicon glyphicon-minus')) {
                    _this.parent().remove();
                } else if (_this.find('i').hasClass('glyphicon glyphicon-plus')) {
                    var clone = _this.parent().clone();
                    clone.find('input').val('');
                    clone.find('.bootstrap-tagsinput').remove();
                    clone.find('.custom-attr-add').find('i').removeClass('glyphicon glyphicon-plus').addClass('glyphicon glyphicon-minus');
                    if (_this.parent().siblings('.form-inline').length > 0) {
                        clone.insertAfter(_this.parent().siblings('.form-inline').last());
                    } else {
                        clone.insertAfter(_this.parent());
                    }
                    //console.log(clone.find('input.select-tags'));
                    _t.initInputTags();
                }
            });
        },
        addProductInfo: function () {
            $('.panel-body').on('click', 'a.add-pro-info', function () {
                var pro = $(this);
                var id = pro.attr('data-val');
            });
        },
        bindSel: function () {
            $('.panel-body').on('change', '#maker_id,#sort_id', function () {
                $('#showError').html('');
                var makerId = parseInt($('#maker_id').val()) || 0;
                var sortId = parseInt($('#sort_id').val()) || 0;
                ajax.loadData({
                    'url': '../MakerProducts/table',
                    'param': {sort_id: sortId, maker_id: makerId},
                    'id': 'maker-products-table'
                });
                select.removeLabels();
            });
        },
        addRow: function () {
            $('.panel-body').on('click', 'a.add-row', function () {
                var xuHao = $('.xu-hao').last();
                //选好最大值
                var index = parseInt(xuHao.html());
                //得到要克隆的tr
                var cloneTr = $('.clone-tr').clone(true);
                //修改克隆tr的序号
                cloneTr.find('.xu-hao').html(index + 1);
                //移除.clone-tr样式
                cloneTr.removeClass('clone-tr');
                //清除产品名称
                cloneTr.find("input[name^='product_name']").val('');
                cloneTr.find("input[name^='product_name']").removeAttr('name').attr('name', 'product_name[]');
                //插入克隆的tr
                cloneTr.insertAfter(xuHao.parent());
            });
        },
        saveAll: function () {
            $('.panel-body').on('click', 'a.save-all', function () {
                var btn = $(this);
                var makerId = parseInt($('select[name="maker_id"]').val()) || 0;
                var sortId = parseInt($('select[name="sort_id"]').val()) || 0;
                if (makerId < 0 || sortId < 0) {//没有选择厂商或产品分类
                    $('#showError').html('请先选择厂商或产品分类');
                    return false;
                }
                //设置厂商或产品分类id
                $('input[name="maker_id"]').val(makerId);
                $('input[name="sort_id"]').val(sortId);
                btn.attr('disabled', true).html('<i class="glyphicon glyphicon-ok"></i>保存中...');
                $('#maker-products-form').ajaxSubmit({
                    url: '../MakerProducts/saveAll',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if (resp && resp.status === 1) {
                            window.location.href = "#/platform/makerProducts/&p=1&_=" + Math.random();
                        } else {
                            btn.attr('disabled', false).html('<i class="glyphicon glyphicon-ok"></i>保存');
                            dialog.popupTip('', resp.info);
                        }
                    }
                });
            });
        }
    }

});