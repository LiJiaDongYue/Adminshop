<?php
/**
 * 后台公共控制器
 * @authors lijia  (lijiadongyue@gmail.com)
 * @date    2015-11-24 09:31:01
 * @version 1.0
 */

namespace Admin\Controller;
use Think\Controller;
class PublicController extends Controller {
    
   //404错误页面
   public function error(){

   		$this->display("error");
   }

   /**
    * 登录首页
    * @return [type] [description]
    */
    public function index(){

    	$this->display("login");
    }

    /**
     * ajax返回
     * @param  [type]  $status      状态
     * @param  boolean $flush       [description]
     * @param  string  $redirectURL 重定向地址
     * @return [type]               [description]
     */
    private function retAjax($status, $flush = true, $redirectURL = '')
    {
        $this->ajaxReturn(array(
            "status" => $status,
            "info" => login_status($status),
            "flush" => $flush,
            "url" => $redirectURL
        ), 'json');
    }

    public function login(){

    	//非ajax传入攻击
    	if(!IS_AJAX){
    		$this->error("404error",U('Admin/Public/index'));
    	}
    	//获取登录用户信息
    	$_Username = trim(I('username'));
        $_EncodePassword = trim(I('password'));
        $_EncodeCode = trim(I('code'));

     	$status = D('Member')
 			->login($_Username, $_EncodePassword, $_EncodeCode, C('LOGIN_VERIFY'));
        if (in_array($status, array(-1, -2))) {
            $this->retAjax($status, false);
        } elseif (in_array($status, array(-3, -4, -5))) {
            $this->retAjax($status);
        } else {
            $this->retAjax($status, false, U('Admin/Index/index', '', true));
        }
    }

    
}
