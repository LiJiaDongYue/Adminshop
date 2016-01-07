<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE>
<html>
<head>
	<meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>通用后台首页</title>
	<link rel="shortcut icon" href="favicon.ico"> 
    <link href="/Public/Common/css/lib/bootstrap.min.css?v=3.3.5" rel="stylesheet">
    <link href="/Public/Common/css/lib/font-awesome.min.css?v=4.4.0" rel="stylesheet">
    <link href="/Public/Common/css/lib/animate.min.css" rel="stylesheet">
    <link href="/Public/Common/css/lib/style.min.css?v=4.0.0" rel="stylesheet">
</head>	
<body class="fixed-sidebar full-height-layout gray-bg" style="overflow:hidden">
    <div id="wrapper">
        <!--加载左边公共菜单栏，利用权限管理-->
        <!--左侧导航开始-->
<nav class="navbar-default navbar-static-side" role="navigation">
    <div class="nav-close"><i class="fa fa-times-circle"></i>
    </div>
    <div class="sidebar-collapse">
        <ul class="nav" id="side-menu">
            <li class="nav-header">
                <div class="dropdown profile-element">
                    <!--后台管理登陆头像，需动态绑定-->
                    <span>
                        <img alt="image" class="img-circle" src="/Public/Admin/images/profile_small.jpg" />
                    </span>
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                        <span class="clear">
                       <span class="block m-t-xs"><strong class="font-bold">LiJiaDongYue</strong></span>
                        <span class="text-muted text-xs block">超级管理员<b class="caret"></b></span>
                        </span>
                    </a>
                    <ul class="dropdown-menu animated fadeInRight m-t-xs">
                        <li><a class="J_menuItem" href="form_avatar.html">修改头像</a>
                        </li>
                        <li><a class="J_menuItem" href="profile.html">个人资料</a>
                        </li>
                        <li><a class="J_menuItem" href="contacts.html">联系我们</a>
                        </li>
                        <li><a class="J_menuItem" href="mailbox.html">信箱</a>
                        </li>
                        <li class="divider"></li>
                        <li><a href="login.html">安全退出</a>
                        </li>
                    </ul>
                </div>
                <div class="logo-element">H+
                </div>
            </li>
            <li>
                <a href="#">
                    <i class="fa fa-home"></i>
                    <span class="nav-label">主页</span>
                    <span class="fa arrow"></span>
                </a>
                <ul class="nav nav-second-level">
                    <li>
                        <a class="J_menuItem" href="index_v1.html" data-index="0">主页示例一</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="index_v2.html">主页示例二</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="index_v3.html">主页示例三</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="index_v4.html">主页示例四</a>
                    </li>
                    <li>
                        <a href="index_v5.html" target="_blank">主页示例五</a>
                    </li>
                </ul>

            </li>
            <li>
                <a class="J_menuItem" href="layouts.html"><i class="fa fa-columns"></i> <span class="nav-label">布局</span></a>
            </li>
            <li>
                <a href="#">
                    <i class="fa fa fa-bar-chart-o"></i>
                    <span class="nav-label">统计图表</span>
                    <span class="fa arrow"></span>
                </a>
                <ul class="nav nav-second-level">
                    <li>
                        <a class="J_menuItem" href="graph_echarts.html">百度ECharts</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_flot.html">Flot</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_morris.html">Morris.js</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_rickshaw.html">Rickshaw</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_peity.html">Peity</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_sparkline.html">Sparkline</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="graph_metrics.html">图表组合</a>
                    </li>
                </ul>
            </li>

            <li>
                <a href="mailbox.html"><i class="fa fa-envelope"></i> <span class="nav-label">信箱 </span><span class="label label-warning pull-right">16</span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="mailbox.html">收件箱</a>
                    </li>
                    <li><a class="J_menuItem" href="mail_detail.html">查看邮件</a>
                    </li>
                    <li><a class="J_menuItem" href="mail_compose.html">写信</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-edit"></i> <span class="nav-label">表单</span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="form_basic.html">基本表单</a>
                    </li>
                    <li><a class="J_menuItem" href="form_validate.html">表单验证</a>
                    </li>
                    <li><a class="J_menuItem" href="form_advanced.html">高级插件</a>
                    </li>
                    <li><a class="J_menuItem" href="form_wizard.html">表单向导</a>
                    </li>
                    <li>
                        <a href="#">文件上传 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="form_webuploader.html">百度WebUploader</a>
                            </li>
                            <li><a class="J_menuItem" href="form_file_upload.html">DropzoneJS</a>
                            </li>
                            <li><a class="J_menuItem" href="form_avatar.html">头像裁剪上传</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">编辑器 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="form_editors.html">富文本编辑器</a>
                            </li>
                            <li><a class="J_menuItem" href="form_simditor.html">simditor</a>
                            </li>
                            <li><a class="J_menuItem" href="form_markdown.html">MarkDown编辑器</a>
                            </li>
                            <li><a class="J_menuItem" href="code_editor.html">代码编辑器</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="suggest.html">搜索自动补全</a>
                    </li>
                    <li><a class="J_menuItem" href="layerdate.html">日期选择器layerDate</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-desktop"></i> <span class="nav-label">页面</span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="contacts.html">联系人</a>
                    </li>
                    <li><a class="J_menuItem" href="profile.html">个人资料</a>
                    </li>
                    <li>
                        <a href="#">项目管理 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="projects.html">项目</a>
                            </li>
                            <li><a class="J_menuItem" href="project_detail.html">项目详情</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="teams_board.html">团队管理</a>
                    </li>
                    <li><a class="J_menuItem" href="social_feed.html">信息流</a>
                    </li>
                    <li><a class="J_menuItem" href="clients.html">客户管理</a>
                    </li>
                    <li><a class="J_menuItem" href="file_manager.html">文件管理器</a>
                    </li>
                    <li><a class="J_menuItem" href="calendar.html">日历</a>
                    </li>
                    <li>
                        <a href="#">博客 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="blog.html">文章列表</a>
                            </li>
                            <li><a class="J_menuItem" href="article.html">文章详情</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="faq.html">FAQ</a>
                    </li>
                    <li>
                        <a href="#">时间轴 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="timeline.html">时间轴</a>
                            </li>
                            <li><a class="J_menuItem" href="timeline_v2.html">时间轴v2</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="pin_board.html">标签墙</a>
                    </li>
                    <li>
                        <a href="#">单据 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="invoice.html">单据</a>
                            </li>
                            <li><a class="J_menuItem" href="invoice_print.html">单据打印</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="search_results.html">搜索结果</a>
                    </li>
                    <li><a class="J_menuItem" href="forum_main.html">论坛</a>
                    </li>
                    <li>
                        <a href="#">即时通讯 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="chat_view.html">聊天窗口</a>
                            </li>
                            <li><a class="J_menuItem" href="webim.html">layIM</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">登录注册相关 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a href="login.html" target="_blank">登录页面</a>
                            </li>
                            <li><a href="login_v2.html" target="_blank">登录页面v2</a>
                            </li>
                            <li><a href="register.html" target="_blank">注册页面</a>
                            </li>
                            <li><a href="lockscreen.html" target="_blank">登录超时</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="404.html">404页面</a>
                    </li>
                    <li><a class="J_menuItem" href="500.html">500页面</a>
                    </li>
                    <li><a class="J_menuItem" href="empty_page.html">空白页</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-flask"></i> <span class="nav-label">UI元素</span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="typography.html">排版</a>
                    </li>
                    <li>
                        <a href="#">字体图标 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li>
                                <a class="J_menuItem" href="fontawesome.html">Font Awesome</a>
                            </li>
                            <li>
                                <a class="J_menuItem" href="glyphicons.html">Glyphicon</a>
                            </li>
                            <li>
                                <a class="J_menuItem" href="iconfont.html">阿里巴巴矢量图标库</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">拖动排序 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="draggable_panels.html">拖动面板</a>
                            </li>
                            <li><a class="J_menuItem" href="agile_board.html">任务清单</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="buttons.html">按钮</a>
                    </li>
                    <li><a class="J_menuItem" href="tabs_panels.html">选项卡 &amp; 面板</a>
                    </li>
                    <li><a class="J_menuItem" href="notifications.html">通知 &amp; 提示</a>
                    </li>
                    <li><a class="J_menuItem" href="badges_labels.html">徽章，标签，进度条</a>
                    </li>
                    <li>
                        <a class="J_menuItem" href="grid_options.html">栅格</a>
                    </li>
                    <li><a class="J_menuItem" href="plyr.html">视频、音频</a>
                    </li>
                    <li>
                        <a href="#">弹框插件 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="layer.html">Web弹层组件layer</a>
                            </li>
                            <li><a class="J_menuItem" href="modal_window.html">模态窗口</a>
                            </li>
                            <li><a class="J_menuItem" href="sweetalert.html">SweetAlert</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">树形视图 <span class="fa arrow"></span></a>
                        <ul class="nav nav-third-level">
                            <li><a class="J_menuItem" href="jstree.html">jsTree</a>
                            </li>
                            <li><a class="J_menuItem" href="tree_view.html">Bootstrap Tree View</a>
                            </li>
                            <li><a class="J_menuItem" href="nestable_list.html">nestable</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="J_menuItem" href="toastr_notifications.html">Toastr通知</a>
                    </li>
                    <li><a class="J_menuItem" href="diff.html">文本对比</a>
                    </li>
                    <li><a class="J_menuItem" href="spinners.html">加载动画</a>
                    </li>
                    <li><a class="J_menuItem" href="widgets.html">小部件</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-table"></i> <span class="nav-label">表格</span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="table_basic.html">基本表格</a>
                    </li>
                    <li><a class="J_menuItem" href="table_data_tables.html">DataTables</a>
                    </li>
                    <li><a class="J_menuItem" href="table_jqgrid.html">jqGrid</a>
                    </li>
                    <li><a class="J_menuItem" href="table_foo_table.html">Foo Tables</a>
                    </li>
                    <li><a class="J_menuItem" href="table_bootstrap.html">Bootstrap Table
                        <span class="label label-danger pull-right">推荐</span></a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-picture-o"></i> <span class="nav-label">相册</span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="basic_gallery.html">基本图库</a>
                    </li>
                    <li><a class="J_menuItem" href="carousel.html">图片切换</a>
                    </li>
                    <li><a class="J_menuItem" href="layerphotos.html">layer相册</a>
                    </li>
                    <li><a class="J_menuItem" href="blueimp.html">Blueimp相册</a>
                    </li>
                </ul>
            </li>
            <li>
                <a class="J_menuItem" href="css_animation.html"><i class="fa fa-magic"></i> <span class="nav-label">CSS动画</span></a>
            </li>
            <li>
                <a href="#"><i class="fa fa-cutlery"></i> <span class="nav-label">工具 </span><span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li><a class="J_menuItem" href="form_builder.html">表单构建器</a>
                    </li>
                </ul>
            </li>

        </ul>
    </div>
