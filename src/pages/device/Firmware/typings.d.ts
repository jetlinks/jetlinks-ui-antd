import type { State } from '@/utils/typings';

type FirmwareItem = {
  createTime: number;
  id: string;
  name: string;
  productId: string;
  productName: string;
  sign: string;
  signMethod: string;
  size: number;
  url: string;
  version: string;
  versionOrder: number;
  mode: any;
  deviceId: any;
};

type TaskItem = {
  id: string;
  name: string;
  productId: string;
  createTime: number;
  firmwareId: string;
  mode: State;
  timeoutSeconds: number;
};

type HistoryItem = {
  id: string;
  createTime: number;
  deviceId: string;
  deviceName: string;
  firmwareId: string;
  productId: string;
  progress: number;
  state: State;
  taskId: string;
  taskName: string;
  timeoutSeconds: number;
  version: string;
  versionOrder: number;
};
