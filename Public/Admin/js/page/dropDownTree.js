/**
 * Created by Administrator on 2015/6/11.
 */

define(['dropDownTree'], function () {
    return {
        downTree: function (){
            var datasource = [{
                "text": "顶级分类",
                "expanded": true,
                "id": 0,
                "items": [
                    {
                        "text": "分类一",
                        "expanded": true,
                        "pid": 0,
                        "items": [
                            {
                                "text": "分类七",
                                "expanded": true,
                                "pid": 1,
                                "items": [],
                                "id": 7
                            }
                        ],
                        "id": 1
                    },
                    {
                        "text": "分类二",
                        "expanded": true,
                        "pid": 0,
                        "items": [],
                        "id": 2
                    },
                    {
                        "text": "分类三",
                        "expanded": true,
                        "pid": 0,
                        "items": [],
                        "id": 3
                    },
                    {
                        "text": "分类四",
                        "expanded": true,
                        "pid": 0,
                        "items": [
                            {
                                "text": "分类八",
                                "expanded": true,
                                "pid": 4,
                                "items": [],
                                "id": 8
                            },
                            {
                                "text": "分类九",
                                "expanded": true,
                                "pid": 4,
                                "items": [],
                                "id": 9
                            }
                        ],
                        "id": 4
                    },
                    {
                        "text": "分类五",
                        "expanded": true,
                        "pid": 0,
                        "items": [],
                        "id": 5
                    },
                    {
                        "text": "分类六",
                        "expanded": true,
                        "pid": 0,
                        "items": [
                            {
                                "text": "分类十",
                                "expanded": true,
                                "pid": 6,
                                "items": [],
                                "id": 10
                            },
                            {
                                "text": "分类十一",
                                "expanded": true,
                                "pid": 6,
                                "items": [],
                                "id": 11
                            }
                        ],
                        "id": 6
                    }
                ]
            }];
            var DropDownTreeView = $('#DropDownTreeView').kendoDropDownTreeView({
                dropDownWidth : '152px',
                valueField    : 'id',
                treeview      : {
                    dataSource: datasource
                }
            }).data("kendoDropDownTreeView");

            //console.log(DropDownTreeView.value());

            // 如果数据是异步获取的，可以这样设置dataSource
            // var treeDataSource = new kendo.data.HierarchicalDataSource({
            //     transport: {
            //         read:  {
            //             url: '',
            //             dataType: "json"
            //         }
            //     },
            //     schema: {
            //         data: 'data'
            //     },
            //     requestEnd:  function(e){
            //         DropDownTreeView.treeview().setDataSource(e.response.data)
            //     }
            // });
            // treeDataSource.read();


        }
    }
});