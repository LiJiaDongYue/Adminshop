<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index(){

    	//内网测试获取到的ip始终为127.0.0.1
		$ip=GetIp();
		$this->show($ip);
		// $Ip = new \Org\Net\IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
		// $area = $Ip->getlocation(); // 获取某个IP地址所在的位置
		//测试本机ip成功117.135.212.28
		dump(GetIpLookup('117.135.212.28'));
		//dump($_SERVER);
        //$this->assign('area',$area);
        //$this->show(phpinfo());
        
        dump($_SERVER['REMOTE_ADDR']);
        $firsttime=time();
       // dump(DiffDate($firsttime)) ;
        //$one = strtotime('1449021067');//开始时间 时间戳
        $tow = strtotime('2015-12-1 00:00:00');//结束时间 时间戳
        dump(diffTime("2015-12-1 00:00:00")) ;
        echo userBrowser();
    //     $ch = curl_init();
    //     $url = 'http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=117.89.35.58';
    //     $header = array(
    //         'apikey: 您自己的apikey',
    //     );
    //     // 添加apikey到header
    //     curl_setopt($ch, CURLOPT_HTTPHEADER  , $header);
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //     // 执行HTTP请求
    //     curl_setopt($ch , CURLOPT_URL , $url);
    //     $res = curl_exec($ch);

    // var_dump(json_decode($res));
        $this->display("index");
    }

    public function add(){    

       // dump($_FILES['attachment']);
       // 测试图片上传
       // 处理不同的管理角色上传
        // $uid=1;
        // //测试附件信息
        // if ($_FILES['attachment']['name']) {//存在图片
        //     //!empty($old_logo_url) && @unlink(ROOT_PATH . $old_logo_url);
        //     $file = array(
        //         'name' => $_FILES['attachment']['name'],
        //         'type' => $_FILES['attachment']['type'],
        //         'tmp_name' => $_FILES['attachment']['tmp_name'],
        //         'error' => $_FILES['attachment']['error'],
        //         'size' => $_FILES['attachment']['size'],
        //     );
        //     $info = upload(array($file), array('savePath' => $uid.'/'), 1);
        //     dump($info);
        //     if($info['status']){
        //         $picPath = $info['data']['path'];

        //         //压缩图片成1000X10000
        //         assign_thumb(array_merge($info['data'],array('thumbPos'=>1)), 0, array(300));
        //         //原图片
        //         $item['s_1000_pic'] = $picPath;
        //         //图片保存名称
        //         $saveName = $info['data']['saveName'];

        //         //图片300*300像素
        //         $item['s_300_pic'] = str_replace($saveName, $saveName . '_300', $picPath);
        //         if($info['status'] == 1){
        //             $pDB['logo_url'] = $item['s_300_pic'];//图片地址
        //             @unlink(ROOT_PATH . $info['data']['path']);

        //         }
        //     }
        // }else{
        //     $pDB['logo_url'] = $old_logo_url;//图片地址
        // }//end  logo图片
        // dump ($pDB['logo_url']);

        //测试邮件发送
        if(sendMail($_POST['mail'],$_POST['title'],$_POST['content'],'小金',$_FILES['attachment']))
            $this->success('发送成功！');
        else
           $this->error('发送失败');
    }
}


