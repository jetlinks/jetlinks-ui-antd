// 路由components映射
import type { IRouteProps } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';
import { getDetailNameByCode, MENUS_CODE } from './router';

/** localStorage key */
export const MENUS_DATA_CACHE = 'MENUS_DATA_CACHE';

const DetailCode = 'detail';

// 额外子级路由
const extraRouteObj = {
  notice: {
    children: [
      { code: 'Config', name: '通知配置' },
      { code: 'Template', name: '通知模板' },
    ],
  },
};

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
        } else {
          const detailComponent = findDetailRoute(item.code, item.url);
          if (detailComponent) {
            item.children = item.children ? [detailComponent, ...item.children] : [detailComponent];
          }
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
    const component = allComponents[route.code] || null;
    const _route: IRouteProps = {
      key: route.url,
      name: route.name,
      path: route.url,
    };

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
  list.forEach((route) => {
    listObject[route.code] = route.url;
  });
  try {
    localStorage.setItem(MENUS_DATA_CACHE, JSON.stringify(listObject));
  } catch (e) {
    console.log(e);
  }
};

/**
 * 通过缓存的数据取出相应的路由url
 * @param code
 */
export const getMenuPathByCode = (code: string): string => {
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
