<?php
/**
 * 全局公共函数
 * @authors lijiadongyue (lijiadongyue@gamil.com)
 * @date    2015-12-02 08:53:02
 * @version 1.0
 */

/**
 * 获取用户真实的ip地址
 */
function GetIp(){  
    $realip = '';  
    $unknown = 'unknown';  
    if (isset($_SERVER)){  
        if(isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR']) 
        	&& strcasecmp($_SERVER['HTTP_X_FORWARDED_FOR'], $unknown)){  
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);  
            foreach($arr as $ip){  
                $ip = trim($ip);  
                if ($ip != 'unknown'){  
                    $realip = $ip;  
                    break;  
                }  
            }  
        }else if(isset($_SERVER['HTTP_CLIENT_IP']) && !empty($_SERVER['HTTP_CLIENT_IP']) 
        	&& strcasecmp($_SERVER['HTTP_CLIENT_IP'], $unknown)){  
            $realip = $_SERVER['HTTP_CLIENT_IP'];  
        }else if(isset($_SERVER['REMOTE_ADDR']) && !empty($_SERVER['REMOTE_ADDR']) 
        	&& strcasecmp($_SERVER['REMOTE_ADDR'], $unknown)){  
            $realip = $_SERVER['REMOTE_ADDR'];  
        }else{  
            $realip = $unknown;  
        }  
    }else{  
        if(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), $unknown)){  
            $realip = getenv("HTTP_X_FORWARDED_FOR");  
        }else if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), $unknown)){  
            $realip = getenv("HTTP_CLIENT_IP");  
        }else if(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), $unknown)){  
            $realip = getenv("REMOTE_ADDR");  
        }else{  
            $realip = $unknown;  
        }  
    }  
    $realip = preg_match("/[\d\.]{7,15}/", $realip, $matches) ? $matches[0] : $unknown;  
    return $realip;  
}  
  
/**
 * 新浪的开放API
 * 根据ip定位 地区和网络等等
 * @param string $ip ip address
 */
function GetIpLookup($ip = ''){  
    if(empty($ip)){  
        $ip = GetIp();  
    }  
    
    //百度api
    //$res = @file_get_contents('http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=' . $ip);  
    //新浪api
    $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' . $ip);  
    if(empty($res)){ return false; }  
    $jsonMatches = array();  
    preg_match('#\{.+?\}#', $res, $jsonMatches);  
    if(!isset($jsonMatches[0])){ return false; }  
    $json = json_decode($jsonMatches[0], true);  
    if(isset($json['ret']) && $json['ret'] == 1){  
        $json['ip'] = $ip;  
        unset($json['ret']);  
    }else{  
        return false;  
    }  
    return $json;  
}  

/**
 * 格式化时间
 * @param  [type] $time 默认为当前时间
 * @return [type]       
 */
function format_date($time=''){
	if(empty($time)){
		$time=time();
	}
	return date("Y-m-d H:i:s",$time);
}

/**
 * 邮件发送
 * @param  [type] $to      收件人邮箱
 * @param  [type] $title   邮件标题
 * @param  [type] $content 邮件内容
 * @return [type]          发送状态
 */
