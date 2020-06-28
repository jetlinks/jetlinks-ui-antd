import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectState } from '@/models/connect';
import { Settings } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import style from './index.less';

interface Props {
  dispatch: Dispatch;
  settings: Settings;
}

const Login: React.FC<Props> = props => {
  const { dispatch, settings } = props;

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [expires, setExpires] = useState<number>(3600000);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = () => {
    dispatch({
      type: 'login/login',
      payload: { username, password, expires, tokenType: 'default' },
    });
  };

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
  }, [settings.title]);

  const renderLogin = () => (
    <div className={style.login}>

      <div className={style.bg1} />
      <div className={style.gyl}>
        物联网平台
        <div className={style.gy2}>MQTT TCP CoAP HTTP , 多消息协议适配 , 可视化规则引擎</div>
      </div>
      <div className={style.bg}>
        <div className={style.wel}>用户登录</div>

        <div className={style.user}>
          <div className={style.userLabel}>用户名</div>
          <input
            style={{ borderStyle: 'none none solid none' }}
            onChange={e => setUsername(e.target.value)}
            value={username}
            type="text"
          />
        </div>
        <div
          className={style.password}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              handleSubmit();
            }
          }}
        >
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
        <div className={style.rem}>
          <input
            type="checkbox"
            checked={expires === -1}
            onChange={() => {
              setExpires(expires === -1 ? 3600000 : -1);
            }}
          />
          <div className={style.reb}>记住我</div>
        </div>
        <div className={style.fg}>
          <div style={{ fontSize: '11px', marginTop: '11px' }}>
            {/* <a style={{ fontSize: '11px' }} href="#">
              忘记密码？
            </a> */}
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
  )
  return isReady ? renderLogin() : <Spin spinning={isReady} />;
};
export default connect(({ login, loading, settings }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  settings
}))(Login);