</nav>
<!--左侧导航结束-->
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <!--加载右边菜单栏-->
        	<!--右侧头部部分开始-->
<div class="row border-bottom">
    <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
            <form role="search" class="navbar-form-custom" method="post" action="search_results.html">
                <div class="form-group">
                    <!--头部输入框-->
                    <input type="text" placeholder="请输入您需要查找的内容 …" class="form-control" name="top-search" id="top-search">
                </div>
            </form>
        </div>
        <!--消息框-->
        <ul class="nav navbar-top-links navbar-right">
            <li class="dropdown">
                <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                    <i class="fa fa-envelope"></i> <span class="label label-warning">16</span>
                </a>
                <ul class="dropdown-menu dropdown-messages">
                    <li class="m-t-xs">
                        <div class="dropdown-messages-box">
                            <a href="profile.html" class="pull-left">
                                <img alt="image" class="img-circle" src="/Public/Admin/images/a7.jpg">
                            </a>
                            <div class="media-body">
                                <small class="pull-right">46小时前</small>
                                <strong>小四</strong> 这个在日本投降书上签字的军官，建国后一定是个不小的干部吧？
                                <br>
                                <small class="text-muted">3天前 2014.11.8</small>
                            </div>
                        </div>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <div class="dropdown-messages-box">
                            <a href="profile.html" class="pull-left">
                                <img alt="image" class="img-circle" src="/Public/Admin/images/a4.jpg">
                            </a>
                            <div class="media-body ">
                                <small class="pull-right text-navy">25小时前</small>
                                <strong>国民岳父</strong> 如何看待“男子不满自己爱犬被称为狗，刺伤路人”？——这人比犬还凶
                                <br>
                                <small class="text-muted">昨天</small>
                            </div>
                        </div>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <div class="text-center link-block">
                            <a class="J_menuItem" href="mailbox.html">
                                <i class="fa fa-envelope"></i> <strong> 查看所有消息</strong>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="dropdown">
                <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                    <i class="fa fa-bell"></i> <span class="label label-primary">8</span>
                </a>
                <ul class="dropdown-menu dropdown-alerts">
                    <li>
                        <a href="mailbox.html">
                            <div>
                                <i class="fa fa-envelope fa-fw"></i> 您有16条未读消息
                                <span class="pull-right text-muted small">4分钟前</span>
                            </div>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="profile.html">
                            <div>
                                <i class="fa fa-qq fa-fw"></i> 3条新回复
                                <span class="pull-right text-muted small">12分钟钱</span>
                            </div>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <div class="text-center link-block">
                            <a class="J_menuItem" href="notifications.html">
                                <strong>查看所有 </strong>
                                <i class="fa fa-angle-right"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="hidden-xs">
                <a href="index_v1.html" class="J_menuItem" data-index="0"><i class="fa fa-cart-arrow-down"></i> 购买</a>
            </li>
            <li class="dropdown hidden-xs">
                <a class="right-sidebar-toggle" aria-expanded="false">
                    <i class="fa fa-tasks"></i> 主题
                </a>
            </li>
        </ul>
    </nav>