function sendMail($to, $subject, $body, $name='', $attachment = null) {
     
    Vendor('PHPMailer.PHPMailerAutoload');     
    $mail = new PHPMailer(); //实例化
    $mail->IsSMTP(); // 启用SMTP
    $mail->Host=C('MAIL_HOST'); //smtp服务器的名称（这里以QQ邮箱为例）
    $mail->SMTPDebug=C('MAIL_SMTPDebug'); //开启SMTP调试信息
    $mail->SMTPAuth = C('MAIL_SMTPAUTH'); //启用smtp认证
   // $mail->SMTPSecure=C('MAIL_SMTPSecure'); //启用安全协议 ssl
    $mail->Username = C('MAIL_USERNAME'); //你的邮箱名
    $mail->Password = C('MAIL_PASSWORD') ; //邮箱密码
    $mail->From = C('MAIL_FROM');       //发件人地址（也就是你的邮箱地址）
    $mail->FromName = C('MAIL_FROMNAME'); //发件人姓名
    if(empty($name)){
        $name=$to;
    }
    $mail->AddAddress($to,"尊敬的".$name."用户:");       //收件人地址和名称
    $mail->WordWrap = 50;               //设置每行字符长度
    $mail->IsHTML(C('MAIL_ISHTML'));    // 是否HTML格式邮件
    $mail->CharSet=C('MAIL_CHARSET');   //设置邮件编码
    $mail->Subject =$subject;           //邮件主题
    //$mail->Body = $body;             //邮件内容
    $mail->MsgHTML($body);
    $mail->AltBody = "这是一个纯文本的身体在非营利的HTML电子邮件客户端"; //邮件正文不支持HTML的备用显示

    if(is_array($attachment)){ // 添加附件
        foreach ($attachment as $file){
            is_file($file) && $mail->AddAttachment($file);
            echo "$file";
        }
    }
    //$mail->addAttachment("./Public/Uploads/Picture/1/2015-11/1.jpg");
    return $mail->Send() ? true : $mail->ErrorInfo;

    }


/**
 * @param $table 下载的table
 * @param $map 查询条件
 * @param $urlField url地址字段
 * @param string $fileNameField 名称字段
 * @return array
 * description: download('sys_product_renzheng_set',array('id'=>I('id')),'rz_pic','renzheng_name');
 */
function download($table, $map, $urlField, $fileNameField = 'name')
{
    /* 获取下载文件信息 */
    $file = M($table)->where($map)->find();

    if (!$file || empty($file[$urlField]) || !file_exists(ROOT_PATH . $file[$urlField])) {
        return array('status' => 0, 'info' => '文件不存在！');
    }
    if (is_file(ROOT_PATH . $file[$urlField])) {

        /* 执行下载 */ //TODO: 大文件断点续传
        //文件扩展
        $fileType = pathinfo($file[$urlField], PATHINFO_EXTENSION);

        header("Content-Description: File Transfer");
        header('Content-type: "' . getFileMimeMapping($fileType) + '"');
        header('Accept-Length: "' . filesize(ROOT_PATH . $file[$urlField]) + '"');

        if (preg_match('/MSIE/', $_SERVER['HTTP_USER_AGENT'])) { //for IE
            header('Content-Disposition: attachment; filename="' . rawurlencode($file[$fileNameField]) . '.' . $fileType . '"');
        } else {
            header('Content-Disposition: attachment; filename="' . $file[$fileNameField] . '.' . $fileType . '"');
        }
        if (!readfile(ROOT_PATH . $file[$urlField])) {
            return array('status' => 0, 'info' => '文件读取失败！');
        }
        exit;
    } else {
        return array('status' => 0, 'info' => '文件已被删除！');
    }
}

/**
 * @param $type
 * @return string
 * description:文件MIME类型
 * zip,rar,tar,7z,doc,docx,txt
 */
function getFileMimeMapping($type)
{
    if ($type === 'doc') {
        return 'application/msword';
    } elseif ($type === 'docx') {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } elseif ($type === 'zip') {
        return 'application/zip';
    } elseif ($type === '7z') {
        return 'application/x-7z-compressed';
    } elseif ($type === 'rar') {
        return 'application/x-rar-compressed';
    } elseif ($type === 'tar') {
        return 'application/x-tar';
    } elseif ($type === 'jpeg') {
        return 'image/jpeg';
    } elseif ($type === 'jpg') {
        return 'image/jpeg';
    } elseif ($type === 'png') {
        return 'image/png';
    } elseif ($type === 'txt') {
        return 'text/plain';
    }
}

