/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { router } from 'umi';
import { stringify } from 'qs';
import { getAccessToken } from './authority';
import { getPageQuery } from './utils';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response | undefined => {
  const {
    // response: { status },
    response,
  } = error;

  // if (response && response.status) {
  // const errorText = codeMessage[response.status] || response.statusText;
  // const { status, url } = response;

  // notification.error({
  //   message: `请求错误 ${status}: ${url}`,
  //   description: errorText,
  // });
  if (response) {
    if (response.status === 401) {
      notification.error({
        key: 'error',
        message: '未登录或登录已过期，请重新登录。',
      });
      // const { redirect } = getPageQuery();
      router.push('/user/login');
      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   router.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       // redirect: window.location.href,
      //     }),
      //   });
      // } else {

      // }
    } else if (response.status === 400) {
      response.text().then(resp => {
        if (resp) {
          notification.error({
            key: 'error',
            message: JSON.parse(resp).message,
          });
        } else {
          response.json().then((res: any) => {
            notification.error({
              key: 'error',
              message: `请求错误：${res.message}`,
            });
          });
        }
      });
      return response;
    } else if (response.status === 500) {
      response
        .json()
        .then((res: any) => {
          notification.error({
            key: 'error',
            message: `${res.message}`,
          });
        })
        .catch(() => {
          notification.error({
            key: 'error',
            message: response.statusText,
          });
        });
    } else if (response.status === 504) {
      notification.error({
        key: 'error',
        message: '服务器错误',
      });

      // router.push('/user/login');
    } else if (response.status === 403) {
      response.json().then((res: any) => {
        notification.error({
          key: 'error',
          message: `${res.message}`,
        });
      });

      // router.push('/exception/403');
      // return;
    } else if (response.status === 404) {
      // console.log(status, '状态');
      router.push('/exception/404');
    } else {
      notification.error({
        key: 'error',
        message: '服务器内部错误',
      });
    }
  } else {
    notification.error({
      key: 'error',
      message: '服务器内部错误,请检测您的配置',
    });
  }
  return response;
  // } else if (!response) {
  //   notification.error({
  //     description: '您的网络发生异常，无法连接服务器',
  //     message: '网络异常',
  //   });
  // }
  // return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => ({
  // url: url.replace('jetlinks', 'mock'),//使用mock数据
  // url: 'http://localhost:8000' + url.replace('/jetlinks', ''),
  // url: 'http://2.jetlinks.org:9010' + url.replace('/jetlinks', ''),
  options: {
    ...options,
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    interceptors: true,
  },
}));
export default request;
