/**
 * Created by zq123 on 2015/6/30.
 */
define([ 'ajax','dialog','ZeroClipboard','editor','valid', 'jForm','urlQuery', 'fancybox'], function (ajax,dialog,ZeroClipboard) {
    function myQtip(obj,fn,msg) {
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
                    $('#close', api.elements.content).click(function(e) {
                        api.hide(e);
                    });
                    $('#confirm', api.elements.content).click(function(e) {
                        api.hide(e);
                        btn.unbind("click");
                        fn();

                    });
                }
            },
            position: {at: 'top left', my: 'bottom right'},
            show: {ready: true, event: 'click'}
        });

    }

    function myRz(){
        var id = $('a.is-renzheng').attr('data-id');
        var val = $('a.is-renzheng').attr('data-val');
        ajax.todo('POST', '../Company/setRz', {rid:id,renzheng:val},function(resp){
            if(resp && resp.status === 1){
                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                window.location.href = p1;
            } else {
                dialog.popupTip('',resp.info);
            }
        });
    }
    function myLevels(){
        var id = $('a.is-levels').attr('data-id');
        var val = '0';
        ajax.todo('POST', '../Company/doLevels', {rid:id,levels:val},function(resp){
            if(resp && resp.status === 1){
                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                window.location.href = p1;
            } else {
                dialog.popupTip('',resp.info);
            }
        });
    }
    function myYz(){
        var val = '0';
        var id = $('a.is-yz').attr('data-id');
        ajax.todo('POST', '../Company/doYz', {rid:id,yz:val},function(resp){
            if(resp && resp.status === 1){
                var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                window.location.href = p1;
            } else {
                dialog.popupTip('',resp.info);
            }
        });
    }

    return {
        isChange : function(){
            //认证
            $('#company-table').on('click','a.is-renzheng',function(){
                var val = $(this).attr('data-val');
                if( '1'=== val){//已认证
                    myQtip(this,myRz);
                }else{//未认证
                        var qy_uid = $(this).attr('data-uid');
                        var qy_name = $(this).attr('data-qy_name');
                        window.location.href = '#/sys/company/qy_rz/&uid='+qy_uid+'&qy_name='+qy_name+'&rz='+val;
                }
            });
            //推荐
            $('#company-table').on('click','a.is-levels',function(){

                var val = $(this).attr('data-val');
                if(val == '1'){//若已经为推荐，则直接变为未推荐
                    myQtip(this,myLevels);
                }
            });
            //审核
            $('#company-table').on('click','a.is-yz',function() {
                var val = $(this).attr('data-val');
                if(val == '1'){//若已经审核，则直接变为未审核
                    myQtip(this,myYz);
                }
            });
        },

        initEditor: function () {
            window.ZeroClipboard = ZeroClipboard;
            //删除已创建的编辑器
            var editor = new UE.ui.Editor({initialFrameHeight: 300});
            editor.render('description');
            //UE.delEditor('description');
            //UE.getEditor('description',{initialFrameHeight:300});
        },
        initRzFancybox : function(){
            $('.fancybox').fancybox();
        },
        setRz : function () {
            $('#qy_rz').on('click',function(){
                var val = $(this).attr('data-val');
                var qy_uid = $(this).attr('data-id');
                ajax.todo('POST', '../Company/setRz', {uid:qy_uid,renzheng:val},function(resp){
                    if(resp && resp.status === 1){
                        //var p1 = $.query.set('_',Math.random()).toString();
                        window.location.href = '#/sys/company/&p=1';
                    } else {
                        dialog.popupTip('',resp.info);
                    }
                });
            });
        },
        validForm: function () {
            $('#company-form').validate({
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Company/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                //var p1 = $.query.set('_',Math.random()).toString();
                                window.location.href = '#/sys/company/&p=1';
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
