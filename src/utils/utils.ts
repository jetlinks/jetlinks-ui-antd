import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { isEqual } from 'lodash';
import proxy from '../../config/proxy';
import moment from "moment";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 自己加的
/**
 * 字符串替换
 * @param  {string} value    要被替换的字符串
 * @param  {string} searchValue 要替换的字符串
 * @param  {string} replaceValue 用于替换的字符串
 * @return {string}        替换后的新字符串
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const regReplace = (value: string, searchValue: string, replaceValue: string): string => {
//   const tempReg = searchValue.replace(/[.\\[\]{}()|^$?*+]/g, '\\$&'); // 转义字符串中的元字符
//   const re = new RegExp(tempReg, 'g'); // 生成正则
//   return value.replace(re, replaceValue);
// };

// 生成随机数
export const randomString = (length?: number) => {
  const tempLength = length || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < tempLength; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

export const downloadObject = (record: any, fileName: string) => {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = `${fileName}-${record.name || moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}.json`;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  const blob = new Blob([JSON.stringify(record)]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export const wrapAPI = (url: string) => {
  if (REACT_APP_ENV === 'dev') {
    return url.replace('/jetlinks/', proxy.dev['/jetlinks'].target);
  }
  return url;
};
/**
 * form 方法受控组件减少不必要渲染
 * @param prevProps
 * @param nextProps
 */
export const propsAreEqual = (prevProps: any, nextProps: any) => isEqual(prevProps.value, nextProps.value);

/**
 * 转换对象KEY
 * @param data 原始对象
 * @param keyMap 原始KEY与转换KEY
 */
export const converObjectKey = (data: any, keyMap: any) => {
  const tempData = {};
  Object.keys(data).forEach(i => {
    const tempKey = keyMap[i] || i;
    tempData[tempKey] = data[i]
  })
  return tempData;
}

export const converFilter = (data: any, flag: string) => {
  const tempData = {};
  Object.keys(data).forEach(i => {
    tempData[`${i}${flag}`] = data[i]
  });
  return tempData;
}