/**
 * 上传
 * @param $files ，通常是 $_FILES数组,只能是单个
 * @param $config 数组 array('savePath'=>'文件保存路径，相对根目录Uploads');
 * @param $type 1:上传图片，2:上传附件
 * @return array
 */
function upload($files, $config, $type = 1)
{
    if ($type == 1) {
        $setting = array_merge(C('PICTURE_UPLOAD'), $config);//获取图片配置
    } elseif ($type == 2) {
        $setting = array_merge(C('ATTACHMENT_UPLOAD'), $config);//获取附件配置
    }

    //上传操作句柄
    $uploader = new \Think\Upload($setting);
    //返回图片路径，多个则返回数组
    $info = $uploader->upload($files);
    if ($info) { //文件上传成功，记录文件信息
        foreach ($info as $key => $value) {
            /* 记录文件信息 */
            $names = explode('.', $value['name']);
            $saveNames = explode('.', $value['savename']);
            $fileInfo[] = array(
                'name' => $names[0],
                'saveName' => $saveNames[0],
                'type' => $value['type'],
                'ext' => $value['ext'],
                'path' => substr($setting['rootPath'], 2) . $value['savepath'] . $value['savename'] //在模板里的url路径
            );
        }
        return array('status' => 1, 'info' => '上传成功', 'data' => count($fileInfo) == 1 ? $fileInfo[0] : $fileInfo);//文件上传成功
    } else {
        return array('status' => 0, 'info' => $uploader->getError(), 'data' => '');
    }
}

/**
 * @param $file array(
 * 'path'=>,    //必填
 * 'width'=>,   //必填
 * 'height'=>,''//必填
 * 'fontSize'=>,''//默认是20
 * 'fontColor'=>,''//默认是黑色
 * 'logo'  => ''， //若为添加图片水印，必填,可改为默认是logo
 * 'text'  => ''， //若为添加文字水印，必填,可改为默认是域名
 * 'waterPos'  => ''， //水印的位置
 * );
 * @param $image
 * @param int $type
 * description: 裁剪图片
 */
function cut($file, $image, $type = 0)
{//图片裁剪
    //将图片裁剪为并保存
    $image->crop($file['width'], $file['height'])->save(ROOT_PATH . $file['path']);
    if ($type == 1) {//裁剪后添加图片水印
        $image->water($file['logo'], $file['waterPos'] ?: 9)->save(ROOT_PATH . $file['path']);
    } elseif ($type == 2) {//裁剪后添加文字水印
        //字体路径
        $ttf = COMMON_PATH . 'Font/font.ttf';
        //字体大小
        $fontSize = $file['fontSize'] ?: 20;
        //字体颜色
        $fontColor = $file['fontColor'] ?: '#000000';
        $image->text($file['text'], $ttf, $fontSize, $fontColor, $file['waterPos'] ?: 9)->save(ROOT_PATH . $file['path']);
    }
}

/**
 * @param $file array(
 * 'path'=>,    //必填
 * 'width'=>,   //必填
 * 'height'=>,''//必填
 * 'fontSize'=>,''//默认是20
 * 'fontColor'=>,''//默认是黑色
 * 'logo'  => ''， //若为添加图片水印，默认是logo
 * 'text'  => ''， //若为添加文字水印，默认是域名
 * 'thumbPos'  => ''， //缩放的位置
 * 'waterPos'  => ''， //水印的位置
 * );
 * @param $image
 * @param int $type 0:生成缩略图, 1:生成缩略图后添加图片水印，2:生成缩略图后添加文字水印
 * description:生成缩略图
 */
