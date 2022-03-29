import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import Service from '@/pages/user/Login/service';
import Token from '@/utils/token';
import type { RequestOptionsInit } from 'umi-request';
import ReconnectingWebSocket from 'reconnecting-websocket';
import SystemConst from '@/utils/const';
import { service as MenuService } from '@/pages/system/Menu';
import getRoutes, { getMenus, handleRoutes, saveMenusCache } from '@/utils/menu';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
let extraRoutes: any[] = [];

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfo;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const user = await Service.queryCurrent();
      return user.result;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  // 链接websocket
  const url = `${document.location.protocol.replace('http', 'ws')}//${document.location.host}/${
    SystemConst.API_BASE
  }/messaging/${Token.get()}?:X_Access_Token=${Token.get()}`;

  const ws = new ReconnectingWebSocket(url);

  // ws.send('sss');
  ws.onerror = () => {
    console.log('链接错误。ws');
  };

  return {
    fetchUserInfo,
    settings: {},
  };
}

/**
 * 异常处理程序
 200: '服务器成功返回请求的数据。',
 201: '新建或修改数据成功。',
 202: '一个请求已经进入后台排队（异步任务）。',
 204: '删除数据成功。',
 400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
 401: '用户没有权限（令牌、用户名、密码错误）。',
 403: '用户得到授权，但是访问是被禁止的。',
 404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
 405: '请求方法不被允许。',
 406: '请求的格式不可得。',
 410: '请求的资源被永久删除，且不会再得到的。',
 422: '当创建一个对象时，发生一个验证错误。',
 500: '服务器发生错误，请检查服务器。',
 502: '网关错误。',
 503: '服务不可用，服务器暂时过载或维护。',
 504: '网关超时。',
 //-----English
 200: The server successfully returned the requested data. ',
 201: New or modified data is successful. ',
 202: A request has entered the background queue (asynchronous task). ',
 204: Data deleted successfully. ',
 400: 'There was an error in the request sent, and the server did not create or modify data. ',
 401: The user does not have permission (token, username, password error). ',
 403: The user is authorized, but access is forbidden. ',
 404: The request sent was for a record that did not exist. ',
 405: The request method is not allowed. ',
 406: The requested format is not available. ',
 410':
 'The requested resource is permanently deleted and will no longer be available. ',
 422: When creating an object, a validation error occurred. ',
 500: An error occurred on the server, please check the server. ',
 502: Gateway error. ',
 503: The service is unavailable. ',
 504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */

/**
 * Token 拦截器
 * @param url
 * @param options
 */
const filterUrl = ['/authorize/captcha/config', '/authorize/login'];
const requestInterceptor = (url: string, options: RequestOptionsInit) => {
  // const {params} = options;
  let authHeader = {};
  if (!filterUrl.some((fUrl) => url.includes(fUrl))) {
    authHeader = { 'X-Access-Token': Token.get() || '' };
  }
  return {
    url: `${url}`,
    options: {
      ...options,
      // 格式化成后台需要的查询参数
      // params: encodeQueryParam(params),
      interceptors: true,
      headers: authHeader,
    },
  };
};

export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;
    if (response.status === 401) {
      history.push('/user/login');
      return;
    }
    if (response.status === 400 || response.status === 500) {
      response.text().then((resp: string) => {
        if (resp) {
          notification.error({
            key: 'error',
            message: JSON.parse(resp).message || '服务器内部错误！',
          });
        } else {
          response
            .json()
            .then((res: any) => {
              notification.error({
                key: 'error',
                message: `请求错误：${res.message}`,
              });
            })
            .catch(() => {
              notification.error({
                key: 'error',
                message: '系统错误',
              });
            });
        }
      });
      return response;
    }
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    return response;
  },
  requestInterceptors: [requestInterceptor],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    navTheme: 'light',
    headerTheme: 'light',
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuDataRender: () => {
      return getMenus(extraRoutes);
    },
    links: isDev
      ? [
          <Link key={1} to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link key={2} to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    title: '',
  };
};

export function patchRoutes(routes: any) {
  if (extraRoutes && extraRoutes.length) {
    const basePath = routes.routes.find((_route: any) => _route.path === '/')!;

    const _routes = getRoutes(extraRoutes);
    const baseRedirect = {
      path: '/',
      routes: [
        ..._routes,
        {
          path: '/',
          redirect: _routes[0].path,
        },
      ],
    };
    basePath.routes = [...basePath.routes, baseRedirect];
    console.log(basePath.routes);
  }
}

export function render(oldRender: any) {
  if (history.location.pathname !== loginPath) {
    MenuService.queryMenuThree({ paging: false }).then((res) => {
      if (res.status === 200) {
        extraRoutes = handleRoutes(res.result);
        saveMenusCache(extraRoutes);
      }
      oldRender();
    });
  } else {
    oldRender();
  }
}
