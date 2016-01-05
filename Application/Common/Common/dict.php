<?php
function getSysDict($dict_no){
$dict=array (
  'D01' => 
  array (
    'dict_no' => 'D01',
    'dict_name' => '六大系统建设情况',
    'child' => 
    array (
      'D0101' => 
      array (
        'detail_no' => 'D0101',
        'detail_name' => '监测监控',
      ),
      'D0102' => 
      array (
        'detail_no' => 'D0102',
        'detail_name' => '人员定位',
      ),
      'D0103' => 
      array (
        'detail_no' => 'D0103',
        'detail_name' => '通讯联络',
      ),
      'D0104' => 
      array (
        'detail_no' => 'D0104',
        'detail_name' => '紧急避险',
      ),
      'D0105' => 
      array (
        'detail_no' => 'D0105',
        'detail_name' => '压风自救',
      ),
      'D0106' => 
      array (
        'detail_no' => 'D0106',
        'detail_name' => '供水施救',
      ),
    ),
  ),
  'D02' => 
  array (
    'dict_no' => 'D02',
    'dict_name' => '企业类型',
    'child' => 
    array (
      'D0201' => 
      array (
        'detail_no' => 'D0201',
        'detail_name' => '非集团公司',
      ),
      'D0202' => 
      array (
        'detail_no' => 'D0202',
        'detail_name' => '厂家集团公司',
      ),
      'D0203' => 
      array (
        'detail_no' => 'D0203',
        'detail_name' => '煤矿集团公司',
      ),
    ),
  ),
  'D03' => 
  array (
    'dict_no' => 'D03',
    'dict_name' => '企业图集类型',
    'child' => 
    array (
      'D0301' => 
      array (
        'detail_no' => 'D0301',
        'detail_name' => '企业证书图集',
      ),
      'D0302' => 
      array (
        'detail_no' => 'D0302',
        'detail_name' => '企业风采图集',
      ),
      'D0303' => 
      array (
        'detail_no' => 'D0303',
        'detail_name' => '其它图集',
      ),
    ),
  ),
  'D04' => 
  array (
    'dict_no' => 'D04',
    'dict_name' => '我的计划单中数据类型',
    'child' => 
    array (
      'D0401' => 
      array (
        'detail_no' => 'D0401',
        'detail_name' => '添加到计划单',
      ),
      'D0402' => 
      array (
        'detail_no' => 'D0402',
        'detail_name' => '立即订购',
      ),
    ),
  ),
  'D0501' => 
  array (
    'dict_no' => 'D0501',
    'dict_name' => '主要煤种',
    'child' => 
    array (
      'D050101' => 
      array (
        'detail_no' => 'D050101',
        'detail_name' => '无烟煤',
      ),
      'D050102' => 
      array (
        'detail_no' => 'D050102',
        'detail_name' => '烟煤',
      ),
      'D050103' => 
      array (
        'detail_no' => 'D050103',
        'detail_name' => '焦煤',
      ),
    ),
  ),
  'D0506' => 
  array (
    'dict_no' => 'D0506',
    'dict_name' => '运输方式',
    'child' => 
    array (
      'D050601' => 
      array (
        'detail_no' => 'D050601',
        'detail_name' => '轨道',
      ),
      'D050602' => 
      array (
        'detail_no' => 'D050602',
        'detail_name' => '皮带',
      ),
      'D050603' => 
      array (
        'detail_no' => 'D050603',
        'detail_name' => '皮带/轨道',
      ),
    ),
  ),
  'D0508' => 
  array (
    'dict_no' => 'D0508',
    'dict_name' => '煤矿状态',
    'child' => 
    array (
      'D050801' => 
      array (
        'detail_no' => 'D050801',
        'detail_name' => '正常生产',
      ),
      'D050802' => 
      array (
        'detail_no' => 'D050802',
        'detail_name' => '技改',
      ),
      'D050803' => 
      array (
        'detail_no' => 'D050803',
        'detail_name' => '停产',
      ),
      'D050804' => 
      array (
        'detail_no' => 'D050804',
        'detail_name' => '正常建设',
      ),
      'D050805' => 
      array (
        'detail_no' => 'D050805',
        'detail_name' => '停产整改',
      ),
      'D050806' => 
      array (
        'detail_no' => 'D050806',
        'detail_name' => '待证',
      ),
      'D050807' => 
      array (
        'detail_no' => 'D050807',
        'detail_name' => '其他原因停产',
      ),
      'D050808' => 
      array (
        'detail_no' => 'D050808',
        'detail_name' => '停产整顿',
      ),
      'D050809' => 
      array (
        'detail_no' => 'D050809',
        'detail_name' => '正式试运转',
      ),
      'D0508010' => 
      array (
        'detail_no' => 'D0508010',
        'detail_name' => '停建整改',
      ),
      'D0508011' => 
      array (
        'detail_no' => 'D0508011',
        'detail_name' => '停止试运转',
      ),
      'D0508012' => 
      array (
        'detail_no' => 'D0508012',
        'detail_name' => '未生产',
      ),
      'D0508013' => 
      array (
        'detail_no' => 'D0508013',
        'detail_name' => '政策性停建',
      ),
      'D0508014' => 
      array (
        'detail_no' => 'D0508014',
        'detail_name' => '技改建设',
      ),
      'D0508015' => 
      array (
        'detail_no' => 'D0508015',
        'detail_name' => '自行停产',
      ),
    ),
  ),
  'D0509' => 
  array (
    'dict_no' => 'D0509',
    'dict_name' => '开拓方式',
    'child' => 
    array (
      'D050901' => 
      array (
        'detail_no' => 'D050901',
        'detail_name' => '斜井',
      ),
      'D050902' => 
      array (
        'detail_no' => 'D050902',
        'detail_name' => '立井',
      ),
      'D050903' => 
      array (
        'detail_no' => 'D050903',
        'detail_name' => '平峒',
      ),
      'D050904' => 
      array (
        'detail_no' => 'D050904',
        'detail_name' => '混合',
      ),
      'D050905' => 
      array (
        'detail_no' => 'D050905',
        'detail_name' => '斜坡道',
      ),
      'D050906' => 
      array (
        'detail_no' => 'D050906',
        'detail_name' => '综合',
      ),
    ),
  ),
  'D0510' => 
  array (
    'dict_no' => 'D0510',
    'dict_name' => '开采工艺',
    'child' => 
    array (
      'D051001' => 
      array (
        'detail_no' => 'D051001',
        'detail_name' => '炮采',
      ),
      'D051002' => 
      array (
        'detail_no' => 'D051002',
        'detail_name' => '高档普采',
      ),
      'D051003' => 
      array (
        'detail_no' => 'D051003',
        'detail_name' => '综采+高档普采',
      ),
      'D051004' => 
      array (
        'detail_no' => 'D051004',
        'detail_name' => '高档普采+炮采',
      ),
      'D051005' => 
      array (
        'detail_no' => 'D051005',
        'detail_name' => '综采+连采',
      ),
    ),
  ),
  'D0529' => 
  array (
    'dict_no' => 'D0529',
    'dict_name' => '煤矿类型',
    'child' => 
    array (
      'D052901' => 
      array (
        'detail_no' => 'D052901',
        'detail_name' => '生产',
      ),
      'D052902' => 
      array (
        'detail_no' => 'D052902',
        'detail_name' => '建设',
      ),
      'D052903' => 
      array (
        'detail_no' => 'D052903',
        'detail_name' => '试运转',
      ),
    ),
  ),
  'D0905' => 
  array (
    'dict_no' => 'D0905',
    'dict_name' => '质量标准化等级',
    'child' => 
    array (
      'D090501' => 
      array (
        'detail_no' => 'D090501',
        'detail_name' => '四级',
      ),
      'D090502' => 
      array (
        'detail_no' => 'D090502',
        'detail_name' => '三级',
      ),
      'D090503' => 
      array (
        'detail_no' => 'D090503',
        'detail_name' => '二级',
      ),
      'D090504' => 
      array (
        'detail_no' => 'D090504',
        'detail_name' => '一级',
      ),
    ),
  ),
  'D12' => 
  array (
    'dict_no' => 'D12',
    'dict_name' => '采购计划来源',
    'child' => 
    array (
      'D1201' => 
      array (
        'detail_no' => 'D1201',
        'detail_name' => '批量订购',
      ),
      'D1202' => 
      array (
        'detail_no' => 'D1202',
        'detail_name' => '长期计划',
      ),
      'D1203' => 
      array (
        'detail_no' => 'D1203',
        'detail_name' => '收藏的订单',
      ),
      'D1204' => 
      array (
        'detail_no' => 'D1204',
        'detail_name' => '购物车',
      ),
    ),
  ),
  'D13' => 
  array (
    'dict_no' => 'D13',
    'dict_name' => '发票类型',
    'child' => 
    array (
      'D1301' => 
      array (
        'detail_no' => 'D1301',
        'detail_name' => '增值税普通发票',
      ),
      'D1302' => 
      array (
        'detail_no' => 'D1302',
        'detail_name' => '增值税专用发票',
      ),
    ),
  ),
  'D14' => 
  array (
    'dict_no' => 'D14',
    'dict_name' => '订单状态',
    'child' => 
    array (
      'D1401' => 
      array (
        'detail_no' => 'D1401',
        'detail_name' => '待申请',
      ),
      'D1402' => 
      array (
        'detail_no' => 'D1402',
        'detail_name' => '待付款',
      ),
      'D1403' => 
      array (
        'detail_no' => 'D1403',
        'detail_name' => '待收款',
      ),
      'D1404' => 
      array (
        'detail_no' => 'D1404',
        'detail_name' => '待发货',
      ),
      'D1405' => 
      array (
        'detail_no' => 'D1405',
        'detail_name' => '待收货',
      ),
      'D1406' => 
      array (
        'detail_no' => 'D1406',
        'detail_name' => '交易完成',
      ),
      'D1407' => 
      array (
        'detail_no' => 'D1407',
        'detail_name' => '交易关闭',
      ),
    ),
  ),
  'D15' => 
  array (
    'dict_no' => 'D15',
    'dict_name' => '支付方式',
    'child' => 
    array (
      'D1501' => 
      array (
        'detail_no' => 'D1501',
        'detail_name' => '现金支付',
      ),
      'D1502' => 
      array (
        'detail_no' => 'D1502',
        'detail_name' => '中国银行B2B保付',
      ),
      'D1503' => 
      array (
        'detail_no' => 'D1503',
        'detail_name' => '电子汇款',
      ),
      'D1504' => 
      array (
        'detail_no' => 'D1504',
        'detail_name' => '承兑汇票',
      ),
    ),
  ),
  'D16' => 
  array (
    'dict_no' => 'D16',
    'dict_name' => '配送方式',
    'child' => 
    array (
      'D1601' => 
      array (
        'detail_no' => 'D1601',
        'detail_name' => '一般配送',
      ),
      'D1602' => 
      array (
        'detail_no' => 'D1602',
        'detail_name' => '上门自提',
      ),
      'D1603' => 
      array (
        'detail_no' => 'D1603',
        'detail_name' => '专人专送',
      ),
    ),
  ),
  'D17' => 
  array (
    'dict_no' => 'D17',
    'dict_name' => '交易关闭原型',
    'child' => 
    array (
      'D1701' => 
      array (
        'detail_no' => 'D1701',
        'detail_name' => '采方取消订单',
      ),
      'D1702' => 
      array (
        'detail_no' => 'D1702',
        'detail_name' => '供方库存不足',
      ),
      'D1703' => 
      array (
        'detail_no' => 'D1703',
        'detail_name' => '其它',
      ),
      'D1704' => 
      array (
        'detail_no' => 'D1704',
        'detail_name' => '系统自动关闭',
      ),
    ),
  ),
  'D18' => 
  array (
    'dict_no' => 'D18',
    'dict_name' => '计划单审核状态',
    'child' => 
    array (
      'D1801' => 
      array (
        'detail_no' => 'D1801',
        'detail_name' => '待审',
      ),
      'D1802' => 
      array (
        'detail_no' => 'D1802',
        'detail_name' => '未审',
      ),
      'D1803' => 
      array (
        'detail_no' => 'D1803',
        'detail_name' => '已审',
      ),
    ),
  ),
  'D19' => 
  array (
    'dict_no' => 'D19',
    'dict_name' => '付款方式',
    'child' => 
    array (
      'D1901' => 
      array (
        'detail_no' => 'D1901',
        'detail_name' => '先款后货',
      ),
    ),
  ),
  'D20' => 
  array (
    'dict_no' => 'D20',
    'dict_name' => '出库类型',
    'child' => 
    array (
      'D2001' => 
      array (
        'detail_no' => 'D2001',
        'detail_name' => '销售出库',
      ),
      'D2002' => 
      array (
        'detail_no' => 'D2002',
        'detail_name' => '调拨出库',
      ),
      'D2003' => 
      array (
        'detail_no' => 'D2003',
        'detail_name' => '领用出库',
      ),
    ),
  ),
  'D21' => 
  array (
    'dict_no' => 'D21',
    'dict_name' => '入库类型',
    'child' => 
    array (
      'D2101' => 
      array (
        'detail_no' => 'D2101',
        'detail_name' => '采购入库',
      ),
      'D2102' => 
      array (
        'detail_no' => 'D2102',
        'detail_name' => '调拨入库',
      ),
      'D2103' => 
      array (
        'detail_no' => 'D2103',
        'detail_name' => '还料入库',
      ),
      'D2104' => 
      array (
        'detail_no' => 'D2104',
        'detail_name' => '返修入库',
      ),
      'D2105' => 
      array (
        'detail_no' => 'D2105',
        'detail_name' => '初始化入库',
      ),
    ),
  ),
  'D0507' => 
  array (
    'dict_no' => 'D0507',
    'dict_name' => '经济性质',
    'child' => 
    array (
      'D050701' => 
      array (
        'detail_no' => 'D050701',
        'detail_name' => '国有重点',
      ),
      'D050702' => 
      array (
        'detail_no' => 'D050702',
        'detail_name' => '地方国有',
      ),
      'D050703' => 
      array (
        'detail_no' => 'D050703',
        'detail_name' => '乡镇',
      ),
      'D050704' => 
      array (
        'detail_no' => 'D050704',
        'detail_name' => '私营',
      ),
    ),
  ),
  'D23' => 
  array (
    'dict_no' => 'D23',
    'dict_name' => '公告类型',
    'child' => 
    array (
      'D2301' => 
      array (
        'detail_no' => 'D2301',
        'detail_name' => '政府公告',
      ),
      'D2302' => 
      array (
        'detail_no' => 'D2302',
        'detail_name' => '平台公告',
      ),
    ),
  ),
  'D24' => 
  array (
    'dict_no' => 'D24',
    'dict_name' => '公告紧急程度',
    'child' => 
    array (
      'D2401' => 
      array (
        'detail_no' => 'D2401',
        'detail_name' => '常规',
      ),
      'D2402' => 
      array (
        'detail_no' => 'D2402',
        'detail_name' => '紧急',
      ),
      'D2403' => 
      array (
        'detail_no' => 'D2403',
        'detail_name' => '特急',
      ),
    ),
  ),
);
 return $dict[$dict_no];
}
?>