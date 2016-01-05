<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015-07-03 13:21
 * Description: 本文件只写入只有两种状态的数组形式
 */
function getStatus($statusCode, $key = '', $postName = '', $type = 0)
{
    $status = array(
        //性别
        'S001' => array(0 => '女', 1 => '男'),
        //菜单是否显示
        'S002' => array(0 => '隐藏', 1 => '显示'),
        //点击菜单打开方式
        'S003' => array(0 => '当前页打开', 1 => '单独窗口打开'),
        'S004' => array(0 => '停用', 1 => '启用'),
        'S005' => array(0 => '未认证', 1 => '已认证'),
        'S006' => array(0 => '未审核', 1 => '审核'),
        'S007' => array(0 => '未推荐', 1 => '推荐'),
        'S008' => array(0 => '无', 1 => '有'),
        'S009' => array(0 => '无效', 1 => '有效'),
        'S010' => array(0 => '否', 1 => '是'),
        'S011' => array(0 => '非涉安', 1 => '涉安'),
        'S012' => array(0 => '未停产', 1 => '已停产'),
        'S013' => array(0 => '未停产', 1 => '已停产'),
        'S014' => array(0 => '下架', 1 => '上架'),  //显示时使用（对应数据库）
        'S015' => array(0 => '禁用', 1 => '正常'),
        'S016' => array(0 => '无效', 1 => '有效'),
        'S017' => array(0 => '增值税普通发票', 1 => '增值税专用发票'),
        'S018' => array(0 => '未发布', 1 => '已发布'),
        'S019' => array(0 => '未确认', 1 => '已确认'),
        'S020' => array(0 => '认证', 1 => '取消认证'),
        'S021' => array(0 => '推荐', 1 => '取消推荐'),
        'S022' => array(0 => '审核', 1 => '取消审核')
    );
    $item = $status[$statusCode];
    if ($type == 1) {
        return "<label class='radio-inline'><input type='radio' value='1' name='{$postName}'>{$item[1]}</label><label class='radio-inline'><input type='radio' value='0' name='{$postName}'>{$item[0]}</label>";
    } elseif ($type == 2) {
        return "<select class='form-control min-width-180' name='{$postName}'><option value='1'>{$item[1]}</option><option value='0'>{$item[0]}</option></select>";
    } else {
        return $item[$key] ? : $item;
    }
}

?>