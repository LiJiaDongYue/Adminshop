/**
 * Created by zq123 on 2015/7/22.
 */
define([],function(){
    return{
        dateChange : function(){
            $('#end-date').change(function(){
                var param = $('#search-form').formSerialize();
                var p1 = $.query.load(window.location.hash + '&' + encodeURI(param)).set('p',1).toString();
                window.location.href = p1;
            });
        }
    }
});
