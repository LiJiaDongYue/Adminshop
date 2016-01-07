<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index(){

        $this->display("index");
    }

    public function right()
    {
    	//获取系统开发信息
    	$system_info=array(

    		//框架版本
    		"thinkphp"=>THINK_VERSION,
    		//php版本
    		"php"=>PHP_VERSION,
    		//真实ip
    		"ip"=>GetIp(),
    		//操作系统
    		"os"=>PHP_OS,
    		//Apache
    		"apache"=>apache_get_version(),
    		);

    	$this->assign('system_info',$system_info);
    	$this->display("right");
    }

    
}