function thumb($file, $image, $type = 0)
{
    //按照原图的比例生成缩略图并保存
    $image->thumb($file['width'], $file['height'], $file['thumbPos'] ?: 6)->save(ROOT_PATH . $file['path']);
    if ($type == 1) {//生成缩略图后添加图片水印
        $image->water($file['logo'], $file['waterPos'] ?: 9)->save(ROOT_PATH . $file['path']);
    } elseif ($type == 2) {//生成缩略图后添加文字水印
        //字体路径
        $ttf = COMMON_PATH . 'Font/font.ttf';
        //字体大小
        $fontSize = $file['fontSize'] ?: 20;
        //字体颜色
        $fontColor = $file['fontColor'] ?: '#000000';
        $image->text($file['text'], $ttf, $fontSize, $fontColor, $file['waterPos'] ?: 9)->save(ROOT_PATH . $file['path']);
    }
}

/**
 * @param array $file 文件数组
 * @param int $type 0:生成缩略图, 1:生成缩略图后添加图片水印，2:生成缩略图后添加文字水印
 * @param array $pixes 裁剪的尺寸
 * @param $del 是否删除原图片
 * @return bool
 * description:
 */
function assign_thumb($file = array(), $type = 0, $pixes = array(100, 300, 500), $del = false)
{
    if (!$file['path'] || !file_exists(ROOT_PATH . $file['path'])) {
        return false;
    }
    $image = new \Think\Image();
    //图片原名称
    $fileName = pathinfo($file['path'], PATHINFO_FILENAME);
    foreach ($pixes as $pix) {
        $image->open(ROOT_PATH . $file['path']);
        //生成新文件名称
        $targetFileName = $fileName . "_$pix";
        //新路径名称
        $targetPath = str_replace($fileName, $targetFileName, $file['path']);
        //按照原图的比例生成缩略图并保存
        $image->thumb($file['width'] ?: $pix, $file['height'] ?: $pix, $file['thumbPos'] ?: 6)->save(ROOT_PATH . $targetPath);
        if ($type == 1) {//生成缩略图后添加图片水印
            $image->water($file['logo'], $file['waterPos'] ?: 9)->save(ROOT_PATH . $targetPath);
        } elseif ($type == 2) {//生成缩略图后添加文字水印
            //字体路径
            $ttf = COMMON_PATH . 'Font/font.ttf';
            //字体大小
            $fontSize = $file['fontSize'] ?: 20;
            //字体颜色
            $fontColor = $file['fontColor'] ?: '#000000';
            $image->text($file['text'] ?: C('web_url'), $ttf, $fontSize, $fontColor, $file['waterPos'] ?: 9)->save(ROOT_PATH . $targetPath);
        }
    }
    if ($del) {
        @unlink(ROOT_PATH . $file['path']);
    }
}

/**
 * @param array $file
 * description: 图片操作
 */
function imageHandle($file = array(), $type)
{
    if (!$file['path'] || !file_exists(ROOT_PATH . $file['path'])) {
        return false;
    }
    $image = new \Think\Image();
    $image->open(ROOT_PATH . $file['path']);

    switch ($type) {
        case 1 : // 图片裁剪
            cut($file, $image);
            break;
        case 2 : // 生成缩略图
            thumb($file, $image);
            break;
        case 3 : // 添加图片水印
            if (!$file['logo'] || !file_exists(ROOT_PATH . $file['logo'])) {
                $file['logo'] = ROOT_PATH . 'Public/Common/images/water.png';//默认水印图片
            }
            $image->water($file['logo'], $file['waterPos'] ?: 1)->save(ROOT_PATH . $file['path']);
            break;
        case 4 : // 添加文字水印
            //字体路径
            $ttf = COMMON_PATH . 'Font/font.ttf';
            //字体大小
            $fontSize = $file['fontSize'] ?: 20;
            //字体颜色
            $fontColor = $file['fontColor'] ?: '#000000';
            if (empty($file['text'])) {
                $file['text'] = C('WEB_URL');//默认的水印文字
            }
            $image->text($file['text'], $ttf, $fontSize, $fontColor, $file['waterPos'] ?: 1)->save(ROOT_PATH . $file['path']);
            break;
        case 5 : //裁剪后添加图片水印
            if (!$file['logo'] || !file_exists(ROOT_PATH . $file['logo'])) {
                $file['logo'] = ROOT_PATH . 'Public/Common/images/water.png';//默认水印图片
            }
            cut($file, $image, 1);
            break;
        case 6 : //裁剪后添加文字水印
            if (empty($file['text'])) {
                $file['text'] = C('WEB_URL');//默认的水印文字
            }
            cut($file, $image, 2);
            break;
        case 7 : //生成缩略图后添加图片水印
            if (!$file['logo'] || !file_exists(ROOT_PATH . $file['logo'])) {
                $file['logo'] = ROOT_PATH . 'Public/Common/images/water.png';//默认水印图片
            }
            thumb($file, $image, 1);
            break;
        case 8 : //生成缩略图后添加文字水印
            if (empty($file['text'])) {
                $file['text'] = C('WEB_URL');//默认的水印文字
            }
            thumb($file, $image, 2);
            break;
        default:
            return false;
    }
}

