/**
 * Created by Administrator on 2015/7/10.
 */
define(['Dropzone', 'dialog'], function (Dropzone, dialog) {
    return {
        delImg: function (url) {
            $('.dropzone .del-img').live('click', function () {
                var _this = $(this);
                var pid = parseInt($(this).attr('data-val')) || 0;
                if (pid < 0) {
                    return false;
                }
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: url,
                    data: {pid: pid},
                    dataType: "json",
                    success: function (resp) {
                        if (resp && resp.status == 1) {
                            _this.parent().remove();
                        }
                    }
                });
            });
        },
        dropPicUpload: function () {
            $("#my-dropzone").dropzone({
                init: function () {
                    this.on("addedfile", function (file) {
                        var removeButton = Dropzone.createElement("<button style='cursor: pointer' class='btn btn-xs font-blue btn-block'>删除图片</button>");
                        var _this = this;
                        removeButton.addEventListener("click", function (e) {
                            var _this2 = $(this);
                            e.preventDefault();
                            e.stopPropagation();

                            var pid = parseInt(_this2.attr('data-val')) || 0;
                            if(pid < 0) return false;

                            $.ajax({//到后台删除图片
                                cache: false,
                                type: "GET",
                                url: '../MakerProducts/delImg',
                                data: {pid: pid},
                                dataType: "json",
                                success: function (resp) {
                                    if (resp && resp.status == 1) {
                                        _this.removeFile(file);
                                        _this2.parent().remove();
                                    } else if(resp) {
                                        dialog.popupTip('', resp.info);
                                    }
                                }
                            });
                        });
                        file.previewElement.appendChild(removeButton);
                    });
                    this.on('success', function (file) {
                        //不存在上传的文件，以及等待上传的文件
                        //if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                        var resp = $.parseJSON(file.xhr.response);
                        if(resp && resp.status > 0){
                            var name = file.name;
                            //找到删除按钮
                            var dzImage = $('.dz-image').find('img[alt="'+name+'"]').parent();
                            var delBtn = dzImage.siblings('button');
                            delBtn.attr('data-val', resp.status);
                        }
                        //}
                    });
                },
                url: "../MakerProducts/post_2",
                maxFilesize: 1,
                acceptedFiles: 'image/*',
                dictInvalidFileType: '图片类型不合法',
                thumbnailWidth: 160,
                thumbnailHeight: 160,
                dictDefaultMessage: '<h3>点击选择图片，或将图片拖到这里</h3>',
                previewTemplate: "<div class=\"dz-preview dz-file-preview\">" +
                "<div class=\"dz-image\"><img data-dz-thumbnail/></div>" +
                "<div class=\"dz-details\">" +
                "<div class=\"dz-size\"><span data-dz-size></span></div>" +
                "<div class=\"dz-filename\"><span data-dz-name></span></div>" +
                "</div>" +
                "<div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>" +
                "<div class=\"dz-error-message\"><span data-dz-errormessage></span></div>" +
                "<div class=\"dz-success-mark\"><strong class='font-red font-xxL'>✔</strong></div>" +
                "<div class=\"dz-error-mark\"><strong class='font-red font-xxL'>✘</strong></div>" +
                "</div>"
            });
        }
    }
});
