require(['jForm','slider'], function(){
    $('.boilyun-header-content').on('click','.search-btn', function (e){
        //阻止默认事件，  就是#锚点跳走
        e.preventDefault();
        var queryParams = $('#search-form').formSerialize();
        alert(queryParams);
        var map = window.location.hash.split('&');
        var p1 = $.query.load(map[0] + '&' + encodeURI(queryParams)).set('p',1).toString();
        window.location.href = p1;
    });

    //安标预警翻动
    (function($){
        $.fn.extend({
            Scroll:function(opt,callback){
                //参数初始化
                if(!opt) var opt={};
                var _btnUp = $("#"+ opt.up);//Shawphy:向上按钮
                var _btnDown = $("#"+ opt.down);//Shawphy:向下按钮
                var timerID;
                var _this=this.eq(0).find("ul:first");
                var     lineH=_this.find("li:first").height(), //获取行高
                    line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10), //每次滚动的行数，默认为一屏，即父容器高度
                    speed=opt.speed?parseInt(opt.speed,10):500; //卷动速度，数值越大，速度越慢（毫秒）
                timer=opt.timer //?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒）
                if(line==0) line=1;
                var upHeight=0-line*lineH;
                var list = opt.list;
                //滚动函数
                var scrollUp=function(){
                    _btnUp.unbind("click",scrollUp); //Shawphy:取消向上按钮的函数绑定
                    _this.animate({
                        marginTop:upHeight
                    },speed,function(){
                        for(i=1;i<=list;i++){
                            _this.find("li:first").appendTo(_this);
                        }
                        _this.css({marginTop:0});
                        _btnUp.bind("click",scrollUp); //Shawphy:绑定向上按钮的点击事件
                    });

                }
                //Shawphy:向下翻页函数
                var scrollDown=function(){
                    _btnDown.unbind("click",scrollDown);
                    for(i=1;i<=list;i++){
                        _this.find("li:last").show().prependTo(_this);
                    }
                    _this.css({marginTop:upHeight});
                    _this.animate({
                        marginTop:0
                    },speed,function(){
                        _btnDown.bind("click",scrollDown);
                    });
                }
                //Shawphy:自动播放
                var autoPlay = function(){
                    if(timer)timerID = window.setInterval(scrollUp,timer);
                };
                var autoStop = function(){
                    if(timer)window.clearInterval(timerID);
                };
                //鼠标事件绑定
                _this.hover(autoStop,autoPlay).mouseout();
                _btnUp.css("cursor","pointer").click( scrollUp ).hover(autoStop,autoPlay);//Shawphy:向上向下鼠标事件绑定
                _btnDown.css("cursor","pointer").click( scrollDown ).hover(autoStop,autoPlay);

            }
        })
    })(jQuery);

    $(document).ready(function(){
        $("#scrollDiv").Scroll({line:1,list:5,speed:500,timer:5000,up:"btn1",down:"btn2"});
    });

    //换一批
    $('#gov-feature-btn').on('click',function(){
        var flag = $(this).attr('data-flag');
        $.ajax({
            cache: false,
            type: "GET",
            url: '../Index/batch?flag=' + flag,
            dataType: "json",
            success : function(resp){
                if(resp || resp.status == 1){
                    $('#gov-feature').html(resp.html);
                    $('#gov-feature-btn').attr('data-flag',resp.flag);
                }
            }
        });
    });

    //幻灯片轮播
    $(function() {
        var bannerSlider = new Slider($('#banner_tabs'), {
            time: 5000,
            delay: 400,
            event: 'hover',
            auto: true,
            mode: 'fade',
            controller: $('#bannerCtrl'),
            activeControllerCls: 'active'
        });
        $('#banner_tabs .flex-prev').click(function() {
            bannerSlider.prev()
        });
        $('#banner_tabs .flex-next').click(function() {
            bannerSlider.next()
        });
    })
});