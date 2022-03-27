// 路由components映射
import type { IRouteProps } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';

/** localStorage key */
export const MENUS_DATA_CACHE = 'MENUS_DATA_CACHE';

/** 路由Code */
export const MENUS_CODE = {
  'Analysis/CPU': 'Analysis/CPU',
  'Analysis/DeviceChart': 'Analysis/DeviceChart',
  'Analysis/DeviceMessage': 'Analysis/DeviceMessage',
  'Analysis/Jvm': 'Analysis/Jvm',
  'Analysis/MessageChart': 'Analysis/MessageChart',
  Analysis: 'Analysis',
  'cloud/Aliyun': 'cloud/Aliyun',
  'cloud/Ctwing': 'cloud/Ctwing',
  'cloud/DuerOS': 'cloud/DuerOS',
  'cloud/Onenet': 'cloud/Onenet',
  'device/Alarm': 'device/Alarm',
  'device/Category/Save': 'device/Category/Save',
  'device/Category': 'device/Category',
  'device/Command': 'device/Command',
  'device/DataSource': 'device/DataSource',
  'device/Firmware/Detail/History': 'device/Firmware/Detail/History',
  'device/Firmware/Detail/Task/Detail': 'device/Firmware/Detail/Task/Detail',
  'device/Firmware/Detail/Task/Release': 'device/Firmware/Detail/Task/Release',
  'device/Firmware/Detail/Task/Save': 'device/Firmware/Detail/Task/Save',
  'device/Firmware/Detail/Task': 'device/Firmware/Detail/Task',
  'device/Firmware/Detail': 'device/Firmware/Detail',
  'device/Firmware/Save': 'device/Firmware/Save',
  'device/Firmware': 'device/Firmware',
  'device/Instance/Detail/Config/Tags': 'device/Instance/Detail/Config/Tags',
  'device/Instance/Detail/Config': 'device/Instance/Detail/Config',
  'device/Instance/Detail/Functions': 'device/Instance/Detail/Functions',
  'device/Instance/Detail/Info': 'device/Instance/Detail/Info',
  'device/Instance/Detail/Log': 'device/Instance/Detail/Log',
  'device/Instance/Detail/MetadataLog/Event': 'device/Instance/Detail/MetadataLog/Event',
  'device/Instance/Detail/MetadataLog/Property': 'device/Instance/Detail/MetadataLog/Property',
  'device/Instance/Detail/Running': 'device/Instance/Detail/Running',
  'device/Instance/Detail': 'device/Instance/Detail',
  'device/Instance': 'device/Instance',
  'device/Location': 'device/Location',
  'device/Product/Detail/BaseInfo': 'device/Product/Detail/BaseInfo',
  'device/Product/Detail': 'device/Product/Detail',
  'device/Product/Save': 'device/Product/Save',
  'device/Product': 'device/Product',
  'device/components/Alarm/Edit': 'device/components/Alarm/Edit',
  'device/components/Alarm/Record': 'device/components/Alarm/Record',
  'device/components/Alarm/Setting': 'device/components/Alarm/Setting',
  'device/components/Alarm': 'device/components/Alarm',
  'device/components/Metadata/Base/Edit': 'device/components/Metadata/Base/Edit',
  'device/components/Metadata/Base': 'device/components/Metadata/Base',
  'device/components/Metadata/Cat': 'device/components/Metadata/Cat',
  'device/components/Metadata/Import': 'device/components/Metadata/Import',
  'device/components/Metadata': 'device/components/Metadata',
  'edge/Device': 'edge/Device',
  'edge/Product': 'edge/Product',
  'link/Certificate': 'link/Certificate',
  'link/Gateway': 'link/Gateway',
  'link/Opcua': 'link/Opcua',
  'link/Protocol/Debug': 'link/Protocol/Debug',
  'link/Protocol': 'link/Protocol',
  'link/Type': 'link/Type',
  'link/Type/Save': 'link/Type/Save',
  'link/AccessConfig': 'link/AccessConfig',
  'link/AccessConfig/Detail': 'link/AccessConfig/Detail',
  'log/Access': 'log/Access',
  'log/System': 'log/System',
  'media/Cascade': 'media/Cascade',
  'media/Config': 'media/Config',
  'media/Device': 'media/Device',
  'media/Reveal': 'media/Reveal',
  'notice/Config': 'notice/Config',
  'notice/Template': 'notice/Template',
  'rule-engine/Instance': 'rule-engine/Instance',
  'rule-engine/SQLRule': 'rule-engine/SQLRule',
  'rule-engine/Scene': 'rule-engine/Scene',
  'simulator/Device': 'simulator/Device',
  'system/DataSource': 'system/DataSource',
  'system/Department/Assets': 'system/Department/Assets',
  'system/Department/Member': 'system/Department/Member',
  'system/Department': 'system/Department',
  'system/Menu/Detail': 'system/Menu/Detail',
  'system/Menu': 'system/Menu',
  'system/OpenAPI': 'system/OpenAPI',
  'system/Permission': 'system/Permission',
  'system/Role/Edit': 'system/Role/Edit',
  'system/Role': 'system/Role',
  'system/Tenant/Detail/Assets': 'system/Tenant/Detail/Assets',
  'system/Tenant/Detail/Info': 'system/Tenant/Detail/Info',
  'system/Tenant/Detail/Member': 'system/Tenant/Detail/Member',
  'system/Tenant/Detail/Permission': 'system/Tenant/Detail/Permission',
  'system/Tenant/Detail': 'system/Tenant/Detail',
  'system/Tenant': 'system/Tenant',
  'system/User': 'system/User',
  'user/Login': 'user/Login',
  'visualization/Category': 'visualization/Category',
  'visualization/Configuration': 'visualization/Configuration',
  'visualization/Screen': 'visualization/Screen',
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
 * 处理为正确的路由格式
 * @param extraRoutes 后端菜单数据
 * @param level 路由层级
 */

const allComponents = findComponents(require.context('@/pages', true, /index(\.tsx)$/));
const getRoutes = (extraRoutes: MenuItem[], level = 1): IRouteProps[] => {
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
              redirect: redirect,
            },
          ]
        : flatRoutes;
    }

    if (component) {
      _route.component = component;
    }

    if (level !== 1) {
      _route.exact = true;
    }

    return _route;
  });
};

export const getMenus = (extraRoutes: IRouteProps[], level: number = 1): any[] => {
  return extraRoutes.map((route) => {
    const children =
      route.children && route.children.length ? getMenus(route.children, level + 1) : [];
    const _route = {
      key: route.url,
      name: route.name,
      path: route.url,
      icon: route.icon,
      exact: level !== 1 ? true : false,
      children: children,
    };
    return _route;
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
  return id ? menusData.replace(regStr, id) : menusData;
};

export default getRoutes;
