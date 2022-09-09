// 路由components映射
import type { IRouteProps } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';
import type { BUTTON_PERMISSION, MENUS_CODE_TYPE } from './router';
import { getDetailNameByCode, MENUS_CODE } from './router';

/** localStorage key */
export const MENUS_DATA_CACHE = 'MENUS_DATA_CACHE';
export const MENUS_BUTTONS_CACHE = 'MENUS_BUTTONS_CACHE';

const DetailCode = 'detail';

// 额外子级路由
const extraRouteObj = {
  notice: {
    children: [
      { code: 'Config', name: '通知配置' },
      { code: 'Template', name: '通知模版' },
    ],
  },
  'media/Cascade': {
    children: [
      { code: 'Save', name: '新增' },
      { code: 'Channel', name: '选择通道' },
    ],
  },
  'media/Device': {
    children: [
      { code: 'Save', name: '详情' },
      { code: 'Channel', name: '通道列表' },
      { code: 'Playback', name: '回放' },
    ],
  },
  'rule-engine/Scene': {
    children: [
      { code: 'Save', name: '详情' },
      { code: 'Save2', name: '测试详情' },
    ],
  },
  'device/Firmware': {
    children: [{ code: 'Task', name: '升级任务' }],
  },
  // 'link/Channel': {
  //   children: [
  //     {
  //       code: 'Opcua',
  //       name: 'OPC UA',
  //       children: [
  //         {
  //           code: 'Access',
  //           name: '数据点绑定',
  //         },
  //       ],
  //     },
  //     {
  //       code: 'Modbus',
  //       name: 'Modbus',
  //       children: [
  //         {
  //           code: 'Access',
  //           name: '数据点绑定',
  //         },
  //       ],
  //     },
  //   ],
  // },
  demo: {
    children: [{ code: 'AMap', name: '地图' }],
  },
  'system/Platforms': {
    children: [
      { code: 'Api', name: '赋权' },
      { code: 'View', name: 'Api详情' },
    ],
  },
  'system/DataSource': {
    children: [{ code: 'Management', name: '管理' }],
  },
  'system/Menu': {
    children: [{ code: 'Setting', name: '菜单配置' }],
  },
  'system/Apply': {
    children: [
      { code: 'Api', name: '赋权' },
      { code: 'View', name: 'Api详情' },
      { code: 'Save', name: '详情' },
    ],
  },
};
//额外路由
export const extraRouteArr = [
  {
    code: 'account',
    id: 'accout',
    name: '个人中心',
    url: '/account',
    hideInMenu: true,
    children: [
      {
        code: 'account/Center',
        name: '基本设置',
        url: '/account/center',
      },
      {
        code: 'account/NotificationSubscription',
        name: '通知订阅',
        url: '/account/NotificationSubscription',
      },
      {
        code: 'account/NotificationRecord',
        name: '通知记录',
        url: '/account/NotificationRecord',
      },
    ],
  },
];
/**
 * 根据url获取映射的组件
 * @param files
 */
const findComponents = (files: __WebpackModuleApi.RequireContext) => {
  const modules = {};
  files.keys().forEach((key) => {
    // 删除路径开头的./ 以及结尾的 /index；
    const str = key.replace(/(\.\/|\.tsx)/g, '').replace('/index', '');
    modules[str] = files(key).default;
  });
  return modules;
};

/**
 * 扁平化路由树
 * @param routes
 */
export const flatRoute = (routes: MenuItem[]): MenuItem[] => {
  return routes.reduce<MenuItem[]>((pValue, currValue) => {
    const menu: MenuItem[] = [];
    const { children, ...extraRoute } = currValue;
    menu.push(extraRoute);
    return [...pValue, ...menu, ...flatRoute(children || [])];
  }, []);
};

/**
 * 获取菜单详情组件
 * @param baseCode
 * @url 菜单url
 */
const findDetailRoute = (baseCode: string, url: string): MenuItem | undefined => {
  if (baseCode) {
    const allComponents = findComponents(require.context('@/pages', true, /index(\.tsx)$/));
    const code = `${baseCode}/Detail`;
    const path = `${url}/${DetailCode}/:id`;
    const component = allComponents[code];
    return component
      ? ({ path: path, url: path, name: getDetailNameByCode[code], hideInMenu: true, code } as
          | MenuItem
          | any)
      : undefined;
  }
  return undefined;
};

const findExtraRoutes = (baseCode: string, children: any[], url: string) => {
  const allComponents = findComponents(require.context('@/pages', true, /index(\.tsx)$/));
  return children
    .map((route) => {
      const code = `${baseCode}/${route.code}`;
      const path = `${url}/${route.code}`;
      const component = allComponents[code];

      const _route: any = {
        path: path,
        url: path,
        name: route.name,
        hideInMenu: true,
        code: code,
      };

      if (route.children && route.children.length) {
        _route.children = findExtraRoutes(code, route.children, path);
      }

      return component ? _route : undefined;
    })
    .filter((item) => !!item);
};

