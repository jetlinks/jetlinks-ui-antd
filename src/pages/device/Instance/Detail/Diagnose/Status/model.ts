import { model } from '@formily/reactive';
import type { ReactNode } from 'react';

type StatusProps = {
  status: 'loading' | 'error' | 'success' | 'warning';
  text: string;
  info: null | ReactNode;
};

type ListProps = {
  key: string;
  name: string;
  data: string;
  desc: string;
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
  list: ListProps[];
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
  list: [
    {
      key: 'config',
      name: '设备接入配置',
      data: 'config',
      desc: '诊断设备接入配置是否正确，配置错误将导致连接失败',
    },
    {
      key: 'network',
      name: '网络信息',
      data: 'network',
      desc: '诊断网络组件配置是否正确，配置错误将导致连接失败',
    },
    {
      key: 'product',
      name: '产品状态',
      data: 'product',
      desc: '诊断产品状态是否已发布，未发布的状态将导致连接失败',
    },
    {
      key: 'device',
      name: '设备状态',
      data: 'device',
      desc: '诊断设备状态是否已启用，未启用的状态将导致连接失败',
    },
  ],
});
