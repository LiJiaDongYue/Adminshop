/******************************
 * 右侧工具栏控制器
 *******************************/
(function (window,$,undefined) {

	//弹出窗口外框模板
	var popWin = '<div class="side-toolbar-popup">' +
		'<span class="side-toolbar-popup-close"><i class="glyphicon glyphicon-remove"></i></span>' +
		'<span class="side-toolbar-popup-arrow"><i class="glyphicon glyphicon-chevron-right"></i></span>' +
		'</div>';

	//居中的弹出窗口外框模板
	var popWinCenter = '<div class="center-popup"><span class="center-popup-close"><i class="glyphicon glyphicon-remove"></i></span></div>';

	//弹出窗口内容(用户登录)
	var popWinCont = '<div style="width:250px; margin:auto"><iframe allowTransparency="true" frameborder="no" width="250" height="272" border="0" scrolling="no" src="/Home/Home/loginGlobal"></iframe></div>';

	//购物车模板
	var shoppingCart = '<% for (var i = 0; i < cart.length; i ++) { %>' +
		'<div class="panel panel-default"> <div class="panel-heading" title="<%= cart[i].d_qy_anme %>"><%= cart[i].short_qy_anme %></div>' +
		'<ul class="list-group">' +
		'<% for (var n = 0; n < cart[i].products.length; n ++) { %>' +
		'<li class="list-group-item">' +
		'<div class="media">' +
		'<a class="pull-left" href="/sell/bencandy.php?fid=<%= cart[i].products[n].fid %>&id=<%= cart[i].products[n].id %>">' +
		'<img class="media-object" src="<%= cart[i].products[n].img %>" width="48px" height="48px" alt=""/>' +
		'</a>' +
			//'<%= i + 1 %> ：<%= cart[i].title %>' +
		' <div class="media-body">' +
		'<h6 class="media-heading"><%= cart[i].products[n].short_title %></h6>' +
		'<h6 class="media-heading">型号:<%= cart[i].products[n].model %></h6>' +
		'<h6 class="media-heading">数量:<%= cart[i].products[n].amount %> | 单价:￥<%= cart[i].products[n].price %></h6>' +
		'</div>' +
		'</div>' +
		'<span title="从购物车删除此商品" onclick="delThis(<%= cart[i].products[n].id %>,this)" class="glyphicon glyphicon-remove-sign cart-remover"></span>' +
		'</li>' +
		'<% } %>' +
		'</ul>' +
		'</div>' +
		'<% } %>';

	//鼠标hover事件弹出菜单
	function hoverPopup(e,popup) {
		//console.log(e.type);
		if(e.type === 'mouseenter') {
			popup.show();
		} else {
			popup.hide();
		}
	}

	//自动设置工具栏高度
	var resizeTimer = null,
		win = $(window),
		bar = $('#side-toolbar'),
		container = $('#side-container'),
		unfold = $('#side-toolbar-unfold'),
		wh = win.height();
	//container.height(wh);
	//unfold.height(wh - 50);
	$(window).resize(function () {
		if(resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			var wh = win.height();
			//container.height(wh);
			//unfold.height(wh - 50);
			//console.log($(window).height());
		},100)
	});

	//当提示框数量信息数量为0时不显示高亮
	function donNotShow() {
		$('.side-toolbar-tip-num').each(function () {
			var t = $(this);
			if(t.text() === '0' || t.text() === '') {
				t.hide();
			} else {
				t.removeAttr('style');
			}
		});
	}


	//显示及隐藏二维码
	$('.side-toolbar-qrcode').on('hover',function (e) {
		var popup = $(this).find('.side-toolbar-popup');
		hoverPopup(e,popup);
	});


	//点击二维码以外的按钮事件
	$('.side-toolbar-user,.side-toolbar-envelope,.side-toolbar-fav,.side-toolbar-cart,.side-toolbar-survey').on('click',function (e) {
		var that = $(this);
		var top = 'popup-top',bottom = 'popup-bottom';

		if($(this).attr('data-placement') === 'bottom'){
			top = 'popup-bottom';
		}
		//插入模板
		if(that.find('.side-toolbar-popup').length < 1) {
			that.append(popWin);
			var popup = that.find('.side-toolbar-popup');
			//设置箭头靠上还是靠下
			popup.addClass(top);
			//添加内容
			popup.append(popWinCont);
		}
		// 绑定弹出窗口事件
		cilckPopup(e,popup,that);
	});

	//关闭侧面弹出窗口
	$('.side-toolbar-tab').on('click','.side-toolbar-popup-close',function () {
		$(this).parent().remove();
		$('.side-toolbar-tab')[0].stopPropagation();
	});
	//关闭中间弹出窗口
	$('body').on('click','.center-popup-close,.zgg',function () {
		$(this).parent().remove();
	});


	//生成购物车内容
	function generateCont() {
		$.ajax({
			cache:false,
			type:'GET',
			dataType:'json',
			url:'/sell/shopcart.php?action=list',
			success:function (data) {
				var render = template.compile(shoppingCart);
				var html = render(data);
				$('#side-toolbar-unfold').html(html);
				$('#checkout .checkout-total').html('共' + data.total_num + '个商品<span class="pull-right">总价:￥' + data.total_price + '</span>');
				$('#side-toolbar-unfold').find('.side-toolbar-loading').hide();
			}
		});
	}

	//鼠标click事件弹出菜单
	function cilckPopup(e,popup,that) {
		if(login === '') {
			e.preventDefault();
			if(!popup.is(':visible')) {
				popup.show();
				that.on('hover',function (e) {
					//console.log(e.type);
					if(e.type === 'mouseleave') {
						popup.remove();
					}
				});
			}
			//点击购物车
		} else if(that.hasClass('side-toolbar-cart')) {
			var cont = $("#side-container");
			if(cont.hasClass('open')) {
				cont.animate({
					right:'-235px'
				},300,function () {
					$(this).removeClass('open');
					$('.side-toolbar-close').hide();
				});
			} else {
				//第一次载入模板引擎
				if(typeof(template) === 'undefined') {
					$.getScript("/images/flatBlue/js/template-native.js",function () {
						//$.getScript("https://raw.github.com/aui/artTemplate/master/dist/template-native.js",function () {
						generateCont();
					});
				}
				generateCont();
				cont.animate({
					right:'0'
				},300,function () {
					$(this).addClass('open');
					$('.side-toolbar-close').show();
				});
			}

		}
	}

	//点击body关闭侧栏
	$('body,.side-toolbar-close').click(function () {
		var cont = $("#side-container");
		if(cont.hasClass('open')) {
			cont.animate({
				right:'-235px'
			},300,function () {
				$(this).removeClass('open');
				$('.side-toolbar-close').hide();
			});
		}
	});
	$('#side-container').click(function (e) {
		e.stopPropagation();
	});

	//显示购物车数量
	function modCartNum(num) {
		$('.side-toolbar-cart').find('.side-toolbar-tip-num').text(num);
		$('.side-toolbar-cart').find('.side-toolbar-tip').text('购物车 ' + num);
		if(num === '0' || num === '') {
			$('#top-cart').html('购物车');
		} else {
			$('#top-cart').html('购物车(<span style="color:red">' + num + '</span>)');
		}
	}

	//点击删除对应购物车数据
	function delThis(id,obj) {
		$.ajax({
			cache:false,
			type:'GET',
			dataType:'json',
			url:'/sell/shopcart.php?action=del&id=' + id,
			success:function (data) {
				modCartNum(data.total_num);
				generateCont(

				);
				donNotShow();
			}
		});
	}

	//添加到购物车
	function addThis(id,obj) {
		
		if($('.center-popup').length > 0){
		    return false;
		}
		
		if(login === '') {
			
			$('body').append(popWinCenter);
			var popup = $('.center-popup');
			//添加内容
			popup.append(popWinCont);
		} else {
			var step = $("#shopnums").val();
			step || (step = 1);
			$.ajax({
				cache:false,
				type:'GET',
				dataType:'json',
				url:'/sell/shopcart.php?action=add&id=' + id + "&step=" + step,
				success:function (data) {
					modCartNum(data.total_num);
					donNotShow();
					$.ajax({
						type:'GET',
						dataType:'html',
						url:'/sell/shopcart.php?action=addSuccess',
						success:function (html) {
							$('body').append(popWinCenter);
							$('.center-popup').append(html);
						}
					});
				}
			});
		}

	}
	/**验证加入购物车，左边‘立即订购’是否已经登录*/
	function validLogin(){
		if(login === '') {
			$('body').append(popWinCenter);
			var popup = $('.center-popup');
			popup.append(popWinCont);//添加内容
			return false;
		}
		return true;
	}

	//暴露点击删除对应购物车数据事件
	window.delThis = delThis;
	//暴露点击添加对应购物车数据事件
	window.addThis = addThis;
	window.validLogin = validLogin;

	//首次执行当购物车为空时不显示高亮
	donNotShow();

})(window,jQuery);

