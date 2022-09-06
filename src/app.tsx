import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import Service from '@/pages/user/Login/service';
// import { service as SystemConfigService } from '@/pages/system/Config';
import Token from '@/utils/token';
import type { RequestOptionsInit } from 'umi-request';
// import ReconnectingWebSocket from 'reconnecting-websocket';
import SystemConst from '@/utils/const';
import { service as MenuService } from '@/pages/system/Menu';
import getRoutes, {
  extraRouteArr,
  getMenuPathByCode,
  getMenus,
  handleRoutes,
  saveMenusCache,
} from '@/utils/menu';
import { AIcon } from '@/components';
import React from 'react';
import 'moment/dist/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const bindPath = '/account/center/bind';
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
      const detail = await Service.userDetail();
      // console.log(user.result,'user')
      return {
        ...user.result,
        user: {
          ...user.result.user,
          avatar: detail.result.avatar,
        },
      };
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const getSettings = async () => {
    try {
      const res = await Service.settingDetail('front');
      return res.result;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath && history.location.pathname !== bindPath) {
    const currentUser = await fetchUserInfo();
    const settings = await getSettings();
    return {
      fetchUserInfo,
      currentUser,
      settings: settings,
    };
  }
  // 链接websocket
  // const url = `${document.location.protocol.replace('http', 'ws')}//${document.location.host}/${
  //   SystemConst.API_BASE
  // }/messaging/${Token.get()}?:X_Access_Token=${Token.get()}`;
  //
  // const ws = new ReconnectingWebSocket(url);
  //
  // // ws.send('sss');
  // ws.onerror = () => {
  //   console.log('链接错误。ws');
  // };

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
const filterUrl = [
  '/authorize/captcha/config',
  '/authorize/login',
  '/sso/bind-code/',
  '/sso/providers',
];
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
    if (
      response.status === 400 ||
      response.status === 500 ||
      response.status === 404 ||
      response.status === 403
    ) {
      // 添加clone() 避免后续其它地方用response.text()时报错
      response
        .clone()
        .text()
        .then((resp: string) => {
          if (resp) {
            notification.error({
              key: 'error',
              message: JSON.parse(resp || '{}').message || '服务器内部错误！',
            });
          } else {
            response
              .clone()
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
                  message: '系统开小差，请稍后重试',
                });
              });
          }
        });
      return response;
    }
    if (!response) {
      notification.error({
        description: '网络异常，请检查网络连接',
        message: '网络异常',
      });
    }
    return response;
  },
  requestInterceptors: [requestInterceptor],
};

const MenuItemIcon = (
  menuItemProps: any,
  defaultDom: React.ReactNode,
  props: any,
): React.ReactNode => {
  if (defaultDom) {
    // @ts-ignore
    const menuItem = React.cloneElement(defaultDom, {
      // @ts-ignore
      children: [<AIcon type={menuItemProps.icon as string} />, defaultDom.props.children[1]],
      ...props,
    });
    return menuItem;
  }
  return defaultDom;
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  // console.log({ ...initialState });
  const ico: any = document.querySelector('link[rel="icon"]');
  if (ico !== null) {
    Service.settingDetail('front').then((res) => {
      if (res.status === 200) {
        // console.log(res.result.ico)
        ico.href = res.result.ico;
      }
    });
  }
  return {
    navTheme: 'light',
    headerTheme: 'light',
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    itemRender: (route, _, routes) => {
      const isToParentUrl = getMenuPathByCode('notice');
      const chilck = routes.indexOf(route) !== 0;
      const goto = routes.some((item) => {
        if (!route.path.includes('iot')) {
          return routes.indexOf(route) <= 1;
        } else {
          if (route.path.includes('notice')) {
            return item.path.indexOf(isToParentUrl) > -1;
          } else {
            return routes.indexOf(route) > 1;
          }
        }
      });
      return chilck && goto && route.path !== '/iot/link/Channel' ? (
        <Link to={route.path}>{route.breadcrumbName}</Link>
      ) : (
        <span>{route.breadcrumbName}</span>
      );
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (
        !initialState?.currentUser &&
        location.pathname !== loginPath &&
        location.pathname !== bindPath
      ) {
        history.push(loginPath);
      }
    },
    menuDataRender: () => {
      return getMenus(extraRoutes);
    },
    subMenuItemRender: MenuItemIcon,
    menuItemRender: (menuItemProps, defaultDom) => {
      return MenuItemIcon(menuItemProps, defaultDom, {
        onClick: () => {
          history.push(menuItemProps.path!);
        },
      });
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
    ...initialState?.settings,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    pageTitleRender: (_props, _, info) => {
      if (initialState?.settings?.title) {
        return info?.pageName + ' - ' + initialState?.settings?.title;
      } else {
        return info?.pageName;
      }
    },
    title: (
      <div
        title={initialState?.settings?.title || ''}
        style={{
          maxWidth: 150,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {initialState?.settings?.title}
      </div>
    ),
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
  if (![loginPath, bindPath].includes(history.location.pathname)) {
    //过滤非集成的菜单
    const params = [
      {
        terms: [
          {
            terms: [
              {
                column: 'owner',
                termType: 'eq',
                value: 'iot',
              },
            ],
          },
          {
            terms: [
              {
                column: 'owner',
                termType: 'notnull',
                value: '1',
              },
              {
                column: 'appId',
                termType: 'notnull',
                value: '1',
                type: 'and',
              },
            ],
            type: 'or',
          },
        ],
      },
    ];
    Service.settingDetail('api').then((res) => {
      if (res && res.status === 200 && res.result) {
        localStorage.setItem(SystemConst.AMAP_KEY, res.result.api);
      }
    });
    MenuService.queryOwnThree({ paging: false, terms: params }).then((res) => {
      if (res && res.status === 200) {
        if (isDev) {
          res.result.push({
            code: 'iframe',
            id: 'iframe',
            name: '例子',
            url: '/iframe',
          });
        }
        extraRoutes = handleRoutes([...res.result, ...extraRouteArr]);
        saveMenusCache(extraRoutes);
      }
      oldRender();
    });
  } else {
    oldRender();
  }
}
