define(function(){
    !function longPolling(){
        $.ajax({
            url: "Admin/Message/index",
            data:{time:"800"}, //new Date().getTime()
            type:"POST",
            dataType:"json",
            timeout:80000
        }).fail(
            function(XMLHttpRequest, textStatus, errorThrown){

                $("#message").text("[state: " + textStatus + ", error: " + errorThrown + " ]");
                if(textStatus == "timeout"){ // 请求超时
                    longPolling(); // 递归调用
                    // 其他错误，如网络错误等
                }else{
                    longPolling();
                }
            }
        ).done(
            function(data, textStatus){
                var _message = $("#message");
                if(textStatus == "success"){ // 请求成功
                    if(data.success=="1"){
                        _message.text( data.name + '('+ data.text +')');  //"[state: " + textStatus + ", data: { " + data + "} ]<br/>"
                        if(!_message.hasClass('remind')){
                            _message.addClass('remind');
                        }
                    }
                    if(data.success=="0"){
                        $("#message").text(data.name).removeClass('remind');
                    }
                    longPolling();
                }
            }
        );
    }();
});