import { Button, Card, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/account/Center/service';
import api from '@/pages/user/Login/service';
import styles from './index.less';
import Token from '@/utils/token';
import { useModel } from '@@/plugin-model/useModel';
import { onlyMessage } from '@/utils/util';

export const service = new Service();

const Bind = () => {
  const [form] = Form.useForm();
  const [bindUser, setBindUser] = useState<any>();
  const [user, setUser] = useState<any>();
  const [code, setCode] = useState<string>('');
  const [isLogin, setIslogin] = useState<any>('yes');
  const { initialState, setInitialState } = useModel('@@initialState');

  const bindPage = require('/public/images/bind/bindPage.png');
  const Vector = require('/public/images/bind/Vector.png');
  const Rectangle = require('/public/images/bind/Rectangle.png');
  const logo = require('/public/images/bind/jetlinksLogo.png');

  const iconMap = new Map();
  iconMap.set('dingtalk', require('/public/images/notice/dingtalk.png'));
  iconMap.set('wechat-webapp', require('/public/images/notice/wechat.png'));

  const bindUserInfo = (params: string) => {
    service.bindUserInfo(params).then((res) => {
      if (res.status === 200) {
        setBindUser(res.result);
      }
    });
  };
  const getDetail = () => {
    service.getUserDetail().subscribe((res) => {
      setUser(res?.result);
    });
  };

  //未登录页
  const loginDiv = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={styles.topimg}>
        <img src={logo} style={{ width: '50px', height: '50px' }} />
        <img src={Vector} style={{ height: '15px', margin: '0 15px' }} />
        <img src={iconMap.get(bindUser?.type)} style={{ width: '50px', height: '50px' }} />
      </div>
      <div className={styles.topfont}>
        你已通过{bindUser?.type === 'dingtalk' ? '钉钉' : '微信'}授权,完善以下登录信息即可以完成绑定
      </div>
      <div className={styles.form}>
        <Form layout="vertical" form={form}>
          <Form.Item
            label="账户"
            name="username"
            rules={[{ required: true, message: '请输入账户' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  const fetchUserInfo = async () => {
    const userInfo = (await initialState?.fetchUserInfo?.()) as UserInfo;
    if (userInfo) {
      await setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };
  const doLogin = async (data: any) => {
    api.login(data).subscribe({
      next: async (userInfo) => {
        Token.set(userInfo.token);
        await fetchUserInfo();
        localStorage.setItem('onLogin', 'yes');
        onlyMessage('登录成功');
        setTimeout(() => window.close(), 1000);
      },
      error: () => {
        onlyMessage('登录失败,请重试', 'error');
      },
    });
  };

  useEffect(() => {
    const params = window.location.href.split('?')[1].split('&')[1].split('=')[1];
    // const params = 'b584032923c78d69e6148cf0e9312723'
    setCode(params);
    bindUserInfo(params);
    if (localStorage.getItem('onLogin') === 'yes') {
      getDetail();
    }
    if (localStorage.getItem('onLogin')) {
      setIslogin(localStorage.getItem('onLogin'));
    }
  }, []);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100vh',
          background: `url(${bindPage}) no-repeat`,
          backgroundSize: '100% 100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.cards}>
          <div className={styles.title}>第三方账户绑定</div>
          <div className={styles.info}>
            {isLogin === 'no' ? (
              <>{loginDiv()}</>
            ) : (
              <>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>
                        <img src={Rectangle} />
                      </div>
                      <div className={styles.infotitle}>个人信息</div>
                    </div>
                  }
                >
                  <div className={styles.item}>
                    <div style={{ height: 100, marginTop: 10, marginBottom: 10 }}>
                      <img src={logo} style={{ height: 70 }} />
                    </div>
                    <p className={styles.fonts}>账号：{user?.username}</p>
                    <p className={styles.fonts}>用户名：{user?.name}</p>
                  </div>
                </Card>
                <div style={{ position: 'relative', top: '135px', margin: '0 20px' }}>
                  <img src={Vector} style={{ height: '15px' }} />
                </div>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>
                        <img src={Rectangle} />
                      </div>
                      <div className={styles.infotitle}>三方账户信息</div>
                    </div>
                  }
                >
                  <div className={styles.item}>
                    <div style={{ height: 100, marginTop: 10, marginBottom: 10 }}>
                      <img style={{ height: 70 }} src={iconMap.get(bindUser?.type)} />
                    </div>
                    <p className={styles.fonts}>账户：{bindUser?.providerName}</p>
                    <p className={styles.fonts}>用户名：{bindUser?.result.others.name}</p>
                  </div>
                </Card>
              </>
            )}
          </div>
          <div className={styles.btn}>
            {isLogin === 'no' ? (
              <Button
                style={{ marginTop: 10, marginBottom: 30, width: 250 }}
                type="primary"
                onClick={async () => {
                  const data = await form.validateFields();
                  if (data) {
                    doLogin({
                      ...data,
                      bindCode: code,
                    });
                  }
                }}
              >
                登录并已绑定账户
              </Button>
            ) : (
              <Button
                style={{ marginTop: 30, marginBottom: 30 }}
                type="primary"
                onClick={() => {
                  service.bind(code).then((res) => {
                    if (res.status === 200) {
                      onlyMessage('绑定成功');
                      localStorage.setItem('onBind', 'true');
                      setTimeout(() => window.close(), 1000);
                    } else {
                      onlyMessage('绑定失败', 'error');
                    }
                  });
                }}
              >
                立即绑定
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Bind;
