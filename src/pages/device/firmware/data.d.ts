import { SimpleType } from '@/utils/common';

export class FirmwareData extends SimpleType {

  id: string;

  productId: string;

  productName: string;

  name: string;

  version: string;

  versionOrder: number;

  url: string;

  sign: string;

  signMethod: string;

  size: number;

  createTime: number;

  properties: {
    id: string;
    name: string;
    value: string;
  };

  description: string;
}

export class UpgradeTaskData extends SimpleType {

  id: string;

  productId: string;

  firmwareId: string;

  description: string;

  timeoutSeconds: number;

  name: string;

  createTime: number;

  mode: {
    text: string,
    value: string,
  };
}

export class UpgradeHistoryData extends SimpleType {

  id: string;

  productId: string;

  firmwareId: string;

  deviceId: string;

  deviceName: string;

  version: string;

  versionOrder: number;

  taskId: string;

  taskName: string;

  createTime: number;

  upgradeTime: number;

  completeTime: number;

  timeoutSeconds: number;

  errorReason: string;

  state: {
    text: string,
    value: string
  };
}
