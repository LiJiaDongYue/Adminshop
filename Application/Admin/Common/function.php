<?php
/**
 * 后台公共函数
 * @authors LiJiaDongYue (lijiadongyue@gmail.com)
 * @date    2015-11-25 15:18:25
 * @version $Id$
 */

/**
 * 获取用户登录错误信息
 * @param int $status
 * @return miexd <multitype:string , string>
 * @author 
 */
function login_status($k)
{
    $R = array(
        -1 => '请输入用户名或密码',
        -2 => '请输入验证码',
        -3 => '验证码不正确',
        -4 => '用户名或密码错误',
        -5 => '用户不存在或被禁用',
        404 => '对不起，您访问的页面不存在',
    );
    return $R[$k] ? $R[$k] : '';
}

/**
 * 数据签名认证
 * @param  array $data 被认证的数据
 * @return string       签名
 * @author LinHai <LinHai@vip.qq.com>
 */
function data_auth_sign($data)
{
    //数据类型检测
    if (!is_array($data)) {
        $data = (array)$data;
    }
    ksort($data); //排序
    $code = http_build_query($data); //url编码并生成query字符串
    return sha1($code); //生成签名
}
/**
 * @param int $type 0获取当前登录uid，1获取当前登录父uid，2获取当前登录用户类型
 * @return int
 * description:
 */
function is_login($type = 0)
{
    switch ($type) {
        case 0 :
            $type = 'uid';
            break;
        case 1 :
            $type = 'parent_uid';
            break;
        case 2 :
            $type = 'user_type';
            break;
        case 3 :
            $type = 'group_id';
            break;
        case 4 :
            $type = 'username';
            break;
        default:
            $type = 'uid';
    }
    $user = session('CURRENT_USER');

    if (empty($user)) {
        return 0;
    } else {
        return session('CURRENT_USER_SIGN') == data_auth_sign($user) ? $user[$type] : 0;
    }
}
/**
 * 判断是否为时间戳，10位纯数字
 * @param  [type]  $time [description]
 * @return boolean       [description]
 */
function is_timestamp($time){

    //1.字符串strstr strpos可实现，失败返回false
    //2.正则表达式,以^开头 $结尾,{3,10}选取范围
    $pattern_url = "/^[\d]{10}$/";;
    if(preg_match($pattern_url,$time)){
        return true;
    }else{
        return false;
    }
}

/**
 * 返回生成事件时间的差值，默认为距今
 * 可用于订单生成的时间，或者发帖回复等等
 * @param  string $starttime [开始的时间]
 * @param  [type] $endtime   [结束的时间]
 * @return [type]            [距今的时间]
 */
 function diffTime($starttime,$endtime=''){

    if(empty($endtime)){
        //如果为空获取当前的时间戳
        $endtime=time();
    }else{
        if(!is_timestamp($endtime)){
            //把时间转换为时间戳
            $endtime=strtotime($endtime);
        }
    }
    if(!is_timestamp($starttime)){

        $starttime=strtotime($starttime);
    }
    //计算时间戳的差值
    $time=$endtime-$starttime;
    //格式化时间
    //天
    $day = floor($time/3600/24);
    if($day){
        return $day>365 ? floor($day/365)."年前": $day."天前";
    }
    //小时
    $hour = floor(($time%(3600*24))/3600);  //%取余
    if($hour){
        return $hour."小时前";
        }
    //分钟
    $minute = floor(($time%(3600*24))%3600/60);
    if($minute){
        return $minute."分钟前";
    }
    //秒
    $second = floor(($time%(3600*24))%60);
    if($second){
        return $second."秒前";
    }
   
 }