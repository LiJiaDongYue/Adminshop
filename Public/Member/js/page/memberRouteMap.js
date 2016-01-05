/**
 * Created by donkey on 2015/3/12.
 */

var rootScope = {};         //全局作用域(为了防止污染全局命名空间,需要放入全局下的函数或对象,都放在此命名空间下)
rootScope.pathState = '';   // 存储当前根路径值,如果发生变化才对整个内容区域进行全部加载反之只进行局部加载
//rootScope.jsState = [];     //存储已经载入过的js,此参数提供给"loadJS"函数调用



!function(){

    /**************************************
     * 需要载入的js或css 数组第一位为版本号 , 第二位为载入地址
     ************************************/
    //css
    //var CSS = ['', '/Public/Admin/theme/green/css/index.css'];
    //js
    var JS = ['1', '/Public/Member/js/lib/memberBase.js'];




    /**************************************
    * Promise 工具函数
    ************************************/
    var Promise = function(affair){
        this.state = 'pending';
        this.affair = affair || function(obj) { return obj; };
        this.allAffairs = [];
    };
    Promise.prototype = {
        resolve: function(obj){
            if (this.state != 'pending') throw '已完成，不能再次resolve';
            this.state = 'resloved';
            this.result = this.affair(obj); // 执行ok

            for (var i=0, len=this.allAffairs.length; i<len; ++i){
                // 依次调用该任务的后续任务
                var affair = this.allAffairs[i];
                this._fire(affair.promise, affair.affair);
            }
            return this;
        },
        _fire: function(nextPromise, nextAffair){
            var nextResult = nextAffair(this.result); // 调用nextAffair

            if (nextResult instanceof Promise){
                // 异步的情况，返回值是一个Promise，则当其resolve的时候，nextPromise才会被resolve
                nextResult.then(function(obj){
                    nextPromise.resolve(obj);
                });
            }else{
                // 同步的情况，返回值是普通结果，立即将nextPromise给resolve掉
                nextPromise.resolve(nextResult);
            }
            return nextPromise;
        },
        _push: function(nextPromise, nextAffair){
            this.allAffairs.push({
                promise: nextPromise,
                affair: nextAffair
            });
            return nextPromise;
        },
        then: function(nextAffair){
            var promise = new Promise();
            if (this.state == 'resloved'){
                // 如果当前状态是已完成，则nextAffair会被立即调用
                return this._fire(promise, nextAffair);
            }else{
                // 否则将会被加入队列中
                return this._push(promise, nextAffair);
            }
        }
    };

    /**************************************
     * XHR原始封装 用于加载js或css
     ************************************/
    function ajax(URL){
        var url, xhr, results, promise;
        url = '' + URL;
        promise = new Promise();

        if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        }
        else{// code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function(e){
            if(this.readyState === 4 && this.status === 200){
                results = this.responseText;
                promise.resolve(results);
            }
        };
        xhr.send();
        return promise;
    }

    /**************************************
     * 在页头页尾插入js或css工具函数
     ************************************/
    function insertCss(data){
        var style = document.createElement("style");
        var css = data;
        var cssText = document.createTextNode(data);
        document.getElementsByTagName("head")[0].appendChild(style);
        try{
            style.appendChild(cssText);
        }catch(e){
            style.styleSheet.cssText = css;
            //alert(style.styleSheet.cssText);
        }
    }

    function insertJs(data){
        var script = document.createElement('script');
        var code = data;
        //var code = eval(data);
        script.text = code;
        document.getElementsByTagName("body")[0].appendChild(script);
    }

    /**************************************
     * load工具函数 如果localStorage存在值就直接载入,如果没有就下载后载入
     ************************************/
    function load(){

        var _ver = arguments[0][0];
        var _file = arguments[0][1];
        var _lastVer = localStorage.getItem(_file + '?ver');
        var promise2 = new Promise();
        
        if(_ver !== _lastVer){
            ajax(_file).then(function(data){
                try{
                    if(/\.js$/i.test(_file)){
                        insertJs(data);
                    }else{
                        insertCss(data);
                    }
                    localStorage.setItem(_file, data);
                    localStorage.setItem(_file + "?ver", _ver);
                    promise2.resolve();

                }
                catch(e){
                    localStorage.removeItem(_file);
                    localStorage.removeItem(_file + "?ver");
                }
            });
        }else{
            if(/\.js$/i.test(_file)){
                insertJs(localStorage.getItem(_file));
            }else{
                insertCss(localStorage.getItem(_file));

            }
            promise2.resolve();
        }
        return promise2;
    }
    //如果是IE9以下的浏览器 将不对css缓存处理
   /* if(!(! +"\v1" || document.createDocumentFragment().createElement)){
        load(CSS);
    }*/
    //装载js文件并缓存处理
    load(JS).then(function(){

        /********************************
         动态加载页面
         函数:  rootScope.loadPage( ['pageMian','pageLeft','pageRight'], callbackFn );
         参数说明 :
         ['pageMian','pageLeft','pageRight'] : 需要加载的页面,当只需要加载左
         右两边页面时(加载默认外框,默认外框地址是admin/tpl/common/mainContent.html),
         数组内只需要写入左右两边页面的文件路径,对应位置为['lefe','right'] .
         如果只需要加载一个页面只需要把另侧空出来即可例如:['','right']
         当需要加载自定义主外框时,数组[0]位置为主外框文件路径,后面依次为左和右
         示例: ['pageMian','pageLeft','pageRight']

         callbackFn  : 左右页面加载完成后执行的回调函数
         示例 :
         //加载默认外框
         rootScope.ajaxPage.loadPage(
         ['usermg/left.html', 'usermg/right.html'],
         function (){
        console.log('执行回调');
     }
         );
         //加载自定义外框
         rootScope.ajaxPage.loadPage(
         [['page/usermg/mainContent.html'],'page/usermg/left.html', 'page/usermg/right.html'],
         function (){
        console.log('执行回调');
     }
         );

         **************************/
        rootScope = (function(scope, $, undefined){

            var content = "main-content";   //主内容区域
            var left = "main-content-left"; //需要载入到主内容区域内部的左侧内容
            var right = "main-content-right"; //需要载入到主内容区域内部的右侧内容
            var mainUl = $('#main-ul');  //主导航菜单

            //ajax加载页面
            function ajax(id, url, callback){
                $('#loading').show();
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: url,
                    dataType: "html"
                }).done(function(html){
                    $('#' + id).html(html);
                    return callback && callback(html);
                });
            }

            //当载入页面或窗口改变时自动计算高度,让页脚保持在窗口底部
            function setHeight(){
                var WH = $(window).height();
                $('.min-height').css('min-height', WH - 135);
                $(window).resize(function(){
                    var WH = $(window).height();
                    $('.min-height').css('min-height', WH - 135);
                });
            }

            scope.loadPage = function(arrPage, callback){
                var locationURL = $.sammy().getLocation();
                var loadParam = '';
                if(locationURL.indexOf('load') > 0){
                    loadParam = '?' + locationURL.match(/load=\w*/).toString();//是否加载单页
                }
                var _path = locationURL.match(/\#\/[^\/]*/).toString(); //获取根路径值
                //高亮当前主导航标标签
                mainUl.find('.active').removeClass('active');
                mainUl.find('a[href*="' + _path + '"]').parent().addClass('active');

                var _length = arrPage.length;

                //载入页面
                if(rootScope.pathState === _path){     //如果不是首次载入就不需要加载左侧内容
                    ajax(right, arrPage[1], function(){
                        if(callback !== undefined){
                            $(function(){
                                $('#loading').slideUp();
                            });
                            return callback && callback();
                        }
                    });
                }else{
                    if(!(arrPage[0] instanceof Array)){
                        ajax(content, '../Public/main' + loadParam, function(){
                            setHeight();
                            for(var i = 0, len = _length; i < len; i++){
                                !function(i){
                                    if(arrPage[i] !== '' && arrPage[i] !== undefined){

                                        ajax((i < _length - 1 ? left : right), arrPage[i], function(){
                                            if(i === _length - 1){
                                                $('#loading').slideUp();
                                            }
                                            if(typeof callback === 'function' && i === _length - 1){
                                                return callback && callback();
                                            }
                                        });
                                    }

                                }(i);
                            }
                        });
                    }else{
                        ajax(content, arrPage[0][0], function(){
                            setHeight();
                            for(var i = 1, len = _length; i < len; i++){
                                !function(i){
                                    if(arrPage[i] !== '' && arrPage[i] !== undefined){
                                        ajax((i <= _length - 1 ? right : left), arrPage[i], function(){
                                            //alert(i + ' ' +_length);
                                            if(i === _length - 1){
                                                $('#loading').slideUp();
                                            }
                                            if(typeof callback === 'function' && i === _length - 1){
                                                $('#loading').slideUp();
                                                return callback && callback();
                                            }
                                        });
                                    }
                                }(i);
                            }
                        });
                    }
                }
                //高亮左边菜单
                var _MenuPath = locationURL.match(/\#\/[\/(\w+)]*/).toString(); //菜单根路径
                var leftMenu = $('#' + left);
                if(leftMenu.find('a[href*="' + _MenuPath + '"]').length > 0){
                    leftMenu.find('.list-group-item-success').removeClass('list-group-item-success');
                    leftMenu.find('a[href*="' + _MenuPath + '"]').addClass('list-group-item-success');
                }
                rootScope.pathState = _path;
            };
            return scope;
        })(rootScope || {}, jQuery);
        /********************************
         开始路由
         ********************************/
        Sammy(function(){
            var loadPage = rootScope.loadPage;

            //=======自定义事件========
            this.helpers({
                getParm: function(parm){    //获取url参数值
                    return $.query.get(parm);
                },
                setParm: function(key, val){  //设置url参数值
                    return $.query.set(key, val);
                }
            });
            //===============

            //404
            this.notFound = function(){
                loadPage(
                    ['../Public/error404_main','../Public/error404'], function(){}
                );
            };

            //后台管理路由
            this.mapRoutes([

                /*************************** Member路由开始 ************************************/
                /* Member首页路由开始 ************************************************/

                ['get', '#/home/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    param = param.replace(/load=\w*/,'');
                    loadPage(['../Index/home'], function(){
                        require(['ajaxPage'], function(ajaxPage){
                            ajaxPage.loadPage('viewOrder-table', '../Index/table?' + param, function (){});
                            ajaxPage.pageTable('../Index/table?' + param, '', 'viewOrder-table', function(){});
                         });
                    });
                }],
                /* Member首页路由结束 ***********************************************/
                /** 采购(purchase)计划路由start */
                ['get', '#/purchase', function(){//默认显示
                    this.redirect("#", "purchase/purchasePlan/add/&j=add");
                }],
                //选择采购计划来源
                ['get', '#/purchase/purchasePlan/add/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/right?' + param], function(){
                        require(['page/purchase/purchase'], function(purchase){
                            purchase.selSource();
                        });
                    });
                }],
                //新增采购计划
                ['get', '#/purchase/purchasePlan/fill/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    var pt = param.match(/\w\d{4}/);
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/chose?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','page/purchase/purchase', 'page/product'],function(ajaxPage, sel, purchase, product){
                            //绑定选择来源事件
                            sel.bsSelect();
                            if(pt == 'D1201'){
                                purchase.purchaseSearch();
                                var loadPage = "purchase-plan-table",
                                    addTable="purchase-add-table",searchTable = "purchase-plan-search";
                            } else if(pt == 'D1202'){
                                var loadPage = "long-plan-table",
                                    addTable="long-add-table",searchTable = "";
                                //purchase.purchaseSearch(loadPage); 长期计划查询
                                purchase.addLongPlan();
                            } else if(pt == 'D1203'){
                                var loadPage = "collection-order-table",
                                    addTable="collection-add-table",searchTable = "";
                            }
                            ajaxPage.loadPage(loadPage, '../PurchasePlan/table?' + param, function(){
                                if(pt == 'D1201' || pt == 'D1203') {
                                    ajaxPage.loadPage(addTable, '../PurchasePlan/loadAddedTable?' + param, function () {
                                        purchase.countNum();//绑定数量
                                        purchase.plusOrMinusNum();//数量添加
                                        purchase.printSubmit();//提交审核
                                        purchase.delFromPlan();//删除已添加的产品
                                    });
                                }
                                if(pt == 'D1201'){
                                    purchase.addToPlan();//添加
                                } else if(pt == 'D1202'){
                                    purchase.showComment();//绑定备注显示
                                    purchase.editLongPlan();
                                    purchase.checkLongCheck();
                                    purchase.clickNextStep(pt);
                                    product.addProducts('../PurchasePlan/addProducts','../PurchasePlan/table?' + param,'long-plan-table');
                                    product.loadProducts();
                                    product.searchProducts();
                                }else if(pt == 'D1203'){
                                    purchase.rebuy();//再次购买
                                }
                            });
                            ajaxPage.pageTable('../PurchasePlan/table?', searchTable ,loadPage);
                        });
                    });
                }],
                ['get', '#/purchase/purchasePlan/confirm/&:param', function() {
                    var param = encodeURI(this.params.param, 'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/confirm?' + param], function(){
                        require(['ajaxPage','page/purchase/purchase'],function(ajaxPage, purchase){
                            ajaxPage.loadPage('confirm-table', '../PurchasePlan/loadAddedTable?' + param, function () {
                                purchase.countNum();//绑定数量
                                purchase.plusOrMinusNum();//数量添加
                                purchase.printSubmit();//提交审核
                                purchase.delFromPlan();//删除已添加的产品
                            });
                        });
                    });
                }],

                //计划单管理
                ['get', '#/purchase/purchasePlan/lists/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/right_2?'+ param], function(){
                        require(['ajaxPage','page/purchase/plan'], function(ajaxPage,plan){
                            //分页列表
                            ajaxPage.pageClick();
                            //加载页面
                            ajaxPage.loadPage('rulePlan-table','../PurchasePlan/table_2?'+param,function(){
                                plan.bindPlan();
                                plan.showComment();
                            });
                            //删除确认
                            ajaxPage.delConf('../PurchasePlan/delete');
                            //查询
                            ajaxPage.search('rulePlan-table','../PurchasePlan/table_2?' + param);

                        });
                    });
                }],
                ['get', '#/purchase/purchasePlan/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/right_detail?' + param], function(){
                        require(['ajaxPage','page/purchase/plan','page/purchase/spinner','page/product'],function(ajaxPage,plan, spinner,product){
                            //分页列表
                            ajaxPage.pageClick();
                            //加载页面
                            ajaxPage.loadPage('rulePlanDetail-table','../PurchasePlan/detail?'+param,function(){
                                spinner.piusOrMinus();
                                plan.plusOrMinusNumForPlan();//数量添加
                                product.addProducts('../PurchasePlan/addProducts','../PurchasePlan/detail?' + param,'rulePlanDetail-table');
                                product.loadProducts();
                                product.searchProducts();

                            });
                            //删除确认
                            ajaxPage.delConf('../PurchasePlan/delete');
                        });
                    });
                }],
                ['get', '#/purchase/purchasePlan/addPlanDetail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/addPlanDetail?' + param], function(){
                        require(['ajaxPage','page/purchase/plan','page/purchase/spinner'],function(ajaxPage,plan,spinner){
                            //分页列表
                            ajaxPage.pageClick();
                            //加载页面
                            ajaxPage.loadPage('add-detail-table','../PurchasePlan/tableMakerProduct?'+param,function(){
                                spinner.piusOrMinus();
                                plan.plusOrMinusNumForPlan();//数量添加
                            });
                            //删除确认
                            ajaxPage.delConf('../PurchasePlan/delete');
                            //查询
                            ajaxPage.search('add-detail-table','../PurchasePlan/tableMakerProduct?'+ param);

                        });
                    });
                }],
                //计划单审核
                ['get', '#/purchase/purchasePlan/yz/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../PurchasePlan/left', '../PurchasePlan/yz'], function(){
                        require(['ajaxPage','check','module/buttonDisabled','page/order/pay'], function(ajaxPage,check,buttonDisabled,collapse){
                            //分页列表
                            ajaxPage.pageClick();
                            //选中事件
                            check.inputCheck();
                            //审核确认
                            ajaxPage.delConf('../PurchasePlan/check','提示','您确定要审核吗？');
                            //加载页面
                            ajaxPage.loadPage('plan-yz-table','../PurchasePlan/yzTable?' + param, function(){
                                //允许提交事件
                                buttonDisabled.buttonDisabled();
                                //点击切换箭头
                                collapse.bindCollapse();
                            });
                        });
                    });
                }],
                /** 采购(purchase)计划路由end */


                /** 订单管理(order)计划路由start */
                ['get', '#/order', function(){//默认显示
                    this.redirect("#", "order/lists/&p=1");
                }],
                ['get', '#/order/lists/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../Order/left', '../Order/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','page/order/order'], function(ajaxPage,bsselect,order){
                            //分页列表
                            ajaxPage.pageClick();
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('search-form');
                            //绑定时间筛选
                            order.change();
                            //取消订单确认
                            ajaxPage.delConf('../Order/del','提示','您确定要取消订单吗？');
                            //加载页面
                            ajaxPage.loadPage('order-table','../Order/table?' + param,function(){
                                //加载下拉框
                                bsselect.bsSelect();
                                //点击切换箭头
                                order.bindCollapse();
                                //收藏订单
                                order.bindCollection();
                                //
                                ajaxPage.submitModal();
                            });
                        });
                    });
                }],
                ['get', '#/order/lists/deliver_1/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Order/left', '../Order/deliverRequests_1?' + param], function(){
                        require(['getLocation', 'page/setting/receive_address','page/order/deliverRequests','module/buttonDisabled'],function(getlocation, address, deliverRequests,buttonDisabled){
                            getlocation.location(300);
                            address.validForm(1);
                            address.checkMessage();
                            deliverRequests.cancel();
                            deliverRequests.nextStep(param);
                            //允许提交事件
                            buttonDisabled.buttonDisabled(".next-step");
                        });
                    });
                }],
                ['get', '#/order/lists/deliver_2/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Order/left', '../Order/deliverRequests_2?' + param], function(){
                        require(['page/order/deliverRequests'],function(deliverRequests){
                            deliverRequests.nextStep(param);
                        });
                    });
                }],
                ['get', '#/order/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Order/left', '../Order/orderDetail?' + param], function(){
                        require([],function(){});
                    });
                }],
                /** 订单管理(order)计划路由end */

                /**付款订单管理(orderPay)计划路由start */
                ['get', '#/payOrder', function(){//默认显示
                    this.redirect("#", "payOrder/lists/&p=1");
                }],
                ['get', '#/payOrder/lists/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../PayOrder/left', '../PayOrder/payRight?' + param], function(){
                        require(['ajaxPage','module/buttonDisabled', 'page/order/pay'], function(ajaxPage,buttonDisabled, pay){
                            //加载页面
                            ajaxPage.loadPage('purchase_pay-table','../PayOrder/payTable?' + param, function(){
                                //允许提交事件
                                //buttonDisabled.buttonDisabled();
                                pay.bindCollapse();
                                pay.bindPayNext();//付款，临时用
                            });
                            //分页列表
                            //ajaxPage.pageClick();
                            ajaxPage.pageTable('../PayOrder/payTable', '','purchase_pay-table',function(){});
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('search-form','../PayOrder/payTable?' + param);


                        });
                    });
                }],
                ['get', '#/payOrder/detail/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../PayOrder/left', '../Order/orderDetail?' + param],function(){

                    });
                }],
                /**付款订单管理(orderPay)计划路由end */

                /** 常用设置(setting)计划路由start */
                ['get', '#/setting', function(){//默认显示
                    this.redirect("#", "setting/invoice/&p=1");
                }],
                ['get', '#/setting/invoice/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Invoice/left', '../Invoice/right?'+param], function(){
                        require(['ajaxPage','page/setting/invoice'], function(ajaxPage,invoice){
                            //分页列表
                            ajaxPage.pageClick();
                            ///加载页面
                            ajaxPage.loadPage('invoice-table','../Invoice/table?');

                            //删除确认
                            ajaxPage.delConf('../Invoice/delete');

                            invoice.validInvocieForm();
                        });
                    });
                }],
                ['get', '#/setting/receiveAddress/&:p', function(){
                    loadPage(['../ReceiveAddress/left', '../ReceiveAddress/right'], function(){
                            require(['ajaxPage', 'page/setting/receive_address'], function (ajaxPage,address) {

                                //删除确认
                                ajaxPage.delConf('../ReceiveAddress/del');
                                ajaxPage.loadPage('address-table', '../ReceiveAddress/table');
                                //分页列表
                                ajaxPage.pageTable('../ReceiveAddress/table', '','address-table',function(){});
                                address.setDefaul();
                            });
                    });
                }],
                ['get', '#/setting/receiveAddressAdd/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ReceiveAddress/left', '../ReceiveAddress/add?'+ param],function(){
                        require(['getLocation', 'page/setting/receive_address'],function(getlocation, address){
                            getlocation.location();
                            address.validForm();
                            address.checkMessage();
                        });
                    });
                }],
                /** 常用设置(setting)计划路由end */


                /** 系统(sys)路由start */
                ['get', '#/sys', function(){//默认显示
                    this.redirect("#", "sys/station/&p=1");
                }],
                //岗位权限
                ['get', '#/sys/station/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../Station/left', '../Station/right?' + param], function(){
                        require(['ajaxPage'], function(ajaxPage){
                            //加载页面
                            ajaxPage.loadPage('member-station-table','../Station/table?' + param);
                            //分页列表
                            ajaxPage.pageClick();
                            //查询
                            ajaxPage.search('search-form','../Station/table?' + param);
                            //启用停用
                            ajaxPage.isActive("../Station/active");
                            //重置密码
                            ajaxPage.confirmTip('../Station/resetPwd', '您确定要将密码重置为 "123456" 吗?','reset');
                            ajaxPage.submitModal();
                        });
                    });
                }],

                //企业信息维护
                ['get','#/sys/companyInfo/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../CompanyInfo/left','../CompanyInfo/right?'+param],function(){
                        var choose = param.substr(0,3);
                        switch (choose){
                            case 'p=1':
                                //'公司资料'
                                require(['ajaxPage','getLocation','page/sys/CompanyInfo'],function(ajaxPage,getlocation,CompanyInfo){
                                    ajaxPage.loadPage('companyInfo-table','../CompanyInfo/companyInfo?' + param,function(){
                                        getlocation.location();
                                        CompanyInfo.infoValidForm();
                                    });
                                });
                                break;
                            case 'p=2':
                                //'联系方式';
                                require(['ajaxPage','page/sys/CompanyInfo'],function(ajaxPage,CompanyInfo){
                                    ajaxPage.loadPage('companyInfo-table','../CompanyInfo/companyContact?' + param,function(){
                                        CompanyInfo.contactValidForm();
                                    });
                                });
                                break;
                            case 'p=3':
                                //'公司介绍';
                                require(['ajaxPage','dateRange','page/sys/companyInfo'],function(ajaxPage,date,companyInfo){
                                    ajaxPage.loadPage('companyInfo-table','../CompanyInfo/companyShortInfo?' + param,function(){
                                        companyInfo.initEditor();
                                        companyInfo.shortInfoValidForm();
                                        //日期控件
                                        date.dateRange();
                                    });
                                });
                                break;
                            case  'p=4':
                                //图集管理
                                require(['ajaxPage','page/sys/companyPic'],function(ajaxPage,companyPic){
                                    ajaxPage.loadPage('companyInfo-table','../CompanyInfo/companyPic?' + param,function(){
                                        companyPic.delPicSort();
                                        companyPic.goPic();
                                        companyPic.submitModal();
                                        //加载下拉框
                                        //bsselect.bsSelect();'page/bootstrap-select'
                                    });
                                });
                                break;
                            case 'p=5':
                                //具体图片
                                require(['ajaxPage','page/sys/companyPic'],function(ajaxPage,companyPic){
                                    ajaxPage.loadPage('companyInfo-table','../CompanyInfo/companyDetailPic?' + param,function(){
                                        companyPic.dropPicUpload();
                                        companyPic.delImg('../CompanyInfo/delImg');
                                        companyPic.delPicSort();
                                        companyPic.setFacePic();
                                    });
                                });
                                break;
                        }
                    });
                }],

                //修改密码
                ['get', '#/sys/modifyPwd', function(){
                    loadPage(['../ModifyPwd/left', '../ModifyPwd/right'], function(){
                        require([''], function(){
                        });
                    });
                }]
                /** 系统(sys)路由start */
                /*************************** Member路由结束 ************************************/
            ])
        }).run('#/home/&load=one');

        /****************************
         加载bootstrap
         ****************************/
        require(['bootstrap']);

        /****************************
         页头页尾交互控制器
         ****************************/
        //页头消息长链接控制
        //require(['/Public/Admin/js/page/topMessage.js']);


        /****************************
         403后提示用户登录
         ****************************/
       /* $.ajaxSetup({
            statusCode: {
                403: function(){
                    require(['module/login'], function(login){
                        var setting = [{
                            width: 300,
                            margin: '-230px 0 0 -175px',
                            'min-height': 350,
                            left: '50%',
                            top: '50%'
                        },
                            'hideBtn'
                        ];
                        //dialog.popupMy(setting);
                        login.directShowLogin(setting);
                    });
                }
            }
        });*/
//----------------------------------------------------------------
    });
}();


