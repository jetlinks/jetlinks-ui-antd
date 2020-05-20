// import { message } from 'antd';

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // eslint-disable-next-line no-console
      console.error(err.message);
    },
  },
};

localStorage.setItem('umi_locale', 'zh-CN');
