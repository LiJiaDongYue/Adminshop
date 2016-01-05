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
    var JS = ['1', '/Public/Admin/js/lib/base.js'];




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

                /* admin首页路由开始 ************************************************/
                ['get', '#/home', function(){
                    loadPage(['../Index/indexLeft', '../Index/indexRight'], function(){
                        /*require(['page/home'], function(home){

                        });*/
                    });
                }],
                /* admin首页路由结束 ***********************************************/


                /* 平台（platform）管理路由start ************************************************/
                ['get', '#/platform', function(){//默认显示
                    this.redirect("#", "platform/productSort/&p=1");
                }],
                //产品分类（productSort）管理
                ['get', '#/platform/productSort/&:p', function(e){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    var page = param.match(/p=\d/);
                    loadPage(['../ProductSort/left', '../ProductSort/right?' + param], function(){
                        require(['ajaxPage','page/platform/product','page/platform/sort'], function(ajaxPage,product,sort){
                            sort.initTree();
                            sort.onclickProductList();
                            //状态改变
                            product.productSortIsActive();
                            //删除确认
                            ajaxPage.delConf('../ProductSort/delProductSort');
                            //查询
                            ajaxPage.search('product-table','../ProductSort/table');
                            //选中事件
                            ajaxPage.loadPage('product-table','../ProductSort/table?' + param, function(){
                                //分页列表
                                ajaxPage.pageClick();
                                product.productSort();
                            });

                        });
                    });
                }],
                ['get', '#/platform/productSort/link/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    var page = param.match(/p=\d/);
                    loadPage(['../ProductSort/left', '../ProductSort/right?' + param], function(){
                        require(['ajaxPage','page/platform/product','page/platform/sort'], function(ajaxPage,product,sort){
                            sort.initTree();
                            sort.onclickProductList();
                            //分页列表
                            ajaxPage.pageClick();
                            //选中事件
                            ajaxPage.loadPage('product-table','../ProductSort/link_table?' + param, function(){
                                product.productSort();
                            });

                        });
                    });
                }],
                ['get', '#/platform/productSort/add/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductSort/left', '../ProductSort/add?' + param], function(){
                        require(['page/platform/product','page/bootstrap-select'],function(product,bsselect){
                            product.validForm();
                            //加载下拉框
                            bsselect.bsSelect();
                        });
                    });
                }],
                //产品分类属性（attribute）管理路由start
                ['get', '#/platform/productSort/attribute/&:sortid', function(){
                    var param = encodeURI(this.params['sortid'],'UTF-8');
                    loadPage(['../ProductSort/left', '../ProductSort/attribute?' + param], function(){
                        require(['ajaxPage', 'page/platform/attr','page/platform/attrList','check'], function (ajaxPage, attr, attrList, check) {
                            attr.validForm();
                            check.inputCheck();
                            attr.inputTags();
                            //绑定是否启用事件
                            attrList.isActive();
                            ajaxPage.loadPage('attribute-table','../ProductSort/lists?' + param,function(){
                                attr.inputTags();
                                attrList.buttonDisabled();
                                attrList.validForm()
                            });
                        });
                    });
                }],
                // 生产厂商管理 (produceMaker)设置路由
                ['get', '#/platform/produceMaker/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProduceMaker/left', '../ProduceMaker/right?' + param], function () {
                            require(['ajaxPage', 'page/platform/produceMaker'], function(ajaxPage, maker){
                                ajaxPage.loadPage('maker-table','../ProduceMaker/table?' + param);
                                //分页列表
                                ajaxPage.pageClick();
                                //删除确认
                                ajaxPage.delConf('../ProduceMaker/delete');
                                //查询
                                ajaxPage.search('maker-table','../ProduceMaker/table?' + param);
                                ajaxPage.isActive("../ProduceMaker/active");
                            });
                        }
                    );

                }],
                ['get', '#/platform/produceMaker/addEdit/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProduceMaker/left', '../ProduceMaker/addEdit?' + param], function(){
                        require(['getLocation', 'page/platform/produceMaker'],function(getLocation, maker){
                            getLocation.location();
                            maker.validForm();
                        });
                    });
                }],
                //产品维护
                ['get', '#/platform/makerProducts/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../MakerProducts/left', '../MakerProducts/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','page/platform/makerProducts'],function(ajax, select, product){
                            ajax.loadPage('maker-products-table','../MakerProducts/table?' + param);
                            ajax.pageClick();
                            select.bsSelect();
                            //添加一行
                            product.addRow();
                            //保存
                            product.saveAll();
                            //绑定查询时间
                            product.bindSel();
                            //添加产品信息
                            product.addProductInfo();
                        });
                    });
                }],
                //产品销售信息
                ['get','#/platform/makerProducts/step_1/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../MakerProducts/left', '../MakerProducts/right_1?' + param], function(){
                        require(['page/platform/makerProducts'],function(product){
                            //初始化编辑器
                            product.initEditor();
                            //添加属性
                            product.addAttr();
                            //初始化inputtags
                            product.initInputTags();
                            product.post_1();
                        });
                    });
                }],
                //产品图片信息
                ['get','#/platform/makerProducts/step_2/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../MakerProducts/left', '../MakerProducts/right_2?' + param], function(){
                        require(['page/platform/makerProducts_2', 'page/platform/uploader'],function(product,uploader){
                            product.post_2();
                            uploader.dropPicUpload();
                            uploader.delImg('../MakerProducts/delImg');
                        });
                    });
                }],
                //产品认证信息
                //['get','#/platform/makerProducts/step_3/&:param',function(){
                //    var param = encodeURI(this.params.param,'UTF-8');
                //    loadPage(['../MakerProducts/left', '../MakerProducts/right_3?' + param], function(){
                //        require(['page/platform/makerProducts_2', 'dateRange'],function(product, date){
                //            product.viewPic();
                //            product.bindUpload();
                //            product.delFile();
                //            product.selRz();
                //            product.post_3();
                //            date.singleDateRange();
                //        });
                //    });
                //}],
                //关键字搜索
                ['get','#/platform/makerProducts/step_4/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../MakerProducts/left', '../MakerProducts/right_4?' + param], function(){
                        require(['page/platform/makerProducts_2'],function(product){
                            product.post_4();
                        });
                    });
                }],

                //成套产品维护
                ['get', '#/platform/productPackage/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductPackage/left', '../ProductPackage/right?' + param], function () {
                            require(['ajaxPage', 'page/bootstrap-select', 'page/platform/productPackage'], function(ajaxPage, select, ppackage){
                                ajaxPage.loadPage('packgages-table','../ProductPackage/table?' + param);    //分页列表
                                ajaxPage.pageClick();
                                ajaxPage.delConf('../ProductPackage/delete');   //删除确认
                                ajaxPage.search('packgages-table', '../ProductPackage/table?' + param); //查询
                                select.bsSelect();
                                ppackage.searchPackge();
                                ajaxPage.isActive('../ProductPackage/realse');  //是否发布到门户
                                ajaxPage.isActive('../ProductPackage/recommend', "a.recommend");   //推荐
                            });
                        }
                    );
                }],
                ['get', '#/platform/productPackage/publish/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductPackage/left', '../ProductPackage/publish?' + param], function () {
                            require(['ajaxPage', 'page/bootstrap-select','page/platform/productPackage'], function(ajaxPage, select, ppackage){
                                ppackage.checkName();   //成套设备名称
                                select.bsSelect();      //搜索下拉列表
                                ppackage.loadProduct("../ProductPackage/loadProduct");   //产品列表
                                ppackage.addProduct("../ProductPackage/add", '../ProductPackage/loadAdd');      //添加产品
                                ppackage.loadAdd("../ProductPackage/loadAdd");  //加载已经添加的产品
                                ppackage.delProduct("../ProductPackage/delete");  //删除已添加的产品
                                //局部分页
                                ajaxPage.pageTable('../ProductPackage/loadProduct', "product-search" , "product-table");
                            });
                        }
                    );
                }],
                ['get', '#/platform/productPackage/addEdit/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductPackage/left', '../ProductPackage/addEdit?' + param], function(){
                        require(['page/platform/productPackage'],function(ppackage){
                            ppackage.validForm();
                        });
                    });
                }],
                ['get', '#/platform/productPackage/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductPackage/left', '../ProductPackage/detail?' + param], function(){
                        require(['ajaxPage', 'page/platform/productPackage', 'bootstrapSelect'],function(ajaxPage, ppackage){
                            ppackage.initiateFancybox();
                            ajaxPage.loadPage('package-detail-table','../ProductPackage/detailList?' + param);    //成套设备详情产品列表
                            ppackage.removePackage("../ProductPackage/delRelate");  //删除已推荐的产品
                            ppackage.relateProduct();
                            ajaxPage.pageTable('../ProductPackage/relateProduct?', "product-search" , "relate-modal-body");
                        });
                    });
                }],

                //销售产品管理
                ['get', '#/platform/salesProducts/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../SalesProducts/left', '../SalesProducts/right?' + param], function () {
                            require(['ajaxPage', 'check', 'page/platform/salesProducts', 'dateRange', 'page/bootstrap-select', 'module/buttonDisabled']
                                , function(ajaxPage, check, sales, dateRange, select, btnDisabled) {
                                ajaxPage.loadPage('sales-products-table','../SalesProducts/sales?' + param, function(){
                                    btnDisabled.buttonDisabled("button[class*='sale-btn']");
                                    check.inputCheck('check-all', 'check-one');
                                    sales.submitForm('../SalesProducts/batchUp', '.sales-up-btn');  //上架
                                    sales.submitForm('../SalesProducts/batchDown', '.sales-down-btn');  //下架
                                    sales.submitForm('../SalesProducts/leadTime', '.lead-btn');         //供货周期
                                    ajaxPage.confirmTip("../SalesProducts/batchUp","确定上架吗？", "sale-up");
                                    ajaxPage.confirmTip("../SalesProducts/batchDown", "确定下架吗？", "sale-down");
                                    sales.change(); //搜索
                                    select.bsSelect();  //所搜下拉列表
                                    sales.relatePic("../SalesProducts/relatePic");
                                    ajaxPage.isActive("../SalesProducts/isActive");
                                    sales.updateProductAttr("../SalesProducts/updateAttr", "a.update-attr");  //更新产品规格属性
                                });
                                //分页列表
                                ajaxPage.pageClick();
                                ajaxPage.submitModal();
                                //查询
                                ajaxPage.search('sales-products-table','../SalesProducts/sales?' + param);
                                //
                                //加载日期插件
                                dateRange.dateRange();

                            });
                        }
                    );

                }],
                ['get', '#/platform/salesProducts/publish/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../SalesProducts/left', '../SalesProducts/publish?' + param], function () {
                            require(['ajaxPage', 'page/bootstrap-select', 'check', 'page/platform/salesProducts', 'module/buttonDisabled']
                                , function(ajaxPage, select, check, sales, btnDisabled){
                                ajaxPage.loadPage('sales-products-table','../SalesProducts/products?' + param, function() {
                                    btnDisabled.buttonDisabled();
                                });
                                //分页列表
                                ajaxPage.pageClick();
                                //删除确认
                                ajaxPage.delConf('../SalesProducts/delete');
                                //查询
                                ajaxPage.search('sales-products-table', '../SalesProducts/products?' + param);
                                //
                                select.bsSelect();
                                //
                                check.inputCheck('check-all', 'check-one');
                                //
                                sales.submitForm('../SalesProducts/batch', '.products-btn');
                                sales.change();
                            });
                        }
                    );
                }],
                //采购价格维护
                ['get', '#/platform/purchasePrice/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../PurchasePrice/left', '../PurchasePrice/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','dateRange','check','page/finance/product-price'], function(ajaxPage,bsselect,dateRange,check,productPrice){
                            //分页列表
                            ajaxPage.pageClick();
                            //选择条件筛选
                            productPrice.change();
                            //选中事件
                            check.inputCheck();
                            //独立关键词查询,可带form表单id,默认是search-form
                            ajaxPage.searchKey();
                            //加载页面
                            ajaxPage.loadPage('purchase-price-table','../PurchasePrice/table?' + param,function(){
                                dateRange.singleDateRange();
                                productPrice.buttonDisabled();
                                productPrice.validForm('PurchasePrice');
                            });
                            //加载下拉框
                            bsselect.bsSelect();
                        });
                    });
                }],
                //产品编码维护
                ['get', '#/platform/productCode/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../ProductCode/left', '../ProductCode/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','check','page/finance/product-price'], function(ajaxPage,bsselect,check,productPrice){
                            //分页列表
                            ajaxPage.pageClick();
                            //选择条件筛选
                            productPrice.change();
                            //选中事件
                            check.inputCheck();
                            //独立关键词查询,可带form表单id,默认是search-form
                            ajaxPage.searchKey();
                            //加载页面
                            ajaxPage.loadPage('product-code-table','../ProductCode/table?' + param,function(){
                                productPrice.buttonDisabled();
                                productPrice.validForm('ProductCode');
                            });
                            //加载下拉框
                            bsselect.bsSelect();
                        });
                    });
                }],
                //产品多分类配置
                ['get', '#/platform/productMoreSort/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../ProductMoreSort/left', '../ProductMoreSort/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','page/finance/product-price','page/select2'], function(ajaxPage,bsselect,productPrice,select2){
                            //分页列表
                            ajaxPage.pageClick();
                            //选择条件筛选
                            productPrice.change();
                            //删除确认
                            ajaxPage.delConf('../ProductMoreSort/delete');
                            //独立关键词查询,可带form表单id,默认是search-form
                            ajaxPage.searchKey();
                            //加载页面
                            ajaxPage.loadPage('product-more-sort','../ProductMoreSort/table?' + param,function(){
                                //加载select2
                                select2.select2();
                                productPrice.validForm('ProductMoreSort');
                            });
                            //加载下拉框
                            bsselect.bsSelect();
                        });
                    });
                }],
                //产品证书维护
                ['get', '#/platform/productCertificate/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../ProductCertificate/left', '../ProductCertificate/right?' + param], function(){
                        require(['ajaxPage', 'check', 'page/platform/productCertificate', 'dateRange', 'page/bootstrap-select','page/finance/product-price']
                            , function(ajaxPage, check, productCertificate, dateRange, select,productPrice) {
                                productPrice.change();
                                ajaxPage.loadPage('products-certificate-table','../ProductCertificate/table?' + param, function(){
                                    dateRange.dateRange();
                                    productCertificate.submitModal();
                                });
                                //分页列表
                                ajaxPage.pageClick();

                                ajaxPage.searchKey();
                                //查询
                                ajaxPage.search('products-certificate-table','../ProductCertificate/table?' + param);
                                //加载下拉框
                                select.bsSelect();
                        });
                    });
                }],
                /* 平台（platform）管理路由end ************************************************/


                /* 财务（finance）管理路由start ************************************************/
                ['get', '#/finance', function(){//默认显示
                    this.redirect("#", "finance/payConfirm/&p=1");
                }],

                //收款确认
                ['get', '#/finance/payConfirm/&:param', function(){//默认显示
                    var param = encodeURI(this.params.param,'UTF-8');
                    //var page = param.match(/p=\d/);
                    loadPage(['../PayConfirm/left', '../PayConfirm/right?' + param], function(){
                        require(['ajaxPage','page/finance/confirm'], function(ajaxPage,confirm){
                            ajaxPage.loadPage('confirm-table', '../PayConfirm/table?' + param, function(){
                                confirm.bindConfirm();
                                confirm.bindCollapse();
                                confirm.validForm();
                                //confirm.bindPayConfirmForm(ajaxPage);//从后台代入收款账户的方式
                            });
                            //分页列表
                            ajaxPage.pageClick();
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('search-form','../PayConfirm/table?' + param);
                        });
                    });
                }],
                ['get', '#/finance/payConfirm/detail/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../PayConfirm/left', '../Order/orderDetail?' + param],function(){

                    });
                }],
                //销售价格管理
                ['get', '#/finance/productPrice/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../ProductPrice/left', '../ProductPrice/right?' + param], function(){
                        require(['ajaxPage','page/bootstrap-select','dateRange','check','page/finance/product-price'], function(ajaxPage,bsselect,dateRange,check,productPrice){
                            //分页列表
                            ajaxPage.pageClick();
                            //切换选项卡
                            productPrice.gotoTab();
                            //选择条件筛选
                            productPrice.change();
                            //选中事件
                            check.inputCheck();
                            //独立关键词查询,可带form表单id,默认是search-form
                            ajaxPage.searchKey();
                            //加载页面
                            ajaxPage.loadPage('product-price-table','../ProductPrice/table?' + param,function(){
                                //dateRange.singleDateRange();
                                productPrice.buttonDisabled();
                                productPrice.validForm();
                            });
                            //加载下拉框
                            bsselect.bsSelect();
                            //加载日期插件
                            dateRange.dateRange();
                        });
                    });
                }],
                //订单价格管理
                ['get', '#/finance/orderPrice/&:p', function(){//默认显示
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../OrderPrice/left', '../OrderPrice/priceRight?' + param], function(){
                        require(['ajaxPage','dateRange','page/bootstrap-select','page/finance/orderPrice'], function(ajaxPage,dateRange,bsselect,orderPrice){
                            //分页列表`
                            ajaxPage.pageClick();
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('search-form');
                            //加载页面
                            ajaxPage.loadPage('price-order-table','../OrderPrice/priceTable?' + param,function(){
                                dateRange.singleDateRange();
                                orderPrice.bindOrderPriceCollapse();
                                orderPrice.bindPrice();
                                orderPrice.bindCollapsePrice();
                            });
                            //加载下拉框
                            bsselect.bsSelect();
                            //加载日期插件
                            dateRange.dateRange();
                        });
                    });
                }],
                ['get', '#/finance/orderPrice/detail/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../OrderPrice/left', '../Order/orderDetail?' + param],function(){
                    });
                }],
                /* 财务（finance）管理路由end ************************************************/


                /* 订单（order）管理路由start ************************************************/
                ['get', '#/order', function(){//默认显示
                    this.redirect("#", "order/orderMgr/&p=1");
                }],
                ['get','#/order/orderMgr/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../OrderMgr/left','../OrderMgr/right?'+param],function(){
                        require(['ajaxPage','dateRange','page/bootstrap-select','page/order/orderMgr'], function (ajaxPage,dateRange,bsselect,orderMgr) {
                            //查询
                            ajaxPage.search('search-form');
                            ajaxPage.loadPage('order_mgr-table', '../OrderMgr/table?'+param,function(){
                                orderMgr.bindCollapsePrice();
                            });
                            ajaxPage.pageClick();   //分页列表
                            //加载下拉框
                            bsselect.bsSelect();
                            //加载日期插件
                            dateRange.dateRange();

                        });
                    });
                }],
                ['get', '#/order/orderMgr/detail/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../OrderMgr/left', '../Order/orderDetail?' + param],function(){
                    });
                }],
                /* 订单（order）管理路由end ************************************************/


                /* 配送（delivery）管理路由start ************************************************/
                ['get', '#/delivery', function(){//默认显示
                    this.redirect("#", "delivery/deliveryOrder/&p=1");
                }],
                ['get','#/delivery/deliveryOrder/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../DeliveryOrder/left', '../DeliveryOrder/right?' + param],function(){
                        require(['ajaxPage','dateRange', 'page/delivery/deliveryOrder'], function (ajaxPage,dateRange,delivery) {
                            ajaxPage.search('search-form');
                            ajaxPage.pageClick();
                            ajaxPage.loadPage('delivery-order-table', '../DeliveryOrder/table?'+ param,function(){
                                delivery.bindDeliveryOrderCollapse();
                                delivery.bindCollapDeliveryOrder();
                            });
                            dateRange.dateRange();
                        });
                    });
                }],
                ['get','#/delivery/deliveryOrder/send/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../DeliveryOrder/left', '../DeliveryOrder/right_send?' + param],function(){
                        require(['ajaxPage', 'page/delivery/deliveryOrder'], function (ajaxPage,delivery) {
                            ajaxPage.loadPage('send-order-table', '../DeliveryOrder/table_send?'+ param,function(){
                                delivery.orderDelivery();
                            });
                        });
                    });
                }],
                ['get', '#/delivery/deliveryOrder/detail/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../OrderPrice/left', '../Order/orderDetail?' + param],function(){
                    });
                }],

                ['get','#/delivery/deliveryAdd/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../DeliveryAdd/left', '../DeliveryAdd/right?' + param],function(){
                        require(['ajaxPage', 'page/delivery/address'], function (ajaxPage,address) {
                            //删除确认
                            ajaxPage.delConf('../DeliveryAdd/del');
                            ajaxPage.loadPage('address-table', '../DeliveryAdd/table');
                            address.setDefaul();
                        });
                    });
                }],
                ['get', '#/delivery/deliveryAddressAdd/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../DeliveryAdd/left', '../DeliveryAdd/add?'+ param],function(){
                        require(['getLocation', 'page/delivery/address'],function(getlocation, address){
                            getlocation.location();
                            address.validForm();
                            address.checkMessage();
                        });
                    });
                }],
                /* 配送（delivery）管理路由end ************************************************/


                /* 仓储（storage）管理路由start ************************************************/
                ['get', '#/storage', function(){//默认显示
                    this.redirect("#", "storage/storageOutWait/&p=1");
                }],

                //待出库订单管理
                ['get','#/storage/storageOutWait/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../storageOut/left', '../storageOut/waiting?' + param], function() {
                        require(["ajaxPage","page/storage/storageOutWait"],function(ajaxPage, outWait){
                            ajaxPage.loadPage('waiting-table', '../StorageOut/waitTable?'+ param,function(){
                                outWait.orderSearch();
                                outWait.bindCollapseWaitOut();
                                //分页列表
                                ajaxPage.pageClick();
                            });
                        });
                    });
                }],
                ['get','#/storage/storageOutWait/out/&:param',function(){   //出库
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../storageOut/left', '../storageOut/waitOut?' + param], function() {
                        require(["page/storage/storageOutWait", "dateRange", "page/bootstrap-select"],
                            function(outWait, dateRange, select){
                            //加载日期插件
                            dateRange.dateRange();
                            outWait.plusOrMinusNum();
                            outWait.submitOutForm();
                            select.bsSelect();  //所搜下拉列表
                        });
                    });
                }],
                ['get','#/storage/storageOutWait/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../storageOut/left', '../Order/orderDetail?' + param],function(){});
                }],

                //库存预警
                ['get','#/storage/storageWarn/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductStorage/left', '../ProductStorage/right?' + param], function() {
                        require(["page/storage/productStorage", "ajaxPage", "page/bootstrap-select"],
                            function(storage, ajaxPage, select){
                            select.bsSelect();  //所搜下拉列表
                            storage.searchStorageChange();  //搜索
                            ajaxPage.loadPage('warn-table', '../ProductStorage/table?'+ param,function(){
                                ajaxPage.pageClick();   //分页列表
                                storage.submitStorageForm();    //保存修改
                            });
                        });
                    });
                }],
                //查看库存
                ['get','#/storage/showStorage/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductStorage/left', '../ProductStorage/right?' + param], function() {
                        require(["page/storage/productStorage", "ajaxPage", "page/bootstrap-select"],
                            function(storage, ajaxPage, select){
                                select.bsSelect();  //所搜下拉列表
                                storage.searchStorageChange();  //搜索
                                ajaxPage.loadPage('warn-table', '../ProductStorage/table?'+ param,function(){
                                    ajaxPage.pageClick();   //分页列表
                                });
                            });
                    });
                }],

                //入库管理
                ['get','#/storage/storageIn/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageIn/left', '../StorageIn/right?' + param],function(){
                        require(['ajaxPage','page/storage/storageIn','dateRange'],function(ajaxPage,storageIn,dateRange){
                            //storageMgr.submitStorage();
                            ajaxPage.loadPage('storageIn-table','../StorageIn/table?' + param,function(){
                                //storageMgr.bindIsWork();//启用、停用
                                dateRange.dateRange();
                            });
                            storageIn.storageInForm();
                            ajaxPage.pageTable('../StorageIn/table?'+param, 'storageInSearch-form', 'storageIn-table');
                            //查询,可带form表单id,默认是search-form
                            //ajaxPage.search('storageInSearch-form','../StorageIn/table?' + param);

                        });
                    });
                }],
                //入库单详情
                ['get','#/storage/storageIn/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageIn/left', '../StorageIn/storageInDetail?' + param],function(){});
                }],
                ['get','#/storage/storageIn/addStep_1/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageIn/left', '../StorageIn/addStep_1?' + param],function(){
                        require(['page/bootstrap-select','page/storage/storageIn'],function(bsselect,storageIn){
                                //加载下拉框
                                bsselect.bsSelect();
                                storageIn.bindStorageInStep1();
                        });
                    });
                }],
                ['get','#/storage/storageIn/addStep_2/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageIn/left', '../StorageIn/addStep_2?' + param],function(){
                        require(['ajaxPage','page/bootstrap-select','page/storage/storageIn'],function(ajaxPage,bsselect,storageIn){
                            //加载下拉框
                            bsselect.bsSelect();

                            ajaxPage.loadPage('storageInAdd-table','../StorageIn/tableAdd?' + param,function(){
                                //加载下拉框
                                bsselect.bsSelect();
                                storageIn.storageInSearch(bsselect);
                                storageIn.submitStorageInForm();//保存数据
                            });
                            storageIn.storagePageTable(bsselect);

                            //storageIn.bindStorageInStep1();//保存数据
                        });
                    });
                }],
                //仓库信息管理
                ['get','#/storage/storageMgr/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageMgr/left', '../StorageMgr/right?' + param],function(){
                        require(['getLocation','ajaxPage','page/storage/storageMgr'],function(getlocation,ajaxPage,storageMgr){
                            //storageMgr.submitStorage();
                            getlocation.location();
                            ajaxPage.loadPage('storageMgr-table','../StorageMgr/table?' + param,function(){
                                storageMgr.bindIsWork();//启用、停用
                            });
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('storageMgr-table','../StorageMgr/table?' + param);
                        });
                    });
                }],
                ['get','#/storage/storageMgrAdd/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageMgr/left', '../StorageMgr/addStorage?' + param],function(){
                        require(['getLocation','ajaxPage','page/storage/storageMgr'],function(getlocation,ajaxPage,storageMgr){
                            //storageMgr.submitStorage();
                            storageMgr.validForm();
                            storageMgr.bindStart();
                            getlocation.location();

                        });
                    });
                }],
                //出库单管理
                ['get','#/storage/storageOut/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageOut/left', '../StorageOut/right?' + param], function(){
                        require(['ajaxPage','dateRange','page/storage/StorageOut'], function(ajaxPage,dateRange,storageOut){
                            ajaxPage.loadPage('storage-out-table','../StorageOut/table?' + param,function(){
                                //加载日期插件
                                dateRange.dateRange();
                                storageOut.dateChange();
                            });
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('storage-out-table','../StorageOut/table?' + param);
                        });
                    });
                }],
                ['get','#/storage/storageOut/detail/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageOut/left', '../StorageOut/storageOutDetail?' + param], function(){});
                }],
                //库存初始化
                ['get','#/storage/storageInit/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../StorageInit/left', '../StorageInit/right?' + param], function(){
                        require(['ajaxPage',"page/bootstrap-select","page/storage/storageInit" ,"page/storage/spinner"], function(ajaxPage,select,storageInit,spinner){
                            ajaxPage.loadPage('storage-init-table','../StorageInit/table?' + param,function(){
                                spinner.piusOrMinus();
                                select.bsSelect();
                                ajaxPage.pageClick();   //分页列表
                                storageInit.change();  //搜索
                                storageInit.productStorage();
                            });
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('storage-init-table','../StorageInit/table?' + param);
                            ajaxPage.searchKey();
                        });
                    });
                }],
                /* 仓储（storage）管理路由end ************************************************/


                /* 系统（sys）管理路由start ************************************************/
                ['get', '#/sys', function(){//默认显示的是
                    this.redirect("#", "sys/member/&p=1");
                }],
                //用户信息
                ['get', '#/sys/member/:p', function(e){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(['../Member/left', '../Member/right?' + param], function(){
                        require(['ajaxPage'], function(ajaxPage){
                            //分页列表
                            ajaxPage.pageClick();
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('member-table','../Member/table');
                            //绑定是否启用事件
                            ajaxPage.isActive('../Member/active');
                            //加载页面
                            ajaxPage.loadPage('member-table','../Member/table?' + param);
                        });
                    });
                }],
                //岗位权限管理 (station)设置路由
                ['get', '#/sys/station/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left', '../Member/station?' + param], function () {
                            require(['ajaxPage', 'page/sys/station'], function(ajaxPage, station){
                                ajaxPage.loadPage('station-table','../Member/stTable?' + param);
                                //分页列表
                                ajaxPage.pageClick();
                                //删除确认
                                ajaxPage.delConf('../Member/delStation');
                                //查询
                                ajaxPage.search('station-table','../Member/stTable?' + param);
                                //启用停用
                                ajaxPage.isActive("../Member/active");
                                //重置密码
                                ajaxPage.confirmTip('../Member/resetPwd', '您确定要将密码重置为 "123456" 吗?','reset');
                                ajaxPage.submitModal();

                            });
                        }
                    );

                }],
                ['get', '#/sys/station/addSt/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left', '../Member/addSt?' + param], function(){
                        require(['page/sys/station'],function(station){
                            station.validStationForm();
                        });
                    });
                }],
                //用户组
                ['get', '#/sys/group/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    loadPage(
                        ['../Group/left', '../Group/right'], function () {
                            require(['ajaxPage' ,'page/sys/group'], function (ajaxPage, group) {
                                //加载页面
                                ajaxPage.loadPage('group-table','../Group/lists?' + param);
                                //分页列表
                                ajaxPage.pageClick();
                                //绑定是否启用事件
                                ajaxPage.isActive('../Group/active');
                                group.submitForm();
                                group.editGroup();
                                group.sortGroup();
                                group.canceBtn();
                            });
                        }
                    );
                }],
                //角色管理
                ['get', '#/sys/role/&:p', function(){
                    var param = encodeURI(this.params['p'],'UTF-8');
                    //var page = param.match(/p=\d/);
                    loadPage(['../Role/left', '../Role/right?' + param], function(){
                        require(['ajaxPage','page/sys/role'], function(ajaxPage,role){
                            ajaxPage.loadPage('role-table','../Role/table?' + param);
                            //删除确认
                            ajaxPage.delConf('../Role/del');
                            role.validRoleForm();
                            role.editRole();
                            role.bindCancelRole();
                        });
                    });
                }],
                ['get','#/sys/role/permission/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Role/left', '../Role/permissionSet?' + param], function(){
                        require(['page/sys/role'],function(role){
                            role.bindCheck();
                            role.PermissionSet();
                        });
                    });
                }],
                //菜单路由
                ['get', '#/sys/menu/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Menu/left', '../Menu/right?' + param], function(){
                        require(['ajaxPage','page/sys/menu'], function(ajaxPage,menu){
                            //加载页面
                            ajaxPage.loadPage('menu-table','../Menu/table?' + param,function(){
                                //初始化table tree
                                menu.initMenuTree();
                                //排序
                                menu.menuSort();
                            });
                            //selLoad下拉选择
                            menu.selLoad();
                            //删除确认
                            ajaxPage.delConf('../Menu/del');
                            ajaxPage.isActive('../Menu/active');
                        });
                    });
                }],
                ['get', '#/sys/menu/add/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Menu/left', '../Menu/add?' + param], function(){
                        require(['page/sys/menu'],function(menu){
                            menu.validMenuForm();
                        });
                    });
                }],

                //收款帐户(bankAccountSetting)设置路由 start
                ['get', '#/sys/bankAccountSetting/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left', '../BankAccountSetting/right'], function () {
                            require(['ajaxPage', 'page/sys/bankAccountSetting'], function (ajaxPage, account) {
                                //加载页面
                                ajaxPage.loadPage('account-table','../BankAccountSetting/lists?' + param);
                                //分页列表
                                ajaxPage.pageClick();
                                //删除确认
                                ajaxPage.delConf('../BankAccountSetting/delete');
                                //设为默认
                                account.setDefaul();
                                account.checkNamT();
                            });

                        }
                    );

                }],
                //涉安证书路由设置
                ['get', '#/sys/productCert/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductCert/left', '../ProductCert/right?'+param], function () {
                            require(['ajaxPage','page/sys/productCert'], function(ajaxPage,productCert){
                                //加载页面
                                ajaxPage.loadPage('productCert-table','../ProductCert/table?' + param);
                                //分页列表
                                ajaxPage.pageClick();

                                productCert.productIsActive();
                                //删除确认
                                ajaxPage.delConf('../ProductCert/delete');
                            });

                        }
                    );

                }],
                ['get', '#/sys/productCert/add/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../ProductCert/left', '../ProductCert/add?'+param], function () {
                            require(['page/sys/productCert'],function(productCert){
                                productCert.validProductCertForm();
                            });
                        }
                    );
                }],
                //企业证书路由设置
                ['get', '#/sys/companyCert/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../CompanyCert/left', '../CompanyCert/right?'+param], function () {
                            require(['ajaxPage','page/sys/companyCert'], function(ajaxPage,companyCert){
                                //加载页面
                                ajaxPage.loadPage('companyCert-table','../CompanyCert/table?' + param);
                                //分页列表
                                ajaxPage.pageClick();
                                //状态改变
                                companyCert.companyIsActive();
                                //删除确认
                                ajaxPage.delConf('../CompanyCert/delete');
                            });
                        }
                    );
                }],
                ['get', '#/sys/companyCert/add/&:param', function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../CompanyCert/left', '../CompanyCert/add?'+param], function () {
                            require(['page/sys/companyCert'],function(companyCert){
                                companyCert.validCompanyCertForm();
                            });
                        }
                    );
                }],
                //收款帐号配置
                ['get', '#/sys/bankAccountSetting/addEdit/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left', '../BankAccountSetting/addEdit?' + param], function(){
                        require(['page/sys/bankAccountSetting'],function(account){
                            account.validForm();
                            account.checkNamT();
                        });
                    });
                }],
                //全局参数配置
                ['#/sys/globalSetting/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../GlobalSetting/left', '../GlobalSetting/right?'+param], function(){
                        require(['ajaxPage','page/sys/globalSetting'],function(ajaxPage,global){
                            ajaxPage.loadPage('global-setting-table','../GlobalSetting/table?' + param ,function(){
                                global.submitGlobalSetting();
                                global.submitEmailSetting();
                            });
                        });
                    });
                }],
                //企业管理
                ['get','#/sys/company/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left','../Company/right?'+param], function(){
                        require(['ajaxPage','page/sys/company','dateRange'], function(ajaxPage,company,date){
                            //分页列表
                            ajaxPage.pageClick();
                            //查询,可带form表单id,默认是search-form
                            ajaxPage.search('company-table','../Company/table');
                            //绑定是否审核事件、是否推荐事件
                            company.isChange();
                            ajaxPage.submitModal();
                            //加载页面
                            ajaxPage.loadPage('company-table','../Company/table?' + param);
                            //日期控件
                            date.dateRange();
                        });
                    });
                }],
                ['get','#/sys/company/addEdit/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left','../Company/addEdit?'+param],function(){
                        require(['getLocation','page/sys/company','dateRange'],function(getlocation,company,date){
                            getlocation.location();
                            company.initEditor();
                            company.validForm();
                            //日期控件
                            date.dateRange();
                        });
                    });
                }],
                ['get','#/sys/company/qy_rz/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Member/left','../Company/qyRz?'+param],function(){
                        require(['page/sys/company'],function(company){
                            company.initRzFancybox();
                            company.setRz();
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
                                        //加载下拉框
                                        //bsselect.bsSelect();'page/bootstrap-select'
                                    });
                                });
                                break;
                        }
                    });
                }],
                //修改密码start
                ['get','#/usermg/changePassword',function(){
                    loadPage([],function(){});
                }],
                //区域管理
                ['get','#/sys/area/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Area/left','../Area/right?'+ param],function(){
                        require(['ajaxPage','page/sys/area'],function(ajaxPage,area){
                            //分页列表
                            ajaxPage.pageClick();
                            //加载页面
                            ajaxPage.loadPage('area-table','../Area/table?' + param);
                            ajaxPage.search('area-table','../Area/table?' + param);

                        });
                    });
                }],
                ['get','#/sys/area/add/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Area/left','../Area/add?'+ param],function(){
                        require(['page/sys/area','page/bootstrap-select'],function(area ,select){
                            select.bsSelect();
                            area.validAreaForm();
                        });
                    });
                }],
                ['get','#/sys/area/edit/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Area/left','../Area/edit?'+param],function(){
                        require(['page/sys/area','page/bootstrap-select'],function(area ,select){
                            select.bsSelect();
                            area.validAreaForm();
                        });
                    });
                }],
                ['get','#/sys/area/add_/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../Area/left','../Area/add_?'+param],function(){
                        require(['page/sys/area','page/bootstrap-select'],function(area ,select){
                            select.bsSelect();
                            area.validAreaForm();
                        });
                    });
                }],

                //数据字典维护
                ['get','#/sys/sysDict/lists/&:param',function(){
                    var param = encodeURI(this.params.param,'UTF-8');
                    loadPage(['../SysDict/left','../SysDict/right?'+ param],function(){
                        require(['ajaxPage','page/sys/sysDict'],function(ajaxPage, dict){
                            //分页列表
                            ajaxPage.pageClick();
                            //加载页面
                            ajaxPage.loadPage('sys-dict-table','../SysDict/table?' + param, function(){
                                dict.initSysDictTree();
                                //删除确认
                            });
                            ajaxPage.confirmTip("../SysDict/del");
                            //选择编码规则
                            dict.selCodeRule();
                            dict.cloneItem();
                            dict.submitSysDict();//绑定提交
                            dict.submitSysDictEdit();//绑定编辑
                            dict.updateCache();//绑定更新缓存
                        });
                    });
                }]
                /* 系统（sys）管理路由end ************************************************/
            ])
        }).run('#/home');

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


