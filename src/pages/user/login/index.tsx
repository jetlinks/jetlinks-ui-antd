import { Alert } from 'antd';
import React, { Component } from 'react';
// import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
// import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import LoginComponents from './components/Login';
import styles from './style.less';
// import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
// import PubSub from 'pubsub-js';

const { UserName, Password, Submit } = LoginComponents;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}
interface LoginState {
  type: string;
  // autoLogin: boolean;
  tokenType: 'default';
}

class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    // autoLogin: true,
    tokenType: 'default',
  };

  // changeAutoLogin = (e: CheckboxChangeEvent) => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  handleSubmit = (err: unknown, values: any) => {
    const { tokenType } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, tokenType },
        // callback: (response: string) => {
        // if (response === 'loginSuccess') {
        // PubSub.publish('login-success', 'login-success');
        // }
        // },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err: unknown, values: any) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await ((dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            }) as unknown) as Promise<unknown>);
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status } = userLogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          {/* <Tab key="account" tab="账户密码登录"> */}
          {status === 400 &&
            // loginType === 'account' &&
            !submitting &&
            this.renderMessage('账户或密码错误')}
          <UserName
            name="username"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();

              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          {/* </Tab>
          <Tab key="mobile" tab="手机号登录">
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile
              name="mobile"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder="验证码"
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText="获取验证码"
              getCaptchaSecondText="秒"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </Tab> */}
          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              忘记密码
            </a>
          </div> */}
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
            其他登录方式
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div> */}
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
