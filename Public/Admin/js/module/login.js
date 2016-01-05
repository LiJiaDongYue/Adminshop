/**
 * Created by donkey on 2014/11/13.
 */


define(['module/ajax','module/dialog','validate'],function (ajax,dialog) {

	//-------------- 登录模板 ------------
	var TL_loginForm = '<form id="loginForm">' +
		'<div class="form-group">' +
		'<label for="InputEmail">账号:</label>' +
		'<input type="text" class="form-control" id="InputEmail" name="InputEmail" placeholder="请填入Email或是昵称" required>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="InputPassword">密码:</label>' +
		'<input type="password" class="form-control" id="InputPassword" name="InputPassword" placeholder="请填写您的密码" required>' +
		'</div><hr/>' +
		'<button type="submit" class="btn btn-primary btn-block">点此登录</button> <br/>' +
		'<a href="signup.php" class="pull-right" ><i class="glyphicon glyphicon-circle-arrow-right"></i> 注册</a> <a href="#">忘记密码</a> ' +
		'</form>';

	//-------------- 注册模板 ------------
	var TL_registerForm = '<form id="registerForm"> ' +

		'<div class="form-group">' +
			'<label for="InputUser">手机号:</label>' +
			'<input type="text" class="form-control" id="InputUser" name="InputUser" placeholder="请填入您的手机号" required>' +
		'</div>' +
		'<div class="form-group">' +
			'<label for="InputEmail">短信验证码:</label>' +
			'<div class="input-group">' +
				'<input type="email" class="form-control" id="InputEmail" name="InputEmail" placeholder="请填入验证码" required>' +
				'<span class="input-group-addon">免费发送短信验证码</span>' +
			'</div>' +
		'</div>' +

		'<div class="form-group">' +
			'<label for="InputPassword">密码:</label>' +
			'<input type="password" class="form-control" id="InputPassword" name="InputPassword" placeholder="请填写您的密码" required>' +
		'</div>' +
		'<div class="form-group">' +
			'<label for="js">您的角色:</label> <br/>' +
			'<div class="input-group">' +
				'<label class="radio-inline"> ' +
					'<input type="radio" name="role" id="huozhu" value="1" required> 货主 ' +
				'</label> ' +
				'<label class="radio-inline"> ' +
					'<input type="radio" name="role" id="chezhu" value="2"> 车主 ' +
				'</label> ' +
				'<label class="radio-inline"> ' +
					'<input type="radio" name="role" id="zhongjie" value="3"> 中介 ' +
				'</label>' +
			'</div>' +
		'</div> ' +

		' <hr/>' +
		'<div class="checkbox"> ' +
		'<label>' +
		'<input type="checkbox" name="agree" required> 同意 ' +
		'</label> <a href="http://www.taobao.com/go/chn/member/agreement.php?spm=a2145.7268393.0.0.WodqCL" target="_blank">《服务协议》</a>' +
		'</div>' +
		'<button type="submit" class="btn btn-success btn-block">注册物流网</button> <br/>' +
		'<a href="javascript:" class="pull-right" onclick="dialog.login();"><i class="glyphicon glyphicon-user"></i> 已有账号</a> <a>&nbsp;</a> ' +
		'</form>';

	//当前登录或是注册的状态
	var status;
	var seconds = 29;
	//表单验证
	var Validate = function () {};
	Validate.prototype={
		login:function () {
			$("#loginForm").validate({
				rules:{
					InputPassword:{
						required:true,
						minlength:6,
						maxlength:20
					}
				},
				highlight:function (element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight:function (element) {
					$(element).closest('.form-group').removeClass('has-error');
				},
				errorElement:'small',
				errorClass:'help-block',
				errorPlacement:function (error,element) {
					if(element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				},
				submitHandler:function (form) {
					var username = $(form).find('#InputEmail').val();
					var password = $(form).find('#InputPassword').val();
					var btn = $(form).find('button');
					btn.attr('disabled','disabled').text('登录中...');
					ajax.todo('post','login.jhtml',{username:username,password:password},function (msg) {
						if(msg[0] === 'success') {
							btn.html('<i class="glyphicon glyphicon-ok-circle"></i> 登录成功');
							$('#loginUser').text('欢迎您，'+msg[1]).parent().removeAttr('onclick').attr('data-toggle','dropdown').addClass('loginUser-img-padding');
							$('#loginUser').after('<span class="caret"></span>');
							$('#register').hide();
							setTimeout(function () {
								$('.close').trigger('click');
							},500);
						}else{
							btn.html('<i class="glyphicon glyphicon-exclamation-sign"></i> '+ msg[0]);
							$(form).find('#InputEmail').val('');
							$(form).find('#InputPassword').val('');
							$(form).find('input').on('focus',function () {
								btn.removeAttr('disabled').html('点此登录');
							})
						}
					});
				}
			});
		},
		signup:function () {
			$("#registerForm").validate({
				rules:{
					name: {
		                required: true,
		                minlength: 2,
		                maxlength: 50
		            },
					phoneNum:{
						required:true,
						digits: true,
						rangelength: [11, 11],
						remote:{
							url:"isRegister.jhtml",
							type:"post",
							data:{
								phoneNum:function () {
									return $('#phoneNum').val();
								}
							}
						}
					},
					vCode:{
						required:true,
						remote:{
							url:"isCodeRight.jhtml",
							type:"post",
							data:{
								vCode:function () {
									return $("#vCode").val();
								},phoneNum:function () {
                                    return $('#phoneNum').val();
                                }
							}
						}
					},
					password:{
						required:true,
						minlength:6,
						maxlength:20
					},
					confirm_password: {
						required: true,
						minlength: 6,
						equalTo: "#password"
					},
					role:{
						required:true
					},
					agree:{
						required:true
					}
				},
				messages:{
					phoneNum:{
						remote: $.validator.format("\"{0}\" 此号码已被注册")
					},
					vCode:{
						remote: $.validator.format("验证码错误请重新获取")
					}
				},
				highlight:function (element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight:function (element) {
					$(element).closest('.form-group').removeClass('has-error');
				},
				errorElement:'small',
				errorClass:'help-block',
				errorPlacement:function (error,element) {


					if(element.parent('.input-group').length) {
						element.nextAll().remove();
						error.insertAfter(element.parent());
					}else if(element.parent('.radio-inline').length){
						element.parent().parent().nextAll().remove();
						error.insertAfter(element.parent().parent());
					}else if(element.parent('.checkbox-inline').length){
						element.parent().nextAll().remove();
						error.insertAfter(element.parent());
					}else {
						element.nextAll().remove();
						error.insertAfter(element);
					}

				},
				success: function(small) {
					//var id =  small[0].id;
					small.nextAll().remove();
					small.removeClass('help-block').addClass("glyphicon glyphicon-ok form-control-feedback").parent().addClass('has-feedback');
					if(small[0].id === 'phoneNum-error'){
						$('#getVcode').removeAttr('disabled');
					}

				},
				submitHandler:function (form) {
					var phoneNum = $(form).find('#phoneNum').val();
					var name =  $(form).find('#name').val();
					var vCode = $(form).find('#vCode').val();
					var password = $(form).find('#password').val();
					var role = $(form).find('input[name=role]:checked').val();
					var btn = $(form).find('button');
					btn.attr('disabled','disabled').text('正在提交...');
					ajax.todo('post','registerUser.jhtml',{phoneNum:phoneNum,vCode:vCode,password:password,role:role, name: name},function (msg) {
						if(msg[0] === 'success') {
							btn.html('<i class="glyphicon glyphicon-ok-circle"></i> 注册成功');
							setTimeout(function () {
								//$('.close').trigger('click');
							},1000);
						}else{
							btn.html('<i class="glyphicon glyphicon-exclamation-sign"></i> '+ msg[1]).removeAttr('disabled');
						} 
					});
				}
			});
		},
		getVcode:function () {
			var vc  =  $('#getVcode');
			vc.click(function () {
				var phoneNum = $('#phoneNum').val();
				ajax.todo('post','registerSendCode.jhtml',{phoneNum:phoneNum},function () {
					var s =  seconds;
					$('#phoneNum').attr({disabled:''});
					vc.attr({disabled:''}).html('重发还剩<span id="theTime">'+(seconds+1)+'</span>秒');
					var time = setInterval(begin,1000);
					function begin(){
						$("#theTime").text(seconds);
						seconds--;
						if(seconds < 0){
							window.clearInterval(time);
							$('#phoneNum').removeAttr('disabled');
							vc.removeAttr('disabled').text('重发一次');
							seconds = s;
						}
					}
				})
			})
		}
	};


	return {
        directShowLogin: function (setting){
            //载入登录框
            dialog.popupMy(setting);  //自定义方式
            //dialog.popupBs();    //bootstrap模态

            //弹出框标题和内容
            var mbody = $('#modal-body'), title = $('#modal-title');

            //判断当前是否为登录状态
            /*if(status !== 'login') {
             status = 'login';
             title.text('用户登录');
             mbody.html(TL_loginForm);
             }*/
            title.text('用户登录');
            mbody.html(TL_loginForm);

            //表单验证
            new Validate().login();
        },
		showLogin:function (setting) {
			ajax.todo('checkLogin.jhtml',{action:'checkLogin'},function (msg) {
				if(msg[0] === '0') {




					//载入登录框
					dialog.popupMy(setting);  //自定义方式
					//dialog.popupBs();    //bootstrap模态

					//弹出框标题和内容
					var mbody = $('#modal-body'), title = $('#modal-title');

					//判断当前是否为登录状态
					if(status !== 'login') {
						status = 'login';
						title.text('用户登录');
						mbody.html(TL_loginForm);
					}

					//表单验证
					new Validate().login();
				} else {
					alert('你已经登录哦!!');
				}
			});
		},
		showRegister:function () {
			//载入登录框
			//dialog.popupMy();  //自定义方式
			dialog.popupBs();    //bootstrap模态
			//

			//载入标题和内容
			var mbody = $('#modal-body'),title = $('#modal-title');

			//判断当前是否注册状态
			if(status !== 'register') {
				status = 'register';
				title.text('用户注册');
				mbody.html(TL_registerForm);
			}
			//表单验证
			new Validate().signup();
		},
		Validate : Validate
	}
});
//


