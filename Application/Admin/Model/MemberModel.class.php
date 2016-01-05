<?php
/**
 * 
 * @authors lijiadongyue (you@example.org)
 * @date    2015-12-10 15:26:46
 * @version 1.0
 */
namespace Admin\Model;
use Think\Model;

class MemberModel extends Model{

 	/* 用户模型自动完成 */
    protected $_auto = array(
        array('password', 'md5', self::MODEL_BOTH, 'function'),
    );

    /**
     * 用户登录信息
     * @param  integer $uid 用户ID
     */
    protected function doLogin($user)
    {
        /* 更新登录信息 */
        $data = array(
            'uid' => $user[uid],
            'last_login_time' => format_date(),
            'last_login_ip' => GetIp(),
        );
        M('member_data')->save($data);

        //TODO 登录记录行为

        /* 记录登录SESSION和COOKIES */
        $auth = array(
            'uid' => $user['uid'],
            'username' => $user['username'],
            'parent_uid' => $user['parent_uid'],
            'group_id' => $user['group_id'],
            'user_type' => $user['user_type']
        );
        //session_set_cookie_params(60);
        //session_cache_expire(1);
        session('CURRENT_USER', $auth);
        session('CURRENT_USER_SIGN', data_auth_sign($auth));
    }

	/**
     * 用户登录认证
     * @param  string $username 用户名
     * @param  string $password 用户密码
     * @param  integer $type 用户名类型 （1-用户名，2-邮箱）
     * @return integer           登录成功-用户ID，登录失败-错误编号
     */
    public function login($username, $password, $code = '', $isVerify = 0, $type = 1)
    {
        // 用户名或密码为空
        if (empty($username) || empty($password)) {
            return -1;
        }
        if ($isVerify) {//如果需要验证码
            // 验证码为空
            if (empty($code)) {
                return -2;
            }
            // 验证码是否正确
            $verify = new \Think\Verify();
            if (!$verify->check(base64_decode($code), '_ADMIN_')) { // 验证码错误
                return -3;
            }
        }
        $map = array();
        switch ($type) {
            case 1:
                $map['username'] = $username;
                break;
            case 2:
                $map['email'] = $username;
                break;
            default:
                return 0; //参数错误
        }

        /* 获取用户数据 */
        $user = $this->where($map)->find();
        if (is_array($user) && $user['is_active']) {//已激活
            /* 验证用户密码 */
            if (strtolower(base64_decode($password)) === $user['password']) {
                $this->doLogin($user);
                return $user['uid']; //登录成功，返回用户ID
            } else {
                return -4; //密码错误
            }
        } else {
            return -5; //用户不存在或被禁用
        }
    }

}
  
