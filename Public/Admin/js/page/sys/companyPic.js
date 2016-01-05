/**
 * Created by zq123 on 2015/8/5.
 */
define(['Dropzone','ajax','dialog', 'jForm','urlQuery', 'valid'],function(Dropzone,ajax,dialog){
    function myQtip(obj,fn,ids,msg) {
        var warnMsg =  msg ? msg : "您确定取消吗？";
        var btn = $(obj);
        btn.qtip({
            hide: {event: 'unfocus'},
            style : {width: 130},
            content: {
                text: '<p class="font-m">'+warnMsg+'</p>'+"<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
                "<a class='btn btn-default btn-xs ml-10 font-s' id='close'>关闭</a></div>  ",
                title: {text: "提示"}
            },
            model : true,
            events : {
                render: function(event, api) {
                    if(ids){
                        $('#close', api.elements.content).click(function(e) {
                            api.hide(e);
                        });
                        $('#confirm', api.elements.content).click(function(e) {
                            api.hide(e);
                            btn.unbind("click");
                            fn(ids);

                        });
                    }
                }
            },
            position: {at: 'top left', my: 'bottom right'},
            show: {ready: true, event: 'click'}
        });

    }
    function delSort(psid){
        $.ajax({
            cache: false,
            type: "GET",
            url: "../CompanyInfo/delPicSort",
            data: {psid: psid},
            dataType: "json",
            success: function (resp) {
                if (resp && resp.status == 1) {
                    var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                    window.location.href = p1;
                }else{
                    dialog.popupTip('',resp.info);
                }
            }
        });
    }
    return{
        delPicSort : function(){
            $('#sort_del').click(function(){
                var ids = new Array();
                $('input[class^="picsort_del"]:checked').each(function(){
                        var id = $(this).attr('data-val');
                        ids.push(id);
                });

                var psid = ids.join(',');
                if(psid ==''){
                    dialog.popupTip('','请勾选您想删除的图集');
                    api.hide(e);

                }else{
                    myQtip(this,delSort,psid,'删除后不可恢复，确定删除吗？');
                }
            });
        },
        goPic : function(){
            $('.goPic').click(function(){
                var psid = $(this).attr('data-id');
                window.location.href='#/sys/companyInfo/&p=5&psid='+psid;
            });
        },
        setFacePic : function(){
            $('.set_default').click(function(){
                var pid = $(this).attr('data-id');
                if(pid){
                    $.ajax({
                        cache: false,
                        type: "GET",
                        url: "../CompanyInfo/setFacePic",
                        data: {pid: pid},
                        dataType: "json",
                        success: function (resp) {
                            if (resp && resp.status == 1) {
                                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                window.location.href = p1;
                            }else{
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });

        },
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
            $(".dropzone").dropzone({
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
                                url: '../CompanyInfo/delImg',
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
                url: "../CompanyInfo/post_2",
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
        },
        submitModal : function(modalId, modalForm, modalBtn){
            modalId   = modalId ? '#' + modalId : '.modal';
            modalForm = modalForm || 'modalForm';
            modalBtn  = modalBtn || 'modalBtn';
            $('#companyPicModal').on('focusin','#name',function(){
                $(this).next('small').html('');
            });
            $('#companyPicModal').on('change','#picgroup_type',function(){
                $(this).next('small').html('');
            });
            $('#companyPicModal').on('click', '#modalBtn', function (e) {
                var falge = true;
                var picName = $('#name');
                var picgroup = $('#picgroup_type');
                var from = $(this).parent().parent().parent();
                var btn = $(this);


                if(picName.val()==null||picName.val()==''){
                    picName.next('small').html('该输入项必填');
                    falge=false;
                }

                if(picgroup.val()==null||picgroup.val()==''){
                    picgroup.next('small').html('该选择项必选');
                    falge=false;
                }

                if(falge){
                    btn.attr('disabled', true).html('录入中...');
                    from.ajaxSubmit({
                        success : function(resp){//请求成功后返回的数据,类是 Object { status=0, info="对不起，服务器忙请稍候重试"}
                            if(resp && resp.status == 1){
                                $('#companyPicModal').modal('hide');
                                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                                window.location.href = p1;
                            }else {
                                $(modalId).modal('show');
                                //error.html("添加出错");
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });
        }
    }
});

