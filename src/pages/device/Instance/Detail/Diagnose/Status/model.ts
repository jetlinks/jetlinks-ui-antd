import { model } from '@formily/reactive';
import type { ReactNode } from 'react';

type StatusProps = {
  status: 'loading' | 'error' | 'success' | 'warning';
  text: string;
  info: null | ReactNode;
};

export const DiagnoseStatusModel = model<{
  status: {
    config?: StatusProps;
    network?: StatusProps;
    product?: StatusProps;
    device?: StatusProps;
    productAuth?: StatusProps;
    deviceAuth?: StatusProps;
    deviceAccess?: StatusProps;
    other?: StatusProps;
  };
}>({
  status: {
    config: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    network: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    product: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    device: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    deviceAccess: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    other: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
  },
});
