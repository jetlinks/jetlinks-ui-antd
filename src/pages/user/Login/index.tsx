import { Button, Checkbox, Divider, message, Spin } from 'antd';
import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import { SelectLang } from '@@/plugin-locale/SelectLang';
import Footer from '@/components/Footer';

const Login: React.FC = () => {
  const [captcha, setCaptcha] = useState<{ key?: string; base64?: string }>({});
  const [bindings, setBindings] = useState<any>([]);
  const [basis, setBasis] = useState<any>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const iconMap = new Map();
  iconMap.set('dingtalk', require('/public/images/bind/dingtalk.png'));
  iconMap.set('wechat-webapp', require('/public/images/bind/wechat-webapp.png'));

  const fetchUserInfo = async () => {
    const userInfo = (await initialState?.fetchUserInfo?.()) as UserInfo;
    if (userInfo) {
      await setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
      return userInfo
    }
    return null
  };

  const loginRef = useRef<Partial<LoginParam>>({});
  const loginForm = useMemo(() => createForm({
    validateFirst: true,
    initialValues: loginRef.current,
  }), [captcha]);

  const [loading, setLoading] = useState<boolean>(false);

  /** 此方法会跳转到 redirect 参数所在的位置 */
  // const goto = () => {
  //   setTimeout(() => {
  //     // history.push(redirect || '/');
  //     // 用于触发app中的render，生成路由
  //     window.location.href = '/';
  //     setLoading(false);
  //   }, 10);
  // };

  const getCode = () => {
    delete loginForm.values?.verifyCode;
    loginRef.current = loginForm.values;
    // setLoading(false);
    Service.captchaConfig()
      .pipe(
        filter((r) => {
          if (!r.enabled) {
            setLoading(false);
          }
          return r.enabled;
        }),
        mergeMap(Service.getCaptcha),
        catchError(() => message.error('系统开小差，请稍后重试')),
      )
      .subscribe((res) => {
        setCaptcha(res);
        setLoading(false);
      });
  };

  useEffect(getCode, []);

  useEffect(() => {
    localStorage.clear();
    Service.bindInfo().then((res) => {
      if (res.status === 200) {
        setBindings(res.result);
      }
    });
    Service.settingDetail('basis').then((res) => {
      if (res.status === 200) {
        console.log(res.result);
        const ico: any = document.querySelector('link[rel="icon"]');
        ico.href = res.result.ico + setBasis(res.result);
      }
    });
  }, []);

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
        'x-validator': { required: true, message: '请输入密码！' },
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
    const res = await Service.login2({ expires: loginRef.current.expires, verifyKey: captcha.key, ...data })
    setLoading(false)
    if (res.status === 200) {
      const userInfo = res.result
      Token.set(userInfo.token);
      const userRef: any = await fetchUserInfo();
      if (userRef?.user?.username === 'admin') {
        const initRef = await Service.initPage()
        if (initRef.status === 200 && !initRef.result.length) {
          window.location.href = '/#/init-home';
          return
        }
      }
      window.location.href = '/';
    } else {
      getCode();
      setLoading(false);
    }
    // Service.login({ expires: loginRef.current.expires, verifyKey: captcha.key, ...data }).subscribe(
    //   {
    //     next: async (userInfo) => {
    //       Token.set(userInfo.token);
    //       const userRef: any = await fetchUserInfo();
    //       if (userRef?.user?.username === 'admin') {
    //         const initRef = await Service.initPage()
    //         if (initRef.status === 200 && !initRef.result.length) {
    //           window.location.href = '/#/init-home';
    //           setLoading(false);
    //           return
    //         }
    //       }
    //       // goto();
    //       window.location.href = '/';
    //       setLoading(false);
    //     },
    //     error: () => {
    //       message.error(
    //         intl.formatMessage({
    //           id: 'pages.login.failure',
    //           defaultMessage: '登录失败,请重试！',
    //         }),
    //       );
    //       getCode();
    //       // setLoading(false);
    //     },
    //     complete: () => {
    //       // getCode();
    //       // setLoading(false);
    //     },
    //   },
    // );
  };
  return (
    <Spin spinning={loading} delay={500}>
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
                      记住我
                    </Checkbox>
                  </div>
                  <Submit block size="large">
                    {intl.formatMessage({
                      id: 'pages.login.submit',
                      defaultMessage: '登录',
                    })}
                  </Submit>
                  <div style={{ marginTop: 20 }}>
                    <Divider plain style={{ height: 12 }}>
                      <div style={{ color: '#807676d9', fontSize: 12 }}>其他方式登录</div>
                    </Divider>
                    <div style={{ position: 'relative', bottom: '10px' }}>
                      {bindings.map((item: any) => (
                        <Button
                          type="link"
                          onClick={() => {
                            localStorage.setItem('onLogin', 'no');
                            //  window.open(`/#/account/center/bind`);
                            window.open(`/${SystemConst.API_BASE}/sso/${item.provider}/login`);
                            window.onstorage = (e) => {
                              if (e.newValue) {
                                window.location.href = '/';
                              }
                            };
                          }}
                        >
                          <img src={iconMap.get(item.type)} />
                        </Button>
                      ))}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </div>
        <div className={styles.right}>
          <img
            src={basis.backgroud || require('/public/images/login.png')}
            style={{ width: '100%', height: '100%' }}
          />
          {/*<div className={styles.systemName}>{SystemConst.SYSTEM_NAME}</div>*/}
          {/*<div className={styles.systemDesc}>OPEN SOURCE INTERNET OF THINGS BASIC PLATFORM</div>*/}
        </div>
      </div>
    </Spin>
  );
};

export default Login;
