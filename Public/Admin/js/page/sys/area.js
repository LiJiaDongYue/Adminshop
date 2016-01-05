
define(['commonkendo','ajaxPage','page/platform/product'],function(commonkendo,ajaxPage,product){
    return {
        onclickAreaList : function(){
            $('#a_area').on('click',function(){
                window.location.href='#/sys/area/&p=1'
                ajaxPage.loadPage('area-table','../Area/table');
            });
        },

        initTree : function(){
            var treeDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "../Area/getMenu",
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
                var p='area_id=' +item.area_id;
                $("#product-sort-form").hide();
                //分页列表
                ajaxPage.pageClick();
                window.location.href='#/sys/area/link/&p=1&'+p;
                ajaxPage.loadPage('area-table','../Area/link_table?' +p, function(){
                });
            }

        },
        validAreaForm: function () {
            $('#area_form').validate({
                errorElement: 'small',
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                rules: {
                    'postDB[area_name]': {
                        required: true

                    }
                },
                messages: {
                    'postDB[area_name]': {
                        remote: "请填写区域名称"
                    }
                },
                submitHandler: function (form) {
                    $(form).find('#submitBtn').attr('disabled',true).html('提交中...');
                    $(form).ajaxSubmit({
                        url: '../Area/save',
                        type: 'POST',
                        dataType: 'json',
                        success: function (resp) {
                            if(resp && resp.status === 1){
                                window.location.href = "#/sys/area/&p="+ Math.random();
                            } else {
                                $(form).find('#submitBtn').attr('disabled',false).html('提交');
                                dialog.popupTip('',resp.info);
                            }
                        }
                    });
                }
            });
        }
    };
});