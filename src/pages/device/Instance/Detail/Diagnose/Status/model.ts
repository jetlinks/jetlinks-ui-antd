import type { ProductItem } from '@/pages/device/Product/typings';
import { model } from '@formily/reactive';
import type { ReactNode } from 'react';

export const StatusMap = new Map();
StatusMap.set('error', require('/public/images/diagnose/status/error.png'));
StatusMap.set('success', require('/public/images/diagnose/status/success.png'));
StatusMap.set('warning', require('/public/images/diagnose/status/warning.png'));
StatusMap.set('loading', require('/public/images/diagnose/status/loading.png'));

export type ListProps = {
  key: string;
  name: string;
  desc?: string;
  status: 'loading' | 'error' | 'success' | 'warning';
  text?: string;
  info?: ReactNode;
};

export const list = [
  { key: 'status', text: '连接状态' },
  { key: 'message', text: '消息通信' },
];

export const textColorMap = new Map();
textColorMap.set('loading', 'black');
textColorMap.set('error', 'red');
textColorMap.set('success', 'green');
textColorMap.set('warning', 'red');

export const networkInitList: ListProps[] = [
  // {
  //   key: 'access',
  //   name: '设备接入配置',
  //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
  //   status: 'loading',
  //   text: '正在诊断中...',
  //   info: null,
  // },
  {
    key: 'network',
    name: '网络组件',
    desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'gateway',
    name: '设备接入网关',
    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'product',
    name: '产品状态',
    desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'device',
    name: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
];

export const childInitList: ListProps[] = [
  // {
  //   key: 'access',
  //   name: '设备接入配置',
  //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
  //   status: 'loading',
  //   text: '正在诊断中...',
  //   info: null,
  // },
  {
    key: 'network',
    name: '网络组件',
    desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'gateway',
    name: '设备接入网关',
    desc: '诊断设备接入网关状态是否正常，网关配置是否正确',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'parent-device',
    name: '网关父设备',
    desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'product',
    name: '产品状态',
    desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'device',
    name: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
];

export const cloudInitList: ListProps[] = [
  // {
  //   key: 'access',
  //   name: '设备接入配置',
  //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
  //   status: 'loading',
  //   text: '正在诊断中...',
  //   info: null,
  // },
  {
    key: 'gateway',
    name: '设备接入网关',
    desc: '诊断设备接入网关状态是否正常，网关配置是否正确',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'product',
    name: '产品状态',
    desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'device',
    name: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
];

export const channelInitList: ListProps[] = [
  // {
  //   key: 'access',
  //   name: '设备接入配置',
  //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
  //   status: 'loading',
  //   text: '正在诊断中...',
  //   info: null,
  // },
  {
    key: 'gateway',
    name: '设备接入网关',
    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'product',
    name: '产品状态',
    desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'device',
    name: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
];

export const mediaInitList: ListProps[] = [
  // {
  //   key: 'access',
  //   name: '设备接入配置',
  //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
  //   status: 'loading',
  //   text: '正在诊断中...',
  //   info: null,
  // },
  {
    key: 'gateway',
    name: '设备接入网关',
    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'product',
    name: '产品状态',
    desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
  {
    key: 'device',
    name: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    status: 'loading',
    text: '正在诊断中...',
    info: null,
  },
];

export const DiagnoseStatusModel = model<{
  list: ListProps[];
  product: Partial<ProductItem>;
  gateway: any;
  configuration: {
    product: any[];
    device: any[];
  };
  percent: number;
  state: 'loading' | 'success' | 'error'; // 上面的状态
  status: 'loading' | 'finish'; // 检验是否完成检验过程
  count: number;
  logList: any[];
  dialogList: any[];
  allDialogList: any[];
  message: {
    up: {
      text: string;
      status: 'loading' | 'success' | 'error';
    };
    down: {
      text: string;
      status: 'loading' | 'success' | 'error';
    };
  };
}>({
  list: [],
  product: {},
  gateway: {},
  configuration: {
    product: [],
    device: [],
  },
  state: 'loading',
  status: 'loading',
  percent: 0,
  count: 0,
  logList: [],
  dialogList: [],
  allDialogList: [],
  message: {
    up: {
      text: '上行消息诊断中',
      status: 'loading',
    },
    down: {
      text: '下行消息诊断中',
      status: 'loading',
    },
  },
});

export const gatewayList = [
  'websocket-server',
  'http-server-gateway',
  'udp-device-gateway',
  'coap-server-gateway',
  'mqtt-client-gateway',
  'tcp-server-gateway',
];

export const headerColorMap = new Map();
headerColorMap.set('loading', 'linear-gradient(89.95deg, #E6F5FF 0.03%, #E9EAFF 99.95%)');
headerColorMap.set(
  'error',
  'linear-gradient(89.95deg, rgba(231, 173, 86, 0.1) 0.03%, rgba(247, 111, 93, 0.1) 99.95%)',
);
headerColorMap.set('success', 'linear-gradient(89.95deg, #E8F8F7 0.03%, #EBEFFA 99.95%)');

export const headerTextMap = new Map();
headerTextMap.set('loading', '正在诊断中');
headerTextMap.set('error', '发现连接问题');
headerTextMap.set('success', '连接状态正常');

export const headerDescMap = new Map();
headerDescMap.set('loading', '已诊断XX个');
headerDescMap.set('error', '请处理连接异常');
headerDescMap.set('success', '现在可调试消息通信');

export const headerImgMap = new Map();
headerImgMap.set('loading', require('/public/images/diagnose/loading-2.png'));
headerImgMap.set('error', require('/public/images/diagnose/error.png'));
headerImgMap.set('success', require('/public/images/diagnose/success.png'));

export const progressMap = new Map();
progressMap.set('loading', '#597EF7');
progressMap.set('error', '#FAB247');
progressMap.set('success', '#32D4A4');

export const messageStyleMap = new Map();
messageStyleMap.set('loading', {
  background: 'linear-gradient(0deg, rgba(30, 165, 241, 0.03), rgba(30, 165, 241, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #1EA5F1',
});
messageStyleMap.set('error', {
  background: 'linear-gradient(0deg, rgba(255, 77, 79, 0.03), rgba(255, 77, 79, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #FF4D4F',
});
messageStyleMap.set('success', {
  background: 'linear-gradient(0deg, rgba(50, 212, 164, 0.03), rgba(50, 212, 164, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #32D4A4',
});

export const messageStatusMap = new Map();
messageStatusMap.set('loading', 'processing');
messageStatusMap.set('error', 'error');
messageStatusMap.set('success', 'success');

export const urlMap = new Map();
urlMap.set('mqtt-client-gateway', 'topic');
urlMap.set('http-server-gateway', 'url');
urlMap.set('websocket-server', 'url');
urlMap.set('coap-server-gateway', 'url');
