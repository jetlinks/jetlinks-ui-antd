import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Link, history } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import Token from '@/utils/token';
import Service from '@/pages/user/Login/service';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, Submit, Input, Password, FormItem } from '@formily/antd';
import { filter, mergeMap } from 'rxjs/operators';
import * as ICONS from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import { SelectLang } from '@@/plugin-locale/SelectLang';

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as {
      redirect: string;
    };
    history.push(redirect || '/');
  }, 10);
};

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

  const getCode = () => {
    delete loginForm.values?.verifyCode;
    loginRef.current = loginForm.values;
    Service.captchaConfig()
      .pipe(
        filter((r) => r.enabled),
        mergeMap(Service.getCaptcha),
      )
      .subscribe(setCaptcha);
  };

  useEffect(() => {
    getCode();
  }, []);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
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
        // title: '用户名',
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
        // title: '密码',
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
        // title: '验证码',
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

  const doLogin = async (data: LoginParam) =>
    Service.login({ verifyKey: captcha.key, ...data }).subscribe({
      next: async (userInfo: UserInfo) => {
        message.success(
          intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: '登录成功！',
          }),
        );
        Token.set(userInfo.token);
        await fetchUserInfo();
        goto();
      },
      error: () =>
        message.error(
          intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: '登录失败,请重试！',
          }),
        ),
      complete: () => {
        getCode();
      },
    });
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang="">
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>{SystemConst.SYSTEM_NAME}</span>
            </Link>
          </div>
          <div className={styles.desc}>
            {intl.formatMessage({
              id: 'pages.layouts.userLayout.title',
              defaultMessage: 'Jetlinks',
            })}
          </div>
        </div>

        <div className={styles.main}>
          <Form form={loginForm} layout="vertical" size="large" onAutoSubmit={doLogin}>
            <SchemaField schema={schema} />
            <Submit block size="large">
              {intl.formatMessage({
                id: 'pages.login.submit',
                defaultMessage: '登录',
              })}
            </Submit>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
