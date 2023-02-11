import moment from 'moment';
import type { Field, FieldDataSource } from '@formily/core';
import { action } from '@formily/reactive';
import Token from '@/utils/token';
import { message } from 'antd';
import SystemConst from '@/utils/const';

/**
 * 下载文件
 * @param url 下载链接
 * @param params 参数
 */
export const downloadFile = (url: string, params?: Record<string, any>) => {
  const formElement = document.createElement('form');
  formElement.style.display = 'display:none;';
  formElement.method = 'GET';
  formElement.action = url;
  // 添加参数
  if (params) {
    Object.keys(params).forEach((key: string) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = key;
      inputElement.value = params[key];
      formElement.appendChild(inputElement);
    });
  }
  const inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  inputElement.name = ':X_Access_Token';
  inputElement.value = Token.get();
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);
  formElement.submit();
  document.body.removeChild(formElement);
};

export const downloadFileByUrl = (url: string, name: string, type: string) => {
  const downNode = document.createElement('a');
  downNode.style.display = 'none';
  downNode.download = `${name}.${type}`;
  downNode.href = url;
  document.body.appendChild(downNode);
  downNode.click();
  document.body.removeChild(downNode);
};

/**
 * 把数据下载成JSON
 * @param record
 * @param fileName
 */
export const downloadObject = (record: Record<string, any>, fileName: string, format?: string) => {
  // 创建隐藏的可下载链接
  const ghostLink = document.createElement('a');
  ghostLink.download = `${fileName ? '' : record?.name}${fileName}_${moment(new Date()).format(
    format || 'YYYY_MM_DD',
  )}.json`;
  ghostLink.style.display = 'none';
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  ghostLink.href = URL.createObjectURL(blob);
  //触发点击
  document.body.appendChild(ghostLink);
  ghostLink.click();
  //移除
  document.body.removeChild(ghostLink);
};

export const downloadTxT = (record: Record<string, any>, fileName: string, format?: string) => {
  // 创建隐藏的可下载链接
  const ghostLink = document.createElement('a');
  ghostLink.download = `${fileName ? '' : record?.name}${fileName}_${moment(new Date()).format(
    format || 'YYYY_MM_DD',
  )}.txt`;
  ghostLink.style.display = 'none';
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  ghostLink.href = URL.createObjectURL(blob);
  //触发点击
  document.body.appendChild(ghostLink);
  ghostLink.click();
  //移除
  document.body.removeChild(ghostLink);
};

export const useAsyncDataSource =
  (services: (arg0: Field) => Promise<FieldDataSource>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        field.dataSource = resp;
        field.loading = false;
      }),
    );
  };

export const getDateFormat = (
  date: moment.MomentInput,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  return date ? moment(date).format(format) : '-';
};

/**
 * 扁平化树数组
 */
export const flattenArray: any = (arr: any[]) => {
  return (arr || []).reduce((result, item) => {
    return result.concat(item, Array.isArray(item.children) ? flattenArray(item.children) : []);
  }, []);
};
/**
 * 判断是否为正确的IP地址
 */
export const testIP = (str: string) => {
  const re =
    /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
  return re.test(str);
};

export const testIPv6 = (str: string) => {
  const re =
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  return re.test(str);
};

export const testDomain = (str: string) => {
  const re = /([0-9a-z-]{2,}\.[0-9a-z-]{2,3}\.[0-9a-z-]{2,3}|[0-9a-z-]{2,}\.[0-9a-z-]{2,3})$/i;
  return re.test(str);
};

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

/**
 * 获取当前DOM元素需要撑满的高度
 * @param className
 * @param extraHeight 额外减去的高度
 */
export const getDomFullHeight = (className: string, extraHeight: number = 0): number => {
  const dom = document.querySelector(`.${className}`);
  if (dom) {
    const bodyClient = document.body.getBoundingClientRect();
    const domClient = dom.getBoundingClientRect();
    if (domClient.y < 50) {
      return 100;
    }
    return bodyClient.height - domClient.y - 24 - extraHeight;
  }
  return 0;
};
export const onlyMessage = (
  msg: string,
  type: 'success' | 'error' | 'warning' = 'success',
  key: number = 1,
) =>
  message[type]({
    content: msg,
    key: key,
  });

export const isNoCommunity = !(localStorage.getItem(SystemConst.Version_Code) === 'community');
/**
 * 座机号+手机号校验
 * @param value
 * @returns {boolean}
 */
export const phoneRegEx = (value: string) => {
  const phone = new RegExp(
    '^(((\\+86)|(\\+86-))|((86)|(86\\-))|((0086)|(0086\\-)))?1[3|5|7|8|9]\\d{9}$',
  );
  const mobile = /(0[0-9]{2,3})([2-9][0-9]{6,7})+([0-9]{8,11})?$/;
  return phone.test(value) || mobile.test(value);
};

export const ArrayToTree = (list: any[]): any[] => {
  const treeList: any[] = [];
  // 所有项都使用对象存储起来
  const map = {};

  // 建立一个映射关系：通过id快速找到对应的元素
  list.forEach((item) => {
    if (!item.children) {
      item.children = [];
    }
    map[item.id] = item;
  });

  list.forEach((item) => {
    // 对于每一个元素来说，先找它的上级
    //    如果能找到，说明它有上级，则要把它添加到上级的children中去
    //    如果找不到，说明它没有上级，直接添加到 treeList
    const parent = map[item.parentId];
    // 如果存在则表示item不是最顶层的数据
    if (parent) {
      parent.children.push(item);
    } else {
      // 如果不存在 则是顶层数据
      treeList.push(item);
    }
  });
  // 返回出去
  return treeList;
};
