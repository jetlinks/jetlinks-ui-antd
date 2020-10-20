import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectState } from '@/models/connect';
import { Settings } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import style from './index.less';
import Service from './service';

interface Props {
  dispatch: Dispatch;
  settings: Settings;
  location: any;
}

const Login: React.FC<Props> = props => {
  const { dispatch, settings, location: { query } } = props;

  const service = new Service('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [expires, setExpires] = useState<number>(3600000);
  const [isReady, setIsReady] = useState(false);

  const [captcha, setCaptcha] = useState<string>('');
  const [captchaImg, setCaptchaImg] = useState<string>('');
  const [code, setCode] = useState<string>("");
  const [enable, setEnable] = useState<boolean>(false);

  const handleSubmit = () => {
    dispatch({
      type: 'login/login',
      payload: {
        username,
        password,
        expires,
        tokenType: 'default',
        verifyKey: captcha,
        verifyCode: code,
        bindCode: query?.code
      },
      callback: () => { getCodeImg() }
    });
  };

  const getCodeImg = () => {
    if (enable) {
      service.getCaptcha().subscribe((resp) => {
        setCaptcha(resp.key);
        setCaptchaImg(resp.base64);
      });
    }
  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/fetchConfig',
        callback: () => {
          const title = document.getElementById('sys-title');
          const icon = document.getElementById('title-icon');
          if (title && settings.title) {
            title.textContent = settings.title;
          }
          if (icon && settings.titleIcon) {
            icon.href = settings.titleIcon;
          }
          setIsReady(true);
        }
      });
    }

    //判断是否开启验证码
    service.captchaConfig().subscribe((resp) => {
      if (resp) {
        setEnable(resp.enabled)
        if (resp.enabled) {
          //获取验证码
          service.getCaptcha().subscribe((resp) => {
            setCaptcha(resp.key);
            setCaptchaImg(resp.base64);
          });
          // getCodeImg();
        } else {
          //未开启验证码
        }
      }
    });



  }, [settings.title]);


  const renderLogin = () => (
    <div className={style.login}>

      <div className={style.bg1} />
      <div className={style.gyl}>
        物联网平台
        <div className={style.gy2}>MQTT TCP CoAP HTTP , 多消息协议适配 , 可视化规则引擎
        </div>
      </div>
      {/* style={{ height: enable ? '387px' : '330px' }} */}
      <div className={style.box}>
        <div className={style.box1} >
          <div className={style.header}>用户登录</div>

          <div className={style.item}>
            <div className={style.userLabel}>用户名</div>
            <input
              style={{ borderStyle: 'none none solid none' }}
              onChange={e => setUsername(e.target.value)}
              value={username}
              type="text"
            />
          </div>
          <div className={style.item} onKeyUp={e => { if (e.keyCode === 13 && !enable) { handleSubmit(); } }}>
            <div className={style.userLabel}>
              密<span style={{ marginLeft: '1em' }} />码
            </div>
            <input
              style={{ borderStyle: 'none none solid none' }}
              onChange={e => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </div>
          {
            enable ? <div className={style.item}>
              <div className={style.userLabel}>验证码</div>
              <input onKeyUp={e => { if (e.keyCode === 13) { handleSubmit(); } }}
                style={{ borderStyle: 'none none solid none' }}
                onChange={e => setCode(e.target.value)}
                value={code}
                type="text"
              />
              <div className={style.code} onClick={() => { getCodeImg(); }}><img src={captchaImg} className={style.code_img} /></div>
            </div> : <div></div>
          }


          <div className={style.remember}>
            <div className={style.remember_box}>
              <input
                type="checkbox"
                checked={expires === -1}
                onChange={() => {
                  setExpires(expires === -1 ? 3600000 : -1);
                }}
              />
              <div className={style.text}>记住我</div>
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
  )
  return isReady ? renderLogin() : <Spin spinning={isReady} />;
};
export default connect(({ login, loading, settings }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  settings
}))(Login);
