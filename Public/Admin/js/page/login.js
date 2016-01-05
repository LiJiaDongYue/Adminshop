//验证码
function changeCode(obj) {
	if ($.trim(_VerifyURL) == '') {
		return false;
	}
	$("#ChangeCode").attr("src", _VerifyURL + '/' + Math.random());
	return false;
}
//登录提交函数
$(function() {
	$("#loginForm").validate({
		focusInvalid : true,
		// focusCleanup : true,
		// errorElement : 'small',
		// errorClass : 'error',
		// success : function(small) {
		// 	small.nextAll().remove();
		// 	small.removeClass('error').addClass('glyphicon glyphicon-ok form-control-feedback').parent().addClass('has-feedback');
		// },
		// errorPlacement : function(error, element) {
		// 	if (element.parent('.input-group').length) {
		// 		element.nextAll().remove();
		// 		error.insertAfter(element.parent());
		// 	} else if (element.parent('.radio-inline').length) {
		// 		element.parent().parent().nextAll().remove();
		// 		error.insertAfter(element.parent().parent());
		// 	} else if (element.parent('.checkbox-inline').length) {
		// 		element.parent().nextAll().remove();
		// 		error.insertAfter(element.parent());
		// 	} else {
		// 		element.nextAll().remove();
		// 		error.insertAfter(element);
		// 	}
		// },
		rules : {
			"username" : {
				required : true,
				maxlength : 15
			},
			"password" : {
				required : true
			},
			"code" : {
				required : true,
				chrnum : true
			}
		},
		messages : {
			"username" : {
				required : "\u8BF7\u8F93\u5165\u7528\u6237\u540D"
			},
			"password" : {
				required : "\u8BF7\u8F93\u5165\u5BC6\u7801"
			},
			"code" : {
				required : "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
				chrnum : "请正确输入验证码"
			}
		},
		submitHandler : function(form) {
			if ($.trim(_LoginURL) == '') {
				return false;
			}
			var _InputUsername = $(form).find('#InputUsername');
			var _InputPassword = $(form).find('#InputPassword');
			var _InputCode = $(form).find('#InputCode');
			var btn = $(form).find('#LoginButton');
			btn.attr('disabled','disabled').html('\u767B\u5F55\u4E2D...');
			$.ajax({
				type : 'post',
				dataType : 'json',
				url : _LoginURL,
				data : {
					//密码加密传输
					username : $.trim(_InputUsername.val()),
					password : BASE64.encode(faultylabs.MD5($.trim(_InputPassword.val()))),
					code : BASE64.encode($.trim(_InputCode.val()))
				},
				success : function(resp) {
					if(!resp) return false;
					if(resp.status > 0 && resp.url){// R
						btn.html('<i class="glyphicon glyphicon-ok-circle"></i> \u767B\u5F55\u6210\u529F');
						window.top.location.href = resp.url;
					} else {
						if(resp.flush === true){
							_InputCode.val('');
							_InputCode.next('small').removeClass('glyphicon glyphicon-ok');
							changeCode();
							btn.removeAttr('disabled').html('\u767B \u5F55');
						}
						var hasError = resp.status < 0 ? $(resp.info.small()).addClass('error') : '';
						if(resp.status === -1){
							//_InputUsername.nextAll().remove();
							_InputUsername.after(hasError);
						} else if($.inArray(resp.status,new Array(-2,-3)) !== -1){
							//_InputCode.nextAll().remove();
							_InputCode.after(hasError);
						} else if($.inArray(resp.status,new Array(-4,-5)) !== -1){
							//_InputUsername.nextAll().remove();
							_InputUsername.after(hasError);
						} else if(resp.status === 404){
							alert(resp.info);
						}
					}
				}
			});
		}
	});
	
	// function forbiddenBack(event){
	// 	if (navigator.appName == "Microsoft Internet Explorer") {
	// 		window.history.forward(1);
	// 	} else { // if it is Mozilla than
	// 		window.history.forward(-1);
	// 	}   
	// }
	//window.onload = forbiddenBack;
});