/**
 * Created by donkey on 2014/11/12.
 */
define(function () {
    return {
        todo: function () {
            //对传入参数进行分配准备转入下面ajax函数
            for (var i = 0; i < arguments.length; i++) {
                var args = arguments[i];
                if (typeof args === 'string') {
                    if (args === 'post' || args === 'POST') {
                        var ajaxType = args;
                    }
                    var url = args;
                } else if (typeof args === 'object') {
                    var param = args;
                } else if (typeof args === 'function') {
                    var callback = args;
                }
            }
            var param = param || {};
            $.ajax({
                type: ajaxType || "get",
                dataType: 'json',
                url: url,
                data: param,
                success: function (msg) {
                    return callback && callback(msg);
                }
            });
            return this;
        },
        //加载数据并返回html模板
        /**
         * 功能 加载数据并返回html模板
         * @param 参数是一个对象
         */
        loadData: function () {
            var param = arguments[0];
            $.ajax({
                cache: false,
                type: "GET",
                url: '' + param.url,
                data: param.param,
                dataType: "html",
                success: function (html) {
                    $('#' + param.id).html(html);
                    if (param.callback) {
                        return param.callback && param.callback(html);
                    }
                }
            });
            return this;
        },

        /**
         * 功能 加载数据并返回html模板
         * @param id
         * @param url
         * @param param
         * @param callback
         */
        loadDataOld: function (id, url, param, method, callback) {
            $.ajax({
                cache: false,
                type: method || "GET",
                url: '' + url,
                data: param,
                traditional: true,
                dataType: "html"
            }).done(function (html) {
                $('#' + id).html(html);
                return callback && callback(html);
            });
        }
    }
});