define(['tmpl','extend'],function (tmpl) {

    var IP_LOCATION = [{"n":"北京","p":"11"},{"n":"天津","p":"12"},{"n":"河北","p":"13"},{"n":"山西","p":"14"},{"n":"内蒙古","p":"15"},{"n":"辽宁","p":"21"},{"n":"吉林","p":"22"},{"n":"黑龙江","p":"23"},{"n":"上海","p":"31"},{"n":"江苏","p":"32"},{"n":"浙江","p":"33"},{"n":"安徽","p":"34"},{"n":"福建","p":"35"},{"n":"江西","p":"36"},{"n":"山东","p":"37"},{"n":"河南","p":"41"},{"n":"湖北","p":"42"},{"n":"湖南","p":"43"},{"n":"广东","p":"44"},{"n":"广西","p":"45"},{"n":"海南","p":"46"},{"n":"重庆","p":"50"},{"n":"四川","p":"51"},{"n":"贵州","p":"52"},{"n":"云南","p":"53"},{"n":"西藏","p":"54"},{"n":"陕西","p":"61"},{"n":"甘肃","p":"62"},{"n":"青海","p":"63"},{"n":"宁夏","p":"64"},{"n":"新疆","p":"65"},{"n":"台湾","p":"71"},{"n":"香港","p":"81"},{"n":"澳门","p":"82"}];

    var CLASS_CONT = 'location-selector'; //弹出窗口容器class名称
    var CLASS_TAB = 'location-tab';       //标签
    var CLASS_LIST = 'location-list';     //内容列表
    var CONT_ID;                          //当前事件的容器id(随机生成)
    var STATE = [];                       //事件状态(以数组形式保存当前事件状态  ["in","bind"] in表示鼠标在当前容器中反之为"out"  "bind"表示当前已绑定过js事件可以用于避免重复绑定 )
    var ADDRESS_IDS = [];
    var ADDRESS_ID = '';

    function Location(e) {
        this.container = e.currentTarget;    //筛选功能的主容器
        this.tag = e.target;                 //当前点击的元素
        this.tagName = this.tag.nodeName;    //当前元素名称

    }

    Location.prototype ={
        firstLevel:function () {
            //当点击下拉框
            if(this.tag.className.indexOf( 'location-input') > 0){
                var _tag = this.tag;

                //隐藏所有弹出的选择地区窗口
                $('.'+CLASS_CONT).hide();

                //存入当前输入框类型名称
                if($(_tag).attr('data-inputName') === undefined){
                    STATE[3] = ''
                }else{
                    STATE[3] = $(_tag).attr('data-inputName');
                }

                //为父级容器生成一个唯一的ID
                CONT_ID = STATE[3] + Math.floor(Math.random()*100000) + Math.floor(Math.random()*100000);
                $(_tag).parent().attr('id',CONT_ID);


                //当弹出菜单不存在时
                if($(_tag).next('.location-selector').length < 1){
                    //地区选择列表HTML模板
                    var provinceHtml = '<div class="triangle-box '+CLASS_CONT+'">'+
                        '<div class="triangle-border tb-border"></div><div class="triangle-border tb-background"></div>'+
                        '<div class="panel panel-default" style="width:360px;">'+
                        '<ul class="nav nav-tabs '+CLASS_TAB+'">'+
                        '<li class="active"><a>请选择</a></li>'+
                        '</ul>'+
                        '<ul class="'+CLASS_LIST+'">'+
                        '<% _location.forEach (function(data){ %>'+
                        '<li><span class="locList" data-value="<%=data.p %>" data-level="0"><%=data.n %></span></li>'+
                        '<%}); %>'+
                        '</ul>'+
                        '<div class="clearfix"></div>'+
                        '<i class="btn btn-xs btn-default location-clearAll">清空</i>'+
                        '</div>'+
                        '</div>';
                    //调用模板引擎
                    var render = tmpl.compile(provinceHtml);

                    var html = render({_location: IP_LOCATION});

                    //将生成的内容插入指定位置,并绑定鼠标离开菜单自动隐藏事件
                    $(_tag).after(html).parent().mouseleave(function () {
                        $(_tag).next().hide();
                    });
                }else{
                    //当弹出菜单已经存在时直接显示
                    $(_tag).next().show();
                }
            }
            this.nextLevel();
        },
        nextLevel:function () {
            var _tag = $(this.tag);
            var _baseCont = $('#'+CONT_ID);
            var _tab = _baseCont.find('.'+CLASS_TAB);
            var _cont = _baseCont.find('.'+CLASS_LIST);
            var _dValue = _tag.attr('data-value');
            var _dLevel = _tag.attr('data-level');
            //当点地址列表按钮
            if(this.tag.className === 'locList'){
                var _name = _tag.text();
                //没有下级数据.不让往下执行
                if(_dValue == -1) return false;
                var _jsonUrl = "../Area/listArea?fid="+_dValue+"&alevel="+_dLevel+"&callback=?";
                //列表内容模板
                var _cityHtml = '<ul class="'+CLASS_LIST+'">'+
                    '<% city.forEach (function(city){ %>'+
                    '<% if(city.n.length > 10){ %>'+
                    '<li style="width:100%"><span class="locList" data-value="<%=city.p%>" data-level="<%=level%>"><%=city.n%></span></li>'+
                    '<% }else if(city.n.length > 5){ %>' +
                    '<li style="width:45%"><span class="locList" data-value="<%=city.p%>" data-level="<%=level%>"><%=city.n%></span></li>'+
                    '<% }else if(city.n.length > 2){ %>' +
                    '<li style="width:24%"><span class="locList" data-value="<%=city.p%>" data-level="<%=level%>"><%=city.n%></span></li>'+
                    '<% }else{ %>' +
                    '<li><span class="locList" data-value="<%=city.p%>" data-level="<%=level%>"><%=city.n%></span></li>'+
                    '<% } %>'+
                    '<% }); %>'+
                    '<% if(level === 1 || level === 2){ %>' +
                    '<li><span class="locList-unlimited" data-value="<%=parent%>" data-level="<%=level%>">不限</span></li>'+
                    '<% } %>'+
                    '</ul>';


                //如果当前没有在区县层级就去加载下一级内容
                if(_dLevel < 3){
                    //插入遮罩层级loading动画
                    _baseCont.find('.panel').append('<div id="loading-img" style="position:absolute;top:0;left:0;height:100%;width:100%;background:#fff; opacity:.5"><img src="/Public/Common/images/loading.gif" style="position:absolute; top:50%; left:50%; margin:-8px 0 0 -8px"></div>');

                    $.getJSON(_jsonUrl, function(data){
                        //载入成功删除遮罩层级loading动画
                        _baseCont.find('#loading-img').remove();

                        //调用模板引擎
                        var render = tmpl.compile(_cityHtml);
                        var html = render({
                            city:data[_dValue],
                            level:data.l-1,
                            parent:_dValue
                        });

                        //插入内容
                        _cont.eq(_dLevel).nextAll('.'+CLASS_LIST).remove();
                        _tag.parent().parent().hide().after(html);

                        //插入标签
                        _tab.find('li').eq(_dLevel).nextAll().remove();
                        _tab.find('.active').removeClass('active');
                        var _a = _tab.find('li:last').find('a');
                        if(_name.length > 3){
                            var fullname = _name;
                            var sname = _name.substring(0,3)+'..';
                            _a.text(sname).attr('title',fullname);
                        }else{
                            _a.text(_name).attr('title',_name);
                        }
                        _tab.append('<li class="active"><a>请选择</a></li>');
                    });
                    ADDRESS_IDS[_dLevel] = _dValue;
                }else{
                    var _li = _baseCont.find('.'+CLASS_TAB).find('li');
                    var _text = _li.eq(0).find('a').attr('title')+'-'+_li.eq(1).find('a').attr('title')+'-'+_li.eq(2).find('a').attr('title')+'-'+_tag.text();
                    _baseCont.find('.form-control').html(_text);
                    _baseCont.find('input[hidden="hidden"]').remove();
                    $('.'+CLASS_CONT).hide();
                    ADDRESS_IDS[_dLevel] = _dValue;
                    ADDRESS_ID = ADDRESS_IDS.join('-');
                    $('#area_id').val(STATE[3]+ADDRESS_ID);
                    $('#area_name').val(STATE[3]+_text);
                    //_baseCont.append('<input name="postDB[area_id]" hidden="hidden" value="'+STATE[3]+ADDRESS_ID+'"><input name="postDB[area_name]" hidden="hidden" value="'+STATE[3]+_text+'">');
                }
                //当鼠标点击内容后解除离开事件的绑定
                $('#'+CONT_ID).unbind('mouseleave');

                //为容器重新绑定hover事件,并写入当前状态
                $('#'+CONT_ID).on('hover',function(e){
                    if(e.type == "mouseenter") {
                        STATE[0] = 'in';
                        STATE[1] = 'bind';
                        CONT_ID = $(this)[0].id;
                    }
                    else if (e.type == "mouseleave") {
                        STATE[0] = 'out';
                        STATE[1] = 'bind';
                        CONT_ID = $(this)[0].id;
                    }
                });

                //鼠标移出容器后"STATE"的值变为"out"点击任意位置可以关闭容器

                if(STATE[1] !== 'bind'){
                    $('body').on('click', function () {
                        if(STATE[0] === 'out' && $('.'+CLASS_CONT).is(":visible") === true){
                            $('.'+CLASS_CONT).hide();
                        }
                    });
                }
            }

            //当点击地址列表中的不限按钮
            if (this.tag.className !== 'locList-unlimited') {
            } else {
                var _li = _baseCont.find('.' + CLASS_TAB).find('li');
                var _text = _li.eq(0).find('a').attr('title') + (_li.eq(1).find('a').attr('title') ? ('-' + _li.eq(1).find('a').attr('title')) : '') + '-' + _tag.text();
                _baseCont.find('.form-control').html(_text);
                _baseCont.find('input[hidden="hidden"]').remove();
                var address = [];
                for (i = 0; i < _dLevel; i++) {
                    address[i] = ADDRESS_IDS[i];
                }
                ADDRESS_ID = address.join('-');
                $('#area_id').val(STATE[3] + ADDRESS_ID);
                $('#area_name').val(STATE[3] + _text);
                //_baseCont.append('<input  name="postDB[area_id]" hidden="hidden" value="'+STATE[3]+ADDRESS_ID+'"><input name="postDB[area_name]" hidden="hidden" value="'+STATE[3]+_text+'">');
                $('.' + CLASS_CONT).hide();
            }

            this.tab();
            this.clear();
        },
        tab:function (){
            if(this.tagName === 'A'){
                var li = $(this.tag).parent();
                var ul = li.parent();
                var indx = ul.find('li').index(li);
                ul.find('.active').removeAttr('class');
                li.addClass('active');
                $('#'+CONT_ID).find('.location-list').hide();
                $('#'+CONT_ID).find('.location-list').eq(indx).show();
                STATE[2]=indx;
            }
        },
        clear:function () {

            //location-clearAll
            if(this.tagName === 'I') {
                var _input = $('#'+CONT_ID).find('input');
                var _div = $('#'+CONT_ID).find('.form-control');
                _div.text(_div.attr('title'));
                _input.removeAttr('value');
            }
        }

    };

    return {
        location:function (param) {
            if(param){
                $('.locationRange').find('.location-input').css('min-width',param);
            }else{
                $('.locationRange').find('.location-input').css('min-width',275);
            }
            $('.locationRange').on('click',function (e) {
                e.stopPropagation();
                var g = new Location(e);
                g.firstLevel();
                //g.nextLevel();
            });

            var edit = $('#area_name').val();
            $('#get_address').text(edit);
        }
    };
});