import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { MenuDataItem } from '@ant-design/pro-layout';
import { DeviceProductModelState } from '@/pages/device/product/model';
import { UsersModelState } from '@/pages/system/users/model';
import { RoleModelState } from '@/pages/system/role/model';
import { PermissionModelState } from '@/pages/system/permission/model';
import { DeviceInstanceModelState } from '@/pages/device/instance/model';
import { EmailModelState } from '@/pages/rule-engine/email/model';
import { SmsModelState } from '@/pages/rule-engine/sms/model';
import { MqttClientModelState } from '@/pages/network/mqtt-client/model';
import { RuleInstanceModelState } from '@/pages/rule-engine/instance/model';
// import { RuleModelItem } from '@/pages/rule-engine/model/data';
import { RuleModelModelState } from '@/pages/rule-engine/model/model';
import { ProtocolModelState } from '@/pages/device/protocol/model';
import { OpenApiModelState } from '@/pages/system/open-api/model';
import { CertificateModelState } from '@/pages/network/certificate/model';
import { CoapClientModelState } from '@/pages/network/coap-client/model';
import { HttpClientModelState } from '@/pages/network/http-client/model';
import { WebsocketClientModelState } from '@/pages/network/websocket-client/model';
import { AccessLoggerModelState } from '@/pages/logger/access/model';
import { SystemLoggerModelState } from '@/pages/logger/system/model';
import { NetworkTypeState } from '@/pages/network/type/model';
import { NoticeTemplateState } from '@/pages/notice/template/model';
import { NoticeConfigState } from '@/pages/notice/config/model';
import { OrgModelState } from '@/pages/system/org/model';
import { DeviceGatewayState } from '@/pages/device/gateway/model';

export { GlobalModelState, SettingModelState, UserModelState };

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global: boolean;
    menu: boolean;
    setting: boolean;
    user: boolean; // 当前登录用户
    users: boolean; // 用户管理
    role: boolean;
    permission: boolean;
    deviceProduct: boolean;
    deviceInstance: boolean;
    email: boolean;
    sms: boolean;
    mqttClient: boolean;
    ruleInstance: boolean;
    ruleModel: boolean;
    protocol: boolean;
    openApi: boolean;
    certificate: boolean;
    coapClient: boolean;
    httpClient: boolean;
    websocketClient: boolean;
    accessLogger: boolean;
    systemLogger: boolean;
    networkType: boolean;
    gateway: boolean;
    deviceGateway: boolean;
    noticeTemplate: boolean;
    noticeConfig: boolean;
    org: boolean;
    settings: boolean
  };
}

export interface ConnectState {
  login: LoginModelType;
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  users: UsersModelState;
  role: RoleModelState;
  permission: PermissionModelState;
  deviceProduct: DeviceProductModelState;
  deviceInstance: DeviceInstanceModelState;
  email: EmailModelState;
  sms: SmsModelState;
  mqttClient: MqttClientModelState;
  ruleInstance: RuleInstanceModelState;
  ruleModel: RuleModelModelState;
  protocol: ProtocolModelState;
  openApi: OpenApiModelState;
  certificate: CertificateModelState;
  coapClient: CoapClientModelState;
  httpClient: HttpClientModelState;
  websocketClient: WebsocketClientModelState;
  accessLogger: AccessLoggerModelState;
  systemLogger: SystemLoggerModelState;
  networkType: NetworkTypeState;
  gateway: GatewayModelState;
  deviceGateway: DeviceGatewayState;
  noticeTemplate: NoticeTemplateState;
  noticeConfig: NoticeConfigState;
  org: OrgModelState;
  settings: SettingModelState
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T extends { [key: string]: any } = {}>
  extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch;
}

// export default ConnectState;
