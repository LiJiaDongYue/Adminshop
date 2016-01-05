/**
 * Created by Administrator on 2015/7/3.
 */
define(['dialog', 'jForm', 'fancybox'], function (dialog) {
    return {
        selRz: function () {
            $('input[name="is_security"]').click(function () {
                $('#showError').html('');
                var val = $(this).val();
                if (val == 1) {//认证
                    $('.rz-table').find('input[type!="hidden"]').attr('disabled', false);
                    $('.is_renzheng').show();
                } else {
                    $('.rz-table').find('input[type!="hidden"]').attr('disabled', true);
                    $('.is_renzheng').hide();
                }
            });
        },
        delFile: function () {
            $('a.del-file').live('click', function () {
                $(this).parent().remove();
            });
        },
        viewPic : function(){
            $('.fancybox').fancybox();
        },
        bindUpload: function () {
            $("input[class^='upload']").live("change", function () {
                var file = $(this).val();
                var short_file = file.substring(0, 5);
                $(this).parent().nextAll("div").remove();
                $(this).parent().after("<div style=\"width:120px;\" title='" + file + "'><nobr><em>" + short_file + "</em></nobr>&nbsp;&nbsp;<a href='javascript:void(0);' class='del-file pull-right'>删除</a></div>");
            });

        },
        post_2: function () {
            $('.panel-footer .next-step').on('click', function () {
                var queryString = $('input[name="id"],input[name="sort_id"]').fieldSerialize();
                window.location.href = "#/platform/makerProducts/step_4/&j=4&" + queryString;
            });
        },
        post_3: function () {
            $('.panel-footer .next-step').on('click', function () {
                var isSecurity = $('input[name="is_security"]:checked').val();
                // TODO 是否验证
                var valid = true;
                if (isSecurity == 1) {//涉安产品认证
                    $('.rz-table').find('input[type!="file"]').each(function () {
                        if ($(this).val() == '') {
                            return valid = false;
                        }
                    });
                }
                if (valid) {
                    var queryString = $('input[name="id"],input[name="sort_id"]').fieldSerialize();
                    var btn = $(this);
                    //提交表单
                    btn.attr('disabled', true);
                    $('#product-info-3').ajaxSubmit({
                        url: '../MakerProducts/post_3',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status === 1) {
                                window.location.href = "#/platform/makerProducts/step_4/&j=4&" + queryString;
                            } else {
                                btn.attr('disabled', false);
                                dialog.popupTip('', resp.info);
                            }
                        }
                    });
                } else {
                    $('#showError').html('请填写带*号的信息，否则无法进行下一步');
                    return false;
                }
            });
        },

        post_4: function () {
            $('.panel-footer .next-step').on('click', function () {
                var btn = $(this);
                //提交表单
                btn.attr('disabled', true);
                $('#product-info-4').ajaxSubmit({
                    url: '../MakerProducts/post_4',
                    type: 'POST',
                    dataType: 'json',
                    success: function (resp) {
                        if (resp && resp.status === 1) {
                            window.location.href = "#/platform/makerProducts/&p=1";
                        } else {
                            btn.attr('disabled', false);
                            dialog.popupTip('', resp.info);
                        }
                    }
                });
            });
        }


    }

});