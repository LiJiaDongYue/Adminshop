/**
 * Created by donkey on 2014/11/11.
 */
define(function () {
    //------------自定义弹出框--------------
    //遮罩层
    var TL_mask = '<div id="mask"></div>';
    //居中的弹出窗口外框模板
    var TL_popWinCenter = '<div class="dialog center-popup common-modal">' +
        '<div class="panel-main panel-heading">'+
        '<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button><h4 id="modal-title"></h4>' +
        '</div>'+
        '<div id="modal-body"></div>'+
        '</div>';

    //-------------提示框----------
    var TL_popupTip = '<div class="dialog center-popup common-modal">' +
        '<div class="panel-main panel-heading">'+
        '<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button><h4 id="modal-title">提示</h4>' +
        '</div>'+
        '<div id="modal-body">' +
        '</br><p>&nbsp;&nbsp;&nbsp;&nbsp;<i id="ModalTipMsg"></i></p></br>' +
        '<div class="modal-footer">' +
        '<button class="btn btn-danger cancel" data-dismiss="modal" type="button">\u786E\u5B9A</button>' +
        '</div></div></div>';

    var body = $('body');
    return {
        addMask:function () {
            body.append(TL_mask);
        },
        popupMy:function (setting) {    //弹出自定义窗口

            this.addMask();
            body.append($(TL_popWinCenter).css(setting));
            $('.common-modal').on('click','.close,.cancel',function () {
                $('#mask').remove();
                $('.common-modal').remove();
            });
        },
        popupTip : function(setting,msg){
            if(!setting){
                setting = {width: 400,margin: 'auto',height: 220,left: '35%',top: '30%'};
            }
            this.addMask();
            body.append($(TL_popupTip).css(setting));
            $('#ModalTipMsg').html(msg ? msg : '操作成功');
            $('.common-modal').on('click','.close,.cancel',function () {
                $('#mask').remove();
                $('.common-modal').remove();
            });
        }
    };
});
