import { Button, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'umi';
import './index.less';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, Password, Submit } from '@formily/antd';
import { catchError, filter, mergeMap } from 'rxjs/operators';
import Service from '@/pages/user/Login/service';
import * as ICONS from '@ant-design/icons';
import React from 'react';

const Oauth = () => {
  const intl = useIntl();
  const logo = require('/public/logo.svg');
  const bindPage = require('/public/images/bind/bindPage.png');
  const headerImg = require('/public/logo.png');

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [captcha, setCaptcha] = useState<{ key?: string; base64?: string }>({});
  const [userName, setUerName] = useState<string>('');
  const [appName, setAppName] = useState<string>('');
  const [params, setParams] = useState<any>({});
  const [internal, setLinternal] = useState<any>();
  const loadingRef = useRef<boolean>(true);

  const loginRef = useRef<Partial<LoginParam>>({});
  const loginForm = useMemo(
    () =>
      createForm({
        validateFirst: true,
        initialValues: loginRef.current,
      }),
    [captcha],
  );
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
  const getCode = () => {
    delete loginForm.values?.verifyCode;
    loginRef.current = loginForm.values;
    // setLoading(false);
    Service.captchaConfig()
      .pipe(
        filter((r) => {
          if (!r.enabled) {
            // setLoading(false);
          }
          return r.enabled;
        }),
        mergeMap(Service.getCaptcha),
        catchError(() => message.error('系统开小差，请稍后重试')),
      )
      .subscribe((res) => {
        setCaptcha(res);
        // setLoading(false);
      });
  };
  const goOAuth2 = async (data?: any) => {
    const res = await Service.getOAuth2(data || params);
    if (res.status === 200) {
      window.location.href = res.result;
    } else {
      getCode();
    }
  };

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

  const initApplication = async (cilentId: string) => {
    const res: any = await Service.initApplication(cilentId);
    if (res.status === 200) {
      setAppName(res.result?.name);
    }
  };

  const getLoginUser = async (data?: any) => {
    const res = await Service.queryCurrent();
    if (res && res.status === 200) {
      setUerName(res.result.user.name);
      setIsLogin(true);
      initApplication(data.client_id || params.client_id);
      if (data.internal === 'true' || internal === 'true') {
        goOAuth2(data);
      }
    } else if (res.status === 401) {
      setIsLogin(false);
      getCode();
      initApplication(data.client_id || params.client_id);
      setTimeout(() => {
        loadingRef.current = false;
      });
    } else {
      setIsLogin(false);
      setTimeout(() => {
        loadingRef.current = false;
      });
    }
  };

  const getQueryVariable = (variable: any) => {
    // console.log(window.location.search)
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return '';
  };

  const doLogin = async (data: LoginParam) => {
    // setIsLogin(true)
    const res = await Service.login2({
      expires: loginRef.current.expires,
      verifyKey: captcha.key,
      ...data,
    });
    if (res.status === 200) {
      getLoginUser();
      const token = res.result.token;
      localStorage.setItem('X-Access-Token', token);
      goOAuth2();
    } else {
      getCode();
    }
  };

  useEffect(() => {
    document.title = 'OAuth授权-jetlinks';
    getCode();
  }, []);

  useEffect(() => {
    console.log('..............');
    const init = async () => {
      await Promise.resolve().then(() => {
        console.log(1, loadingRef.current);
        let redirectUrl;
        const items = {
          client_id: getQueryVariable('client_id'),
          state: getQueryVariable('state'),
          redirect_uri: decodeURIComponent(getQueryVariable('redirect_uri')),
          response_type: getQueryVariable('response_type'),
          scope: getQueryVariable('scope'),
        };
        const item = getQueryVariable('internal');
        if (items.redirect_uri) {
          const orgin = items.redirect_uri.split('/').slice(0, 3);
          const url = `${orgin.join('/')}/%23/${items.redirect_uri?.split('redirect_uri=')[1]}`;
          redirectUrl = `${items.redirect_uri?.split('redirect_uri=')[0]}?redirect=${url}`;
        }
        getLoginUser({
          ...items,
          internal: getQueryVariable('internal'),
          redirect_uri: redirectUrl,
        });
        setLinternal(item);
        setParams({
          ...items,
          redirect_uri: redirectUrl,
        });
      });
      // debugger;
      // await Promise.resolve().then(() => {
      //   console.log(2, loadingRef.current)
      //   // debugger;
      //   loadingRef.current = false;
      //   console.log(3, loadingRef.current)
      // });
    };
    init();
  }, [window.location]);

  //未登录状态
  const loginPage = () => {
    return (
      <>
        <div className="oauth-content-header">
          <img src={headerImg} />
        </div>
        <div className="oauth-content-login">
          <Form form={loginForm} layout="horizontal" size="large" onAutoSubmit={doLogin}>
            <SchemaField schema={schema} />
            <Submit block size="large">
              {intl.formatMessage({
                id: 'pages.login.submit',
                defaultMessage: '登录',
              })}
            </Submit>
          </Form>
        </div>
      </>
    );
  };

  return (
    <>
      {loadingRef.current ? (
        <></>
      ) : (
        <div
          className="oauth"
          style={{
            width: '100%',
            height: '100vh',
            background: `url(${bindPage}) no-repeat`,
            backgroundSize: '100% 100%',
          }}
        >
          <div className="oauth-header">
            <div className="oauth-header-left">
              <img src={logo} />
            </div>
            {/* <div className="oauth-header-right">
        <a style={{ color: 'rgb(0 0 0 / 70%)' }}>{userName || '-'}</a>
        <div className="oauth-header-right-connect">|</div>
                  <a
                      style={{ color: 'rgb(0 0 0 / 70%)' }}
                      onClick={(() => {
                          setIsLogin(false)
                      })}
                  >切换账号</a>
      </div> */}
          </div>
          <div className="oauth-content">
            {isLogin ? (
              <>
                <div className="oauth-content-header">
                  <img src={headerImg} />
                </div>
                <div className="oauth-content-content">
                  <div className="oauth-content-content-text">
                    {`您正在授权登录,${appName || '-'}将获得以下权限:`}
                  </div>
                  <ul>
                    <li>{`关联${userName}账号`}</li>
                    <li>获取您的个人信息 </li>
                  </ul>
                </div>
                <div className="oauth-content-button">
                  <Button
                    type="primary"
                    onClick={() => {
                      goOAuth2();
                    }}
                  >
                    同意授权
                  </Button>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('X-Access-Token');
                      setIsLogin(false);
                    }}
                  >
                    切换账号
                  </Button>
                </div>
              </>
            ) : (
              loginPage()
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Oauth;
