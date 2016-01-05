<?php
return array(
	//'配置项'=>'配置值'
	'LOGIN_VERIFY'=>false,
	/* 模板相关配置 */
            'TMPL_PARSE_STRING'     => array(
              '__PUBLIC__'    => __ROOT__ . '/Public/' . MODULE_NAME,
              '__IMG__'       => __ROOT__ . '/Public/' . MODULE_NAME . '/images',
              '__CSS__'       => __ROOT__ . '/Public/' . MODULE_NAME . '/theme',
              '__JS__'        => __ROOT__ . '/Public/' . MODULE_NAME . '/js',
              '__COMMON__'    => __ROOT__ . '/Public/Common',
              '__UPLOAD__'    => __ROOT__ . '/Public/Uploads',
                ),
            /* 后台错误页面模板 */
             'TMPL_ACTION_ERROR'     =>  MODULE_PATH . 'Public/error.html', // 默认错误跳转对应的模板文件
            // 'TMPL_ACTION_SUCCESS'   =>  MODULE_PATH . 'View/Common/success.html', // 默认成功跳转对应的模板文件
            // 'TMPL_EXCEPTION_FILE'   =>  MODULE_PATH . 'View/Common/exception.html',// 异常页面的模板文件
);