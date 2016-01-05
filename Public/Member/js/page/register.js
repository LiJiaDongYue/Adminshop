function changeCode(obj) {
	if ($.trim(_VerifyURL) == '') {
		return false;
	}
	$("#ChangeCode").attr("src", _VerifyURL + '/' + Math.random());
	return false;
}

$(function() {
	$("#registerForm").validate({
		focusInvalid : true,
		// focusCleanup : true,
		errorElement : 'small',
		errorClass : 'error',		
		success : function(small) {
			small.nextAll().remove();
			small.removeClass('error').addClass('glyphicon glyphicon-ok form-control-feedback').parent().addClass('has-feedback');
		},
		errorPlacement : function(error, element) {
			element.nextAll().remove();
			error.insertAfter(element);
		},
		rules : {
			"username" : {
				required : true,
				maxlength : 20,
				remote : {
					url : '', 			// 后台处理程序
					type : "post"				// 数据发送方式
				}
			},
			"password" : {
				required : true,
				pwd : true
			},
			"password_2" : {
				required : true,
				pwd : true,
				equalTo : "#InputPassword"
			},
			"email" : {
				required : true,
				email : true
			},
			"code" : {
				required : true,
				chrnum : true
			}
		},
		messages : {
			"username" : {
				required : "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
				remote : "该用户名已经被使用，请重新输入"
			},
			"password" : {
				required : "\u8BF7\u8F93\u5165\u5BC6\u7801"
			},
			"password_2" : {
				required : "请再次输入密码",
				equalTo : "两次输入密码不一致"
			},
			"email" : {
				required : "请输入邮箱"
			},
			"code" : {
				required : "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
				chrnum : "请正确输入验证码"
			}
		}
	});
	// 禁止右键弹出菜单
	//	function Fmenu() {
	//		return false;
	//	}
	//	document.oncontextmenu = Fmenu;
	function forbiddenBack(event){
		if (navigator.appName == "Microsoft Internet Explorer") {
			window.history.forward(1);
		} else { // if it is Mozilla than
			window.history.forward(-1);
		}
	}
	//禁止backspace
	function forbiddenBackspace(){
		if (event.keyCode == 8 && event.srcElement.tagName != "INPUT" && event.srcElement.type != "text"){
			event.returnValue = false;
		}
	}
	window.onload = forbiddenBack;
	//window.onkeydown = forbiddenBackspace;
});