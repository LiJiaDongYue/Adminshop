<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <title>通用后台首页</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
    <div>
        <form action="" method="post">
            <ol>
                <li>
                    <label><input type="radio" name="paytype" value="alipay" />支付宝</labe>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="tenpay" />财付通</labe>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="palpay" />贝宝</label>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="yeepay" />易付宝</label>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="kuaiqian" />快钱</label>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="unionpay" />银联</label>
                </li>
                <li>
                    <label><input type="radio" name="paytype" value="aliwappay" />支付宝wap</label>
                </li>
            </ol>
            
            <input type="text" name="money" value="200" />
            <input type="submit" value="提交" />
        </form>
    </div>
    </body>
</html>