</div>
<div class="row content-tabs">
    <button class="roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i>
    </button>
    <nav class="page-tabs J_menuTabs">
        <div class="page-tabs-content">
            <a href="javascript:;" class="active J_menuTab" data-id="index_v1.html">首页</a>
        </div>
    </nav>
    <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
    </button>
    <div class="btn-group roll-nav roll-right">
        <button class="dropdown J_tabClose" data-toggle="dropdown">关闭操作<span class="caret"></span>

        </button>
        <ul role="menu" class="dropdown-menu dropdown-menu-right">
            <li class="J_tabShowActive"><a>定位当前选项卡</a>
            </li>
            <li class="divider"></li>
            <li class="J_tabCloseAll"><a>关闭全部选项卡</a>
            </li>
            <li class="J_tabCloseOther"><a>关闭其他选项卡</a>
            </li>
        </ul>
    </div>
    <a href="Admin/Public/login.html" class="roll-nav roll-right J_tabExit"><i class="fa fa fa-sign-out"></i> 退出</a>
</div>
<!--右侧头部部分结束-->
            <div class="container" style="padding-top:10px">
    <div class="row">
        <div class="col-md-2">
            <div class="ibox no-margins">
                <div class="ibox-title">
                    <span class="label label-success pull-right">月</span>
                    <h5>浏览量</h5>
                </div>
                <div class="ibox-content">
                    <h1 class="no-margins">386,200</h1>
                    <div class="stat-percent font-bold text-success">98% <i class="fa fa-bolt"></i>
                    </div>
                    <small>总计浏览量</small>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="ibox no-margins">
                <div class="ibox-title">
                    <span class="label label-info pull-right">年</span>
                    <h5>订单</h5>
                </div>
                <div class="ibox-content">
                    <h1 class="no-margins">80,800</h1>
                    <div class="stat-percent font-bold text-info">20% <i class="fa fa-level-up"></i>
                    </div>
                    <small>新订单</small>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="ibox no-margins">
                <div class="ibox-title">
                    <span class="label label-primary pull-right">今天</span>
                    <h5>访问人次</h5>
                </div>
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-md-6">
                            <h1 class="no-margins">&yen; 406,420</h1>
                            <div class="font-bold text-navy">44% <i class="fa fa-level-up"></i> <small>增长较快</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h1 class="no-margins">206,120</h1>
                            <div class="font-bold text-navy">22% <i class="fa fa-level-up"></i> <small>增长较慢</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <h5>今日新增人数</h5>
                    <div class="ibox-tools">
                        <span class="label label-primary">更新</span>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-md-6">
                            <h1 class="no-margins">&yen; 420</h1>
                            <div class="font-bold text-navy">44% <i class="fa fa-level-up"></i> <small>增长较快</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h1 class="no-margins">120</h1>
                            <div class="font-bold text-navy">22% <i class="fa fa-level-down"></i> <small>增长较慢</small>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-8">
            <div class="ibox float-e-margins">
                <div class="ibox-content">
                    <div>
                        <span class="pull-right text-right">
                        <small>在过去的一个月销售的平均值：<strong>山东</strong></small>
                            <br/>
                            所有销售： 162,862
                        </span>
                        <h3 class="font-bold no-margins">
                        半年收入利润率
                    </h3>
                        <small>市场部</small>
                    </div>

                    <div class="m-t-sm">

                        <div class="row">
                            <div class="col-md-8">
                                <div>
                                    <canvas id="lineChart" height="114"></canvas>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <ul class="stat-list m-t-lg">
                                    <li>
                                        <h2 class="no-margins">2,346</h2>
                                        <small>总订单</small>
                                        <div class="progress progress-mini">
                                            <div class="progress-bar" style="width: 48%;"></div>
                                        </div>
                                    </li>
                                    <li>
                                        <h2 class="no-margins ">4,422</h2>
                                        <small>最近一个月订单</small>
                                        <div class="progress progress-mini">
                                            <div class="progress-bar" style="width: 60%;"></div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div class="m-t-md">
                        <small class="pull-right">
                        <i class="fa fa-clock-o"> </i>
                        2015.02.30更新
                    </small>
                        <small>
                        <strong>说明：</strong> 本期销售额比上期增长了23%。
                    </small>
                    </div>

                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <h5>通用后台管理系统</h5>
                </div>
                <div class="ibox-content">
                    <div class="row">
                         <div class="col-xs-4">
                            <small class="stats-label">操作系统</small>
                            <h4>os<?php echo ($system_info['os']); ?></h4>
                        </div>
                        <div class="col-xs-4">
                            <small class="stats-label">服务器版本</small>
                            <h4>Apache<?php echo ($system_info['apache']); ?></h4>
                        </div>
                        <div class="col-xs-4">
                            <small class="stats-label">开发版本</small>
                            <h4>Thinkphp<?php echo ($system_info['thinkphp']); ?></h4>
                        </div>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-xs-4">
                            <small class="stats-label">访问页面 / 浏览量</small>
                            <h4>643 321.10</h4>
                        </div>

                        <div class="col-xs-4">
                            <small class="stats-label">% 新访客</small>
                            <h4>92.43%</h4>
                        </div>
                        <div class="col-xs-4">
                            <small class="stats-label">最后一周</small>
                            <h4>564.554</h4>
                        </div>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-xs-4">
                            <small class="stats-label">访问页面 / 浏览量</small>
                            <h4>436 547.20</h4>
                        </div>

                        <div class="col-xs-4">
                            <small class="stats-label">% 新访客</small>
                            <h4>150.23%</h4>
                        </div>
                        <div class="col-xs-4">
                            <small class="stats-label">最后一周</small>
                            <h4>124.990</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        </div>
         <footer class="main bg-dark-img">
	<section class="copyright">
		<div class="container text-center">
			Copyright@<b><?php echo C('web_url');?></b> all rights reserved <?php echo C('web_record');?> Code © 2014-2015
		</div>
	</section>
</footer> 
<!--
<div class="signup-footer">
    <div style="padding:500px" class="pull-left">
        &copy; 2015 All Rights Reserved. lijiadongyue
    </div>
</div>
-->
    </div>
 	<script src="/Public/Common/js/lib/jquery.min.js?v=2.1.4"></script>
    <script src="/Public/Common/js/lib/bootstrap.min.js?v=3.3.5"></script>
    <script src="/Public/Common/js/lib/plugins/metisMenu/jquery.metisMenu.js"></script>
    <script src="/Public/Common/js/lib/plugins/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="/Public/Common/js/lib/plugins/layer/layer.min.js"></script>
    <script src="/Public/Common/js/lib/hplus.min.js?v=4.0.0"></script>
    <script type="text/javascript" src="/Public/Common/js/lib/contabs.min.js"></script>
    <script src="/Public/Common/js/lib/plugins/pace/pace.min.js"></script>
</body>
</html>