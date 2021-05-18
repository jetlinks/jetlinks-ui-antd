import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import { setAuthority, clearAutz, setAccessToken, setAutz } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import apis from '@/services';
import { reloadAuthorized } from '@/utils/Authorized';
import { systemVersion } from '@/services/user';

export interface StateType {
  status?: 200 | 400 | undefined;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

let getQueryString = (url: string) => {
  if (url) {
    url = url.substr(url.indexOf('?') + 1); //字符串截取，比我之前的split()方法效率高
  }
  var result = {}, //创建一个对象，用于存name，和value
    queryString = url || window.location.hash.substring(1),
    re = /([^&=]+)=([^&]*)/g, //正则，具体不会用
    m;
  while ((m = re.exec(queryString))) {
    //exec()正则表达式的匹配，具体不会用
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码
  }
  return result;
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      localStorage.removeItem('tenants-admin');

      const response = yield call(apis.login.login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 200) {
        setAccessToken(response.result.token);
        setAutz(response.result);

        const tenants = response.result?.user?.tenants;
        if (tenants && tenants[0]) {
          //找到主租户
          const temp = (response.result?.user?.tenants || []).find((i: any) => i.mainTenant)
            .adminMember;
          localStorage.setItem('tenants-admin', temp);
        }
        reloadAuthorized();
        const version = yield call(systemVersion);
        if (version) {
          localStorage.setItem('system-version', version?.result?.edition);
        }
        let result = getQueryString(window.location.hash);
        if (
          result.client_id != undefined &&
          result.response_type != undefined &&
          result.redirect_uri != undefined &&
          result.state != undefined
        ) {
          apis.login.oauth(result).then(res => {
            if (res.status === 200) {
              window.location.href = res.result;
            }
          });
        } else {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };

          const id = localStorage.getItem('u-i-1');

          if (id === response.result.userId && redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
              router.replace(redirect);
              return;
            } else {
              window.location.href = '/';
              return;
            }
          }
          localStorage.setItem('u-i-1', response.result.userId);
          // yield put(routerRedux.replace(redirect || '/'));
          router.replace('/');
          // router.replace('/');
        }
      } else callback();
    },

    *logout(_, { call, put }) {
      localStorage.removeItem('tenants-admin');
      const response = yield call(apis.login.logout);
      if (response.status === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.status,
            result: {
              currentAuthority: 'guest',
            },
          },
        });
        clearAutz();
        reloadAuthorized();
        const { redirect } = getPageQuery();
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
          router.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
