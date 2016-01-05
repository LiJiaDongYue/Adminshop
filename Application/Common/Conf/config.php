            <?php
            return array(
            //'配置项'=>'配置值'
            //数据库配置
            'DB_TYPE'               =>  'mysql',     // 数据库类型
            'DB_HOST'               =>  '127.0.0.1', // 服务器地址
            'DB_NAME'               =>  'adminshop',          // 数据库名
            'DB_USER'               =>  'root',      // 用户名
            'DB_PWD'                =>  '1314520',          // 密码
            'DB_PORT'               =>  '3306',        // 端口
            'DB_PREFIX'             =>  'a_',    // 数据库表前缀
            
            //显示trace信息
            'SHOW_PAGE_TRACE'       =>TRUE,
            
            /* 加载全局参数配置 */
            'LOAD_EXT_FILE'         =>          'dict,status',
            //设置url模式
            'URL_MODEL'             =>  2,       // URL访问模式,可选参数0、1、2、3,代表以下四种模式：
            // 0 (普通模式); 1 (PATHINFO 模式); 2 (REWRITE  模式); 3 (兼容模式)  默认为PATHINFO 模式
            //设置禁止访问的模块列表
            'MODULE_DENY_LIST'      => array('Common','Runtime','Api'),
            //设置允许访问的模块
            'MODULE_ALLOW_LIST'     => array('Home','Admin'),
            
            //邮箱配置
            // 配置邮件发送服务器
            'MAIL_HOST'             =>'smtp.qq.com',//smtp服务器的名称
            'MAIL_SMTPAUTH'         =>TRUE, //启用smtp认证
            'MAIL_USERNAME'         =>'1249319258@qq.com',//你的邮箱名
            'MAIL_FROM'             =>'1249319258@qq.com',//发件人地址
            'MAIL_FROMNAME'         =>'李嘉东岳',//发件人姓名
            'MAIL_PASSWORD'         =>'20LiJia*',//邮箱密码
            'MAIL_CHARSET'          =>'utf-8',//设置邮件编码
            'MAIL_ISHTML'           =>TRUE, // 是否HTML格式邮件
            
            
            
            /* 文件上传相关配置 */
            'ATTACHMENT_UPLOAD'     => array(
            'maxSize'           => 1*1024*1024, //文件上传的大小限制（以字节为单位），0为不限大小
            'rootPath'          => './Public/Uploads/Attachment/', //保存根路径
            'exts'              => 'zip,rar,tar,7z,doc,docx,txt', //允许上传的文件后缀（留空为不限制），使用数组或者逗号分隔的字符串设置，默认为空
            'subName'           => array('date', 'Y-m'), //子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'hash'              => false, //是否生成hash编码
            ), //图片上传相关配置（文件上传配置）
            
            /* 图片上传相关配置 */
            'PICTURE_UPLOAD'        => array(
            'maxSize'           => 1*1024*1024, //文件上传的大小限制（以字节为单位），0为不限大小
            'rootPath'          => './Public/Uploads/Picture/', //保存根路径
            'exts'              => 'jpg,gif,png,jpeg', //允许上传的文件后缀（留空为不限制），使用数组或者逗号分隔的字符串设置，默认为空
            'subName'           => array('date', 'Y-m'), //子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'hash'              => false, //是否生成hash编码
            ), //图片上传相关配置（文件上传配置）
            
            //短信发送配置，云信使，云通讯
            //
            //支付接口
            /* 支付设置 */
            'payment'            => array(
            
            //支付宝
            'alipay'        => array(
            // 收款账号邮箱
            'email'         => 'chenf003@yahoo.cn',
            // 加密key，开通支付宝账户后给予
            'key'           => 'aaa',
            // 合作者ID，支付宝有该配置，
            'partner'       => '2088101000137799'
            ),
            //银联
            'unionpay'      => array(
            'key'           => '88888888',
            'partner'       => '105550149170027'
            ),
            //支付宝wap
            'aliwappay'     => array(
            // 收款账号邮箱
            'email'         => 'chenf003@yahoo.cn',
            // 加密key，开通支付宝账户后给予
            'key'           => 'aaa',
            // 合作者ID，支付宝有该配置，开通易宝账户后给予
            'partner'       => '2088101000137799'
            ),
            //财付通
            'tenpay'        => array(
            // 加密key，开通财付通账户后给予
            'key'           => 'e82573dc7e6136ba414f2e2affbe39fa',
            // 合作者ID，财付通有该配置，开通财付通账户后给予
            'partner'       => '1900000113'
            ),
            //贝宝
            'palpay'        => array(
            'business'      => 'zyj@qq.com'
            ),
            //易付宝
            'yeepay'        => array(
            'key'           => '69cl522AV6q613Ii4W6u8K6XuW8vM1N6bFgyv769220IuYe9u37N4y7rI4Pl',
            'partner'       => '10001126856'
            ),
            //快钱
            'kuaiqian'      => array(
            'key'           => '1234567897654321',
            'partner'       => '1000300079901'
            )
            
            ),
            
            );