import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectState } from '@/models/connect';
import { Settings } from '@ant-design/pro-layout';
import { Avatar } from 'antd';
import style from './index.less';
import Service from './service';
import { router } from 'umi';

interface Props {
  dispatch: Dispatch;
  settings: Settings;
  location: any;
}

const Login: React.FC<Props> = props => {
  const {
    dispatch,
    settings,
    location: { query },
  } = props;
  // const token = localStorage.getItem('x-access-token');
  // const service = new Service('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [expires, setExpires] = useState<number>(3600000);
  // const [isReady, setIsReady] = useState(false);

  // const [captcha, setCaptcha] = useState<string>('');
  // const [captchaImg, setCaptchaImg] = useState<string>('');
  // const [code, setCode] = useState<string>("");
  // const [enable, setEnable] = useState<boolean>(false);
  const [current, setCurrent] = useState<boolean>(false);

  const handleSubmit = () => {
    dispatch({
      type: 'login/login',
      payload: {
        username,
        password,
        expires,
        tokenType: 'default',
        // verifyKey: "19f5c042-d26b-4d54-83d2-99c62042ada9",
        // verifyCode: '',
        bindCode: query?.code,
      },
      callback: () => {
        console.log('login');
      },
    });
  };

  // const getCodeImg = () => {
  //   if (enable) {
  //     service.getCaptcha().subscribe((resp) => {
  //       setCaptcha(resp.key);
  //       setCaptchaImg(resp.base64);
  //     });
  //   }
  // }

  // useEffect(() => {
  // if (dispatch) {
  //   dispatch({
  //     type: 'settings/fetchConfig',
  //     callback: () => {
  //       const title = document.getElementById('sys-title');
  //       const icon = document.getElementById('title-icon');
  //       if (title && settings.title) {
  //         title.textContent = settings.title;
  //       }
  //       if (icon && settings.titleIcon) {
  //         icon.href = settings.titleIcon;
  //       }
  //       if (token) {
  //         service.queryCurrent().subscribe((resp) => {
  //           if (resp.status === 200) {
  //             setCurrent(true)
  //           } else {
  //             setCurrent(false)
  //           }
  //           setIsReady(true);
  //         })
  //       } else {
  //         setIsReady(true);
  //       }
  //     }
  //   });
  // }

  // //判断是否开启验证码
  // service.captchaConfig().subscribe((resp) => {
  //   if (resp) {
  //     setEnable(resp.enabled)
  //     if (resp.enabled) {
  //       //获取验证码
  //       service.getCaptcha().subscribe((resp) => {
  //         setCaptcha(resp.key);
  //         setCaptchaImg(resp.base64);
  //       });
  //       // getCodeImg();
  //     } else {
  //       //未开启验证码
  //     }
  //   }
  // });

  // }, [settings.title]);

  const Login = () => {
    const information = JSON.parse(localStorage.getItem('user-detail') || '{}');
    if (current) {
      return (
        <div className={style.login}>
          {/* <div className={style.bg1} />
          <div className={style.gyl}>
            物联网平台
        <div className={style.gy2}>MQTT TCP CoAP HTTP , 多消息协议适配 , 可视化规则引擎
        </div>
          </div> */}
          <div className={style.box}>
            <div className={style.box1}>
              <div style={{ width: '100%', height: '30px' }}></div>
              <div className={style.avatar}>
                <Avatar
                  size="small"
                  className={style.avatarx}
                  src={
                    information.avatar ||
                    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3273016457,3482023254&fm=26&gp=0.jpg'
                  }
                  alt="avatar"
                />
              </div>
              <input
                onClick={() => {
                  router.replace('/');
                  // window.history.back()
                }}
                className={style.btn}
                type="button"
                name="登录"
                value="登录"
              />
              <div style={{ width: '100%', height: '30px' }}></div>
              <input
                onClick={() => {
                  localStorage.setItem('x-access-token', '');
                  setCurrent(false);
                  if (window.location.pathname !== '/user/login') {
                    router.replace({
                      pathname: '/user/login',
                    });
                  } else {
                    router.push('/user/login');
                  }
                }}
                className={style.btn}
                type="button"
                name="切换账号"
                value="切换账号"
              />
              <div style={{ width: '100%', height: '30px' }}></div>
            </div>
          </div>
        </div>
      );
    } else {
      return renderLogin();
    }
  };
  const renderLogin = () => (
    <div className={style.login}>
      {/* <div className={style.bg1} /> */}
      {/* <div className={style.gyl}>
        物联网平台
        <div className={style.gy2}>MQTT TCP CoAP HTTP , 多消息协议适配 , 可视化规则引擎
        </div>
      </div> */}
      {/* style={{ height: enable ? '387px' : '330px' }} */}
      <div className={style.box}>
        <div className={style.logo}>
          <img src={require('@/assets/logo.png')} alt="" />
          <span>Jetlinks-Edge</span>
        </div>
        <div className={style.box1}>
          <div className={style.header}>登录</div>

          <div className={style.item}>
            <div className={style.userLabel}>
              <img src={require('@/assets/username.png')} alt="" />
            </div>
            <input
              onChange={e => setUsername(e.target.value)}
              value={username}
              placeholder="请输入用户名"
              type="text"
            />
          </div>
          {/* <div className={style.item} onKeyUp={e => { if (e.keyCode === 13 && !enable) { handleSubmit(); } }}> */}
          <div className={style.item}>
            <div className={style.userLabel}>
              <img src={require('@/assets/password.png')} alt="" />
            </div>
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="请输入密码"
              type="password"
            />
          </div>
          <div className={style.remember}>
            <div className={style.remember_box}>
              <input
                type="checkbox"
                checked={expires === -1}
                onChange={() => {
                  setExpires(expires === -1 ? 3600000 : -1);
                }}
              />
              <div className={style.text}>记住密码</div>
            </div>
          </div>

          <input
            onClick={() => {
              handleSubmit();
            }}
            className={style.btn}
            type="button"
            name="登录"
            value="登录"
          />
        </div>
      </div>
    </div>
  );
  // return isReady ? renderLogin() : <Spin spinning={isReady} />;
  // return isReady ? Login() : <Spin spinning={isReady} />;
  return Login();
};
export default connect(({ login, loading, settings }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  settings,
}))(Login);