/**
 * 处理实际路由情况，会包含不显示的子级路由，比如详情
 * @param routes
 * @param level
 */
export const handleRoutes = (routes?: MenuItem[], level = 1): MenuItem[] => {
  return routes
    ? routes.map((item) => {
        // 判断当前是否有额外子路由
        const extraRoutes = extraRouteObj[item.code];
        if (extraRoutes) {
          if (extraRoutes.children) {
            const eRoutes = findExtraRoutes(item.code, extraRoutes.children, item.url);
            item.children = item.children ? [...eRoutes, ...item.children] : eRoutes;
          }
        }

        const detailComponent = findDetailRoute(item.code, item.url);
        if (detailComponent) {
          item.children = item.children ? [detailComponent, ...item.children] : [detailComponent];
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (item.children) {
          item.children = handleRoutes(item.children, level + 1);
        }
        item.level = level;

        return item;
      })
    : [];
};

/**
 * 处理为正确的路由格式
 * @param extraRoutes 后端菜单数据
 * @param level 路由层级
 */
const getRoutes = (extraRoutes: MenuItem[], level = 1): IRouteProps[] => {
  const allComponents = findComponents(require.context('@/pages', true, /index(\.tsx)$/));
  return extraRoutes.map((route) => {
    let component;
    let _route: IRouteProps;
    if (route.appId) {
      component = allComponents['iframe'];
      _route = {
        key: `${route.url}`,
        name: route.name,
        path: `${route.url}`,
      };
    } else {
      component = allComponents[route.code] || null;
      _route = {
        key: route.url,
        name: route.name,
        path: route.url,
      };
    }

    // console.log(_route)
    if (route.children && route.children.length) {
      const flatRoutes = getRoutes(flatRoute(route.children || []), level + 1);
      const redirect = flatRoutes.filter((r) => r.component)[0]?.path;
      _route.children = redirect
        ? [
            ...flatRoutes,
            {
              path: _route.path,
              exact: true,
              redirect: redirect,
            },
          ]
        : flatRoutes;
    } else if (component) {
      _route.component = component;
    }

    if (level !== 1) {
      _route.exact = true;
    }
    console.log(_route);
    return _route;
  });
};

export const getMenus = (extraRoutes: IRouteProps[]): any[] => {
  return extraRoutes.map((route) => {
    const children = route.children && route.children.length ? route.children : [];

    return {
      key: route.url,
      name: route.name,
      path: route.url,
      icon: route.icon,
      hideInMenu: !!route.hideInMenu,
      exact: route.level !== 1,
      children: getMenus(children),
    };
  });
};

/** 缓存路由数据，格式为 [{ code: url }] */
export const saveMenusCache = (routes: MenuItem[]) => {
  const list: MenuItem[] = flatRoute(routes);
  const listObject = {};
  const buttons = {};
  list.forEach((route) => {
    listObject[route.code] = route.url;
  });
  // 过滤按钮权限
  list
    .filter((item) => item.buttons)
    .forEach((item) => {
      buttons[item.code] = item.buttons.map((btn) => btn.id);
    });
  try {
    localStorage.setItem(MENUS_DATA_CACHE, JSON.stringify(listObject));
    localStorage.setItem(MENUS_BUTTONS_CACHE, JSON.stringify(buttons));
  } catch (e) {
    console.warn(e);
  }
};

/**
 * 匹配按钮权限
 * @param code 路由code
 * @param permission {string | string[]} 权限名称
 */
export const getButtonPermission = (
  code: MENUS_CODE_TYPE,
  permission: BUTTON_PERMISSION | BUTTON_PERMISSION[],
): boolean => {
  if (!code) {
    return false;
  }

  let buttons = {};
  try {
    const buttonString = localStorage.getItem(MENUS_BUTTONS_CACHE);
    buttons = JSON.parse(buttonString || '{}');
  } catch (e) {
    console.warn(e);
  }

  if (!!Object.keys(buttons).length && permission) {
    const _buttonArray = buttons[code];
    if (!_buttonArray) {
      return true;
    }
    return !_buttonArray.some((btnId: string) => {
      if (typeof permission === 'string') {
        return permission === btnId;
      } else {
        return permission.includes(btnId);
      }
      return false;
    });
  }
  return true;
};

/**
 * 通过缓存的数据取出相应的路由url
 * @param code
 */
export const getMenuPathByCode = (code: MENUS_CODE_TYPE): string => {
  const menusStr = localStorage.getItem(MENUS_DATA_CACHE) || '{}';
  const menusData = JSON.parse(menusStr);
  return menusData[code];
};

/**
 * 通过缓存的数据取出相应的路由url
 * @param code 路由Code
 * @param id 路由携带参数
 * @param regStr 路由参数code
 */
export const getMenuPathByParams = (code: string, id?: string, regStr: string = ':id') => {
  const menusData = getMenuPathByCode(code);
  if (!menusData) {
    console.warn('menusData is', menusData);
  }
  return id && menusData ? menusData.replace(regStr, id) : menusData;
};

export default getRoutes;

export { MENUS_CODE };