/**
 * 判断用户使用的浏览器，可做统计使用,垃圾
 * @return [type] [使用的浏览器]
 */
function userBrowser() { 
    $user_OSagent = $_SERVER['HTTP_USER_AGENT']; 
 
    if (strpos($user_OSagent, "Maxthon") && strpos($user_OSagent, "MSIE")) { 
        $visitor_browser = "Maxthon(Microsoft IE)"; 
    } elseif (strpos($user_OSagent, "Maxthon 2.0")) { 
        $visitor_browser = "Maxthon 2.0"; 
    } elseif (strpos($user_OSagent, "Maxthon")) { 
        $visitor_browser = "Maxthon"; 
    } elseif (strpos($user_OSagent, "MSIE 9.0")) { 
        $visitor_browser = "MSIE 9.0"; 
    } elseif (strpos($user_OSagent, "MSIE 8.0")) { 
        $visitor_browser = "MSIE 8.0"; 
    } elseif (strpos($user_OSagent, "MSIE 7.0")) { 
        $visitor_browser = "MSIE 7.0"; 
    } elseif (strpos($user_OSagent, "MSIE 6.0")) { 
        $visitor_browser = "MSIE 6.0"; 
    } elseif (strpos($user_OSagent, "MSIE 5.5")) { 
        $visitor_browser = "MSIE 5.5"; 
    } elseif (strpos($user_OSagent, "MSIE 5.0")) { 
        $visitor_browser = "MSIE 5.0"; 
    } elseif (strpos($user_OSagent, "MSIE 4.01")) { 
        $visitor_browser = "MSIE 4.01"; 
    } elseif (strpos($user_OSagent, "MSIE")) { 
        $visitor_browser = "MSIE 较高版本"; 
    } elseif (strpos($user_OSagent, "NetCaptor")) { 
        $visitor_browser = "NetCaptor"; 
    } elseif (strpos($user_OSagent, "Netscape")) { 
        $visitor_browser = "Netscape"; 
    } elseif (strpos($user_OSagent, "Chrome")) { 
        $visitor_browser = "Chrome"; 
    } elseif (strpos($user_OSagent, "Lynx")) { 
        $visitor_browser = "Lynx"; 
    } elseif (strpos($user_OSagent, "Opera")) { 
        $visitor_browser = "Opera"; 
    } elseif (strpos($user_OSagent, "Konqueror")) { 
        $visitor_browser = "Konqueror"; 
    } elseif (strpos($user_OSagent, "Mozilla/5.0")) { 
        $visitor_browser = "Mozilla"; 
    } elseif (strpos($user_OSagent, "Firefox")) { 
        $visitor_browser = "Firefox"; 
    } elseif (strpos($user_OSagent, "U")) { 
        $visitor_browser = "Firefox"; 
    } else { 
        $visitor_browser = "其它"; 
    } 
    return $visitor_browser; 
}

