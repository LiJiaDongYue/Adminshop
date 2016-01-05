define(['kendoTree'], function( ){
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
                        return (node.text.indexOf(searchTerm) != -1 || node.pinyincode.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 || this._queryParent(node.parentNode(), searchTerm));
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

});