function Dd(e) {return document.getElementById(e);}
document.getElementsByClassName = function(cl) {
    var retnode = [];
    var myclass = new RegExp('\\b'+cl+'\\b');
    var elem = this.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        var classes = elem[i].className;
        if (myclass.test(classes)) retnode.push(elem[i]);
    }
    return retnode;
}
var maxiv = 3 - $("#showArea a").length;
var speed = 500; //速度，越大越慢
var spec = 144; //每次滚动的间距
var iv = thumb_place*spec;//判断移动位置
var ipath = imgpath; //图片路径
var thumbs = document.getElementsByClassName('thumb_img');
for (var i=0; i<thumbs.length; i++) {
    thumbs[i].onmouseover = function () {Dd('main_img').src=this.rel; Dd('main_img').link=this.link;};
    thumbs[i].onclick = function () {location = this.link}
}
Dd('gotop').onmouseover = function() {this.src = ipath + 'gotop2.gif';}
Dd('gotop').onmouseout = function() {this.src = ipath + 'gotop.gif';}
Dd('gotop').onclick = function() {if(iv < 0) iv += spec;gotop();}
Dd('gobottom').onmouseover = function() {this.src = ipath + 'gobottom2.gif';}
Dd('gobottom').onmouseout = function() {this.src = ipath + 'gobottom.gif';}
Dd('gobottom').onclick = function() {if(iv > maxiv*spec) iv -= spec;gobottom();}
function gotop() {$('#showArea').animate({left:iv},speed);}
function gobottom() {$('#showArea').animate({left:iv},speed);}

$('#showArea').on('hover','img',function(){
    $('#showArea img').removeClass('img-hover');
    $(this).addClass('img-hover');
});
if(thumb_place < 0) $('#showArea').css("left",iv);