import { model } from '@formily/reactive';
import type { ReactNode } from 'react';

type StatusProps = {
  status: 'loading' | 'error' | 'success' | 'warning';
  text: string;
  info: null | ReactNode;
};

// export const initStatus = {
//   product: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
//   config: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
//   device: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
//   deviceConfig: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
//   gateway: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
//   network: {
//     status: 'loading',
//     text: '正在诊断中...',
//     info: null,
//   },
// };

export const DiagnoseStatusModel = model<{
  status: {
    product: StatusProps;
    config: StatusProps;
    device: StatusProps;
    deviceConfig: StatusProps;
    gateway: StatusProps;
    network: StatusProps;
  };
}>({
  status: {
    product: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    config: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    device: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    deviceConfig: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    gateway: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    network: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
  },
});
