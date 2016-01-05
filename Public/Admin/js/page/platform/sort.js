
define(['commonkendo','ajaxPage','page/platform/product'],function(commonkendo,ajaxPage,product){
    return {
        onclickProductList : function(){
            $('#a_product_sort').on('click',function(){
                window.location.href='#/platform/productSort/&p=1'
                ajaxPage.loadPage('product-table','../ProductSort/table', function(){
                    product.productSort();
                });
            });
        },

        initTree : function(){
            var treeDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "../ProductSort/getMenu",
                        dataType: "json"
                    }
                }
            });

            treeDataSource.read().then(function () {
                var data = treeDataSource.data();
                var treeData = new kendo.data.HierarchicalDataSource({
                    data: data
                });

                treeView = $("#treeview-right").kendoBoilTreeView({
                    dataSource: treeData,
                    select: onSelect
                }).data("kendoBoilTreeView");

            });
            function onSelect(e) {
                var item = this.dataItem(e.node);
                var p='sort_id=' +item.sort_id;
                $("#product-sort-form").hide();
                var state = {
                    title: "后台管理",
                    url: '#/platform/productSort/link/&p=1&'+p,
                    otherkey: null
                };
                history.replaceState(state, "后台管理", '#/platform/productSort/link/&p=1&'+p);
                ajaxPage.loadPage('product-table','../ProductSort/link_table?' +p, function(){
                    //分页列表
                    ajaxPage.pageClick();
                    product.productSort();
                });
            }

        }
    };
});