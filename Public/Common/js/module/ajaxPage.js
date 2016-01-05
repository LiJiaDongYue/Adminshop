/**
 * Created by Administrator on 2015/6/11.
 */

define(['./ajax', './dialog', './check', 'jForm', 'urlQuery', 'qtip'], function (ajax, dialog, check) {
    return {
        /**
         * 删除提示
         * @param url
         * @param delMsg
         */
        confirmTip : function(url, delMsg, bindElement){
            var element = bindElement || 'delTip';
            $('.panel-body').on('click', '.'+ element, function (e) {
                var tipMsg = delMsg || '您确定删除吗？';
                var btn = $(this);
                btn.qtip({
                    hide: {
                        event: 'unfocus'
                    },
                    style: {
                        width: 130
                    },
                    content: {
                        text: '<p class="font-m">'+tipMsg+'</p>' + "<div class='text-right'><a class='btn btn-danger btn-xs font-s' id='confirm'>确定</a>" +
                        "<a class='btn btn-default btn-xs ml-10 font-s' id='close'>关闭</a></div>  ",
                        title: {
                            text: "提示"
                        }
                    },
                    model: true,
                    events: {
                        render: function (event, api) {
                            $('#close', api.elements.content).click(function (e) {
                                api.hide(e);
                            });
                            $('#confirm', api.elements.content).click(function (e) {
                                api.hide(e);
                                var params = '{' + btn.attr('data-val') + '}';
                                try{
                                    params = $.parseJSON(params);
                                    if(params){
                                        ajax.todo('GET', url, params, function (resp) {
                                            if (resp && resp.status === 1) {
                                                var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                                                window.location.href = p1;
                                            } else {//错误提示
                                                dialog.popupTip('', resp.info);
                                            }
                                        });
                                    }
                                } catch(e){
                                    dialog.popupTip('', '参数有误');
                                }
                            });
                        }
                    },
                    position: {
                        at: 'top left',
                        my: 'bottom right'
                    },
                    show: {
                        ready: true,
                        event: 'click'
                    }
                });
            });
        },
        submitModal : function(modalId, modalForm, modalBtn){
            modalId   = modalId ? '#' + modalId : '.modal';
            modalForm = modalForm || 'modalForm';
            modalBtn  = modalBtn || 'modalBtn';

            $('.panel-body ').on('click', modalId + ' #' + modalBtn, function (e) {
                $('#' + modalForm).ajaxSubmit({
                    success : function(resp){//请求成功后返回的数据,类是 Object { status=0, info="对不起，服务器忙请稍候重试"}
                        if(resp && resp.status == 1){
                            var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                            window.location.href = p1;
                        } else {
                            dialog.popupTip('', resp.info);
                        }
                    }
                });
            });
        },
        //分页列表
        pageClick: function (bindClass) {
            bindClass = bindClass ? bindClass : 'pagination-nav';
            $('.panel-body').on('click', '.' + bindClass + ' .num', function (e) {
                //阻止默认事件，  就是#锚点跳走
                e.preventDefault();
                var p = $(this).attr('data-val');
                var p1 = $.query.load(window.location.hash).set('p', p).toString();
                window.location.href = p1;
            });
        },
        /**
         * 分页列表,只刷新table
         * @param url 加载表格数据url
         * @param formID 搜索form的id
         * @param tableID 加载表格数据div的id
         */
        pageTable: function (url, formID, tableID, callFn) {
            var _this = this;
            $('.panel-body').on('click', '.pagination-nav .num', function (e) {
                //阻止默认事件，  就是#锚点跳走
                e.preventDefault();
                //页码
                var p = $(this).attr('data-val');

                //表单参数
                var queryParams = formID ? '&' + $('#'+formID).formSerialize() : '';
                var bindParams = $.query.load(window.location.hash + queryParams).set('p', p).toString();
                bindParams = bindParams.substring(bindParams.indexOf('&'))
                _this.loadPage(tableID, url + '?' +bindParams, callFn)
            });
        },
        /**
         * 路由时动态加载对应页面
         * @param id 需要加载列表html页面div的ID；
         * @param 加载页面的路径；
         * @param 回调函数
         * @returns {urlQuery}
         */
        loadPage: function (id, url, callback) {
            $.ajax({
                cache: false,
                type: "GET",
                url: url,
                dataType: "html"
            }).done(function (html) {
                $('#' + id).html(html);
                if (typeof callback === 'function') {
                    return callback && callback(html);
                }
            });
            return this;
        },
        /**
         * 列表搜索
         * @param tableID 需要加载列表html页面div的ID；
         * @param url 请求的url路径
         * @param searchFormID 查询表单的id，默认是search-form
         * @param searchBtnID 查询按钮的id，默认是search-btn
         */
        search: function (tableID, url, searchFormID, searchBtnID) {
            var _this = this;
            $('.panel-body').on('click', searchBtnID ? searchBtnID : '#search-btn', function (e){
                //阻止默认事件，  就是#锚点跳走
                e.preventDefault();
                var queryParams = $(searchFormID ? searchFormID : '#search-form').formSerialize();

                //方式一：只加载列表
                /*var path = $.query.load(window.location.hash + '&' + queryParams).set('p',1).toString();
                if(path.indexOf("/&") > 0) {
                    var param = path.split("/&")[1];
                    param = encodeURI(param,'UTF-8');
                    _this.loadPage(tableID, url + '?' + param);
                }*/

               // username=123&email
              /*
                除去参数值为空的参数
                var params = queryParams.split('&');
                var map = new Array();
                for(var i = 0; i < params.length; i++){
                    var param = params[i].split('=');
                    var key = param[0];
                    var value = param[1];
                    if(value && $.trim(value) != ''){
                        map.push(key + '=' + value);
                    }
                }
                var queryStr = '';
                if(map.length == 0){
                    //return false;
                } else if(map.length > 0){
                    queryStr = '&' + map.join('&');
                }*/
                //方式二：地址栏重新加载
                var p1 = $.query.load(window.location.hash + '&' + encodeURI(queryParams)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        /**
         * 关键词独立搜索
         * @param searchFormID 查询表单的id，默认是search-form
         * @param searchBtnID 查询按钮的id，默认是search-btn
         */
        searchKey: function (searchFormID, searchBtnID) {
            var _this = this;
            $('.panel-body').on('click', searchBtnID ? searchBtnID : '#search-btn', function (e){
                //阻止默认事件，  就是#锚点跳走
                e.preventDefault();
                var queryParams = $(searchFormID ? searchFormID : '#search-form').formSerialize();
                var map = window.location.hash.split('&');
                var p1 = $.query.load(map[0] + '&' + encodeURI(queryParams)).set('p',1).toString();
                window.location.href = p1;
            });
        },
        //启用，停用
        isActive : function(url, classes){
            $('.panel-body').on('click',classes ? classes : 'a.is-active',function(){
                var id = $(this).attr('data-id');
                var val = $(this).attr('data-val');
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: url + '?id=' + id + '&flag=' + val,
                    dataType: "json",
                    success : function(resp){
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
        /**
         * 确认删除
         * @param url 删除的请求url
         * @param tipMsg 删除提示
         */
        delConf: function (url, modalTitle, modalMsg) {
            $('.panel-body').on('click', '.del,.del-all', function (e) {
                var tipTitle = modalTitle ? modalTitle : '提示';
                var tipMsg = modalMsg ? modalMsg : '您确定要删除吗？';

                ////停止事件的传播，阻止被分配到其他document节点
                //e.stopPropagation();
                ////阻止默认事件
                //e.preventDefault();
                var setting = {
                    width: 400,
                    margin: 'auto',
                    height: 220,
                    left: '35%',
                    top: '30%'
                };
                dialog.popupMy(setting);
                var modalBody = $('#modal-body'), modalTitle = $('#modal-title');
                var targetClass = $(this).attr('class');

                /* 确定按钮样式 */
                var confirmBtnClass = 'confirmOK';
                /* 提示框标题 */
                modalTitle.text(tipTitle);
                /* 获取参数 */
                var params = {};
                if (targetClass.indexOf('all') > 0) {//删除全部
                    var ids = check.getCheckedVal();
                    if (!ids) {
                        confirmBtnClass = 'cancel';
                        tipMsg = '请勾选需要操作的数据！';
                    } else {
                        params = {ids: ids}
                    }
                } else {
                    params = {id: $(this).attr('data-val')}
                }
                /* 弹出提示框赋值 */
                modalBody.html('</br><p>&nbsp;&nbsp;&nbsp;&nbsp;' + tipMsg + '</p></br>' +
                '<div class="modal-footer"><button class="btn btn-danger ' + confirmBtnClass + '" type="button">\u786E\u5B9A</button>' +
                '<button class="btn btn-default cancel" data-dismiss="modal" type="button">\u53D6\u6D88</button></div>');
                /* 确定按钮 */
                modalBody.find('button.confirmOK').on('click', function () {
                    $('#mask').remove();
                    $('.common-modal').remove();
                    ajax.todo('GET', url, params, function (resp) {
                        if (resp.status && resp.status === 1) {
                            var p1 = $.query.load(window.location.hash).set('_', Math.random()).toString();
                            window.location.href = p1;
                        } else {//错误提示
                            dialog.popupMy(setting);
                            var modalBody = $('#modal-body'), modalTitle = $('#modal-title');

                            modalTitle.text('错误提示');
                            modalBody.html('</br><p>&nbsp;&nbsp;&nbsp;&nbsp;' + resp.info + '</p></br>' +
                            '<div class="modal-footer"><button class="btn btn-danger cancel" type="button">\u786E\u5B9A</button>' +
                            '<button class="btn btn-default cancel" data-dismiss="modal" type="button">\u53D6\u6D88</button></div>');
                        }
                    });
                });
            });
        }
    }
});