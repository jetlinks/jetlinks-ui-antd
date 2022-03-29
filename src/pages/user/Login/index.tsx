import { Checkbox, message, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';
import Token from '@/utils/token';
import Service from '@/pages/user/Login/service';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, Password, Submit } from '@formily/antd';
import { catchError, filter, mergeMap } from 'rxjs/operators';
import * as ICONS from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
// import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import { SelectLang } from '@@/plugin-locale/SelectLang';
import Footer from '@/components/Footer';

const Login: React.FC = () => {
  const [captcha, setCaptcha] = useState<{ key?: string; base64?: string }>({});

  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = (await initialState?.fetchUserInfo?.()) as UserInfo;
    if (userInfo) {
      await setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const loginRef = useRef<Partial<LoginParam>>({});
  const loginForm = createForm({
    validateFirst: true,
    initialValues: loginRef.current,
  });

  const [loading, setLoading] = useState<boolean>(false);

  /** 此方法会跳转到 redirect 参数所在的位置 */
  const goto = () => {
    setTimeout(() => {
      // history.push(redirect || '/');
      // 用于触发app中的render，生成路由
      window.location.href = '/';
      setLoading(false);
    }, 10);
  };

  const getCode = () => {
    delete loginForm.values?.verifyCode;
    loginRef.current = loginForm.values;
    Service.captchaConfig()
      .pipe(
        filter((r) => r.enabled),
        mergeMap(Service.getCaptcha),
        catchError(() => message.error('服务端挂了！')),
      )
      .subscribe(setCaptcha);
  };

  useEffect(getCode, []);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      // Checkbox,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-validator': { required: true, message: '请输入用户名！' },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: intl.formatMessage({
            id: 'pages.login.username.placeholder',
            defaultMessage: '用户名',
          }),
          prefix: "{{icon('UserOutlined')}}",
        },
      },
      password: {
        type: 'string',
        'x-validator': { required: true, message: '请输入用户名！' },
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          prefix: "{{icon('LockOutlined')}}",
          placeholder: intl.formatMessage({
            id: 'pages.login.password.placeholder',
            defaultMessage: '密码',
          }),
        },
      },
      verifyCode: {
        type: 'string',
        'x-visible': !!captcha.key,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          addonAfter: <img src={captcha.base64} alt="验证码" onClick={getCode} />,
          placeholder: intl.formatMessage({
            id: 'pages.login.captcha.placeholder',
            defaultMessage: '请输入验证码',
          }),
        },
      },
    },
  };

  const doLogin = async (data: LoginParam) => {
    setLoading(true);
    Service.login({ expires: loginRef.current.expires, verifyKey: captcha.key, ...data }).subscribe(
      {
        next: async (userInfo: UserInfo) => {
          Token.set(userInfo.token);
          await fetchUserInfo();
          goto();
        },
        error: () => {
          message.error(
            intl.formatMessage({
              id: 'pages.login.failure',
              defaultMessage: '登录失败,请重试！',
            }),
          );
          getCode();
          setLoading(false);
        },
        complete: () => {
          getCode();
          setLoading(false);
        },
      },
    );
  };
  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.lang} data-lang="">
            {SelectLang && <SelectLang />}
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src="/logo.svg" />
                  {/*<span className={styles.title}>{SystemConst.SYSTEM_NAME}</span>*/}
                </Link>
              </div>
              <div className={styles.desc}>
                {intl.formatMessage({
                  id: 'pages.layouts.userLayout.title',
                  defaultMessage: 'Jetlinks',
                })}
              </div>
              <div className={styles.main}>
                <Form form={loginForm} layout="horizontal" size="large" onAutoSubmit={doLogin}>
                  <SchemaField schema={schema} />
                  <div className={styles.remember}>
                    <Checkbox
                      onChange={(e) => {
                        loginRef.current.expires = e.target.checked ? -1 : 3600000;
                      }}
                    >
                      记住密码
                    </Checkbox>
                  </div>
                  <Submit block size="large">
                    {intl.formatMessage({
                      id: 'pages.login.submit',
                      defaultMessage: '登录',
                    })}
                  </Submit>
                </Form>
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </div>
        <div className={styles.right}>
          {/*<div className={styles.systemName}>{SystemConst.SYSTEM_NAME}</div>*/}
          {/*<div className={styles.systemDesc}>OPEN SOURCE INTERNET OF THINGS BASIC PLATFORM</div>*/}
        </div>
      </div>
    </Spin>
  );
};

export default Login;
