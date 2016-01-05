var rootScope = {};
rootScope.gridIndex = 0;
/**
 * BoilDataSource
 */
(function ($) {
    var extend = $.extend,
        BaseDataSource = kendo.data.DataSource;

    var BoilDataSource = BaseDataSource.extend({
        init: function (options) {
            var that = this;
            options = that.options = extend(true, {}, that.options, options);
            // base call to widget initialization
            BaseDataSource.fn.init.call(this, options);

        },
        options: {
            name: "BoilDataSource",
            schema: {
                data: "items",
                total: "totalCount"
            },
            pageSize: 10,
            serverPaging: true, //是否根据服务端分页
            serverFiltering: false,
            serverSorting: true  //是否根据服务端排序
        },

        batchDestroy: function (data) {
            var that = this,
                params = that._params(data);

            that.transport.batchDestroy({
                data: params
            });
        }

    });

    extend(true, kendo.data, {
        BoilDataSource: BoilDataSource
    });
})(jQuery);


/**
 * BoilGrid
 */
(function ($) {

    var BaseGrid = kendo.ui.Grid,
        extend = $.extend,
        CLICK = "click",
        NS = ".kendoGrid";

    //按钮
    var extendCommands = {
        boilAdd: {
            text: '增加',
            imageClass: "k-add",
            className: "k-grid-boilAdd",
            iconClass: "k-icon"
        },
        boilBatchDestroy: {
            text: '批量删除',
            imageClass: "k-delete",
            className: "k-grid-boilBatchDestroy",
            iconClass: "k-icon"
        },
        boilView: {
            text: '查看',
            imageClass: "k-link",
            className: "k-grid-boilView",
            iconClass: "k-icon"
        }
    };

    var BoilGrid = BaseGrid.extend({
        init: function (element, options) {
            var that = this;
            options = that.options = extend(true, {}, that.options, options);
            // Call the base class's init.
            BaseGrid.fn.init.call(this, element, options);

            // If you want to watch changes in the dataSource
            // attached to the grid, you could use this.  Of
            // course you don't even need to subclass to do this
            // but you get the point.
            that.dataSource.bind("change", function (e) {

            });

            that._checkAll();
            that._boilAdd();
            that._batchDelete();
            that._view();
        },

        // 默认配置
        options: {
            name: "BoilGrid",
            dataBinding: function () {
                rootScope.gridIndex = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            columns: [],
            pageable: {
                refresh: true,   //显示刷新按钮
                pageSizes: true, //显示每页多少条选项
                buttonCount: 5  //显示页数的按钮数量
            },
            messages: {
                "commands": {
                    "boilAdd": extendCommands.boilAdd.text,
                    "cancel": "取消",
                    "canceledit": "取消",
                    "create": "新增",
                    "destroy": "删除",
                    "boilBatchDestroy": extendCommands.boilBatchDestroy.text,
                    "boilView": extendCommands.boilView.text,
                    "edit": "编辑",
                    "save": "保存",
                    "select": "选择",
                    "update": "更新"
                },
                "editable": {
                    "cancelDelete": "取消",
                    "confirmation": "确定要删除吗？",
                    "confirmDelete": "删除"
                }
            }
        },

        refreshGrid: function () {
            var that = this,
                dataSource = that.dataSource,
                isChange = dataSource.hasChanges();
            if (isChange) {
                if (confirm("是否保存更新的数据 ！")) {
                    dataSource.sync();
                }
            } else {
                dataSource.read();
            }
        },

        _checkAll: function(){
            var that = this,
                wrapper = that.wrapper;
            var tableThead = wrapper.find(".k-grid-header");
            tableThead.on(CLICK + NS, ".checkAll", function (e) {
                that.checkAll(e,wrapper);
            });
        },

        checkAll: function(e,wrapper){
            var _checkInput = wrapper.find("table tr td input[type='checkbox']");

            if (e.target.checked) {
                _checkInput.each(function () {
                    $(this)[0].checked = true;
                })
            } else {
                _checkInput.each(function () {
                    $(this)[0].checked = false;
                })
            }
        },

        _boilAdd: function(){
            var that = this,
                wrapper = that.wrapper,
                toolbar = that.options.toolbar,
                container;
            if (toolbar) {
                container = wrapper.find(".k-grid-toolbar");
                container.on(CLICK + NS, ".k-grid-boilAdd", function (e) {
                    e.preventDefault();
                    that.boilAdd(toolbar);
                });
            }
        },

        boilAdd: function(toolbar){
            var url;
            for(var i=0; i<toolbar.length; i++){
                var item = toolbar[i];
                if(item.name === "boilAdd") {
                    url = item.url;
                }
            }



        },

        _batchDelete: function () {
            var that = this,
                wrapper = that.wrapper,
                toolbar = that.options.toolbar,
                container;
            if (toolbar) {
                container = wrapper.find(".k-grid-toolbar");
                container.on(CLICK + NS, ".k-grid-boilBatchDestroy", function (e) {
                    e.preventDefault();
                    that.batchDelete();
                });
            }
        },

        batchDelete: function () {
            var that = this,
                dataSource = that.dataSource;
            var _ids = [];

            $("table tbody tr input[type='checkbox']:checked").each(function () {
                _ids.push($(this).val());
            });

            if (_ids.length <= 0) {
                alert("请选择相关数据");
            } else {
                dataSource.batchDestroy({ids: _ids});
            }
        },

        _view: function(){
            var that = this,
                container = that.wrapper,
                columns = that.options.columns,
                length = columns.length,
                commands;

            for (var idx=0; idx < length; idx++) {
                commands = columns[idx].command;
                if (commands) {
                    for(var i=0; i<commands.length; i++){
                        command = commands[i];
                        if(command.name === "view") {
                            container.on(CLICK + NS,"a.k-grid-boilView", function(e){
                                e.preventDefault();
                                that.view(that);
                            });
                        }
                    }
                }
            }
        },

        view: function(context){

        }

    });

    // 注册组件
    kendo.ui.plugin(BoilGrid);
})(jQuery);


/**
 * BoilTreeView
 */
(function ($) {
    var extend = $.extend,
        BaseTreeView = kendo.ui.TreeView,
        CLICK = "click",
        NS = ".kendoTreeView";

    var BoilTreeView = BaseTreeView.extend({
        init: function (element, options) {
            var that = this;
            options = that.options = extend(true, {}, that.options, options);
            BaseTreeView.fn.init.call(that, element, options);
            that._selectFirstNode();
            that._treeFilter();
            that._expandAll();
            that._collapseAll();
        },

        options: {
            name: "BoilTreeView",
            messages: {
                loading: "Loading...",
                requestFailed: "加载失败.",
                retry: "刷新"
            }
        },

        _treeFilter: function(){
            var that = this;
            $(".tree-filter").keyup(function(){
                var filterText = $(".tree-filter").val();
                that.findLikeText(filterText);
            });
            $(".tree-filter").change(function(){
                var filterText = $(".tree-filter").val();
                that.findLikeText(filterText);
            });
        },

        _queryParent: function (node, searchTerm) {
            if (node.parentNode()) {
                if (node.pinyincode !== null) {
                    return (node.text.indexOf(searchTerm) != -1 || node.pinyincode.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 || this.queryParent(node.parentNode(), searchTerm));
                } else {
                    return (node.text.indexOf(searchTerm) != -1 || this.queryParent(node.parentNode(), searchTerm));
                }

            } else {
                if (node.pinyincode !== null) {
                    return (node.text.indexOf(searchTerm) != -1) || (node.pinyincode.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1);
                } else {
                    return (node.text.indexOf(searchTerm) != -1);
                }
            }
        },

        findLikeText: function (searchTerm) {
            var that = this;
            that.nodeFilter = {logic: "or", filters: []};

            that.element.find(".k-in").each(function () {
                var dItem = that.dataItem($(this).closest("li"));
                dItem.hidden = false;
                var finded = false;

                finded = that._queryParent(dItem, searchTerm);

                if (finded) {
                    while (dItem.parentNode()) {
                        dItem = dItem.parentNode();
                        dItem.hidden = false;
                    }
                } else {
                    dItem.hidden = true;
                }
            });

            that.element.find(".k-in").each(function () {
                var node = $(this).closest("li");
                var dataItem = that.dataItem(node);
                if (dataItem.hidden) {
                    node.hide();
                } else {
                    node.show();
                }
            });

        },

        _selectFirstNode: function () {
            this.selectFirstNode();
        },

        selectFirstNode: function () {
            var that = this;
            var node = that.element.find(".k-in:first");
            that.select(node);
            that.expand(node);
        },

        _expandAll: function(){
            var that = this,
                wrapper = that.wrapper;
            var element = wrapper.find(".k-treeview");
            element.on(CLICK + NS, ".expandAllNodes", function (e) {
                that.expandAll();
            });
        },

        expandAll : function(){
            this.expand(".k-item");
        },

        _collapseAll: function(){
            var that = this,
                wrapper = that.wrapper;
            var element = wrapper.find(".k-treeview");
            element.on(CLICK + NS, ".collapseAllNodes", function (e) {
                that.collapseAll();
            });
        },

        collapseAll: function(){
            this.collapse(".k-item");
        }

    });

    kendo.ui.plugin(BoilTreeView);
})(jQuery);