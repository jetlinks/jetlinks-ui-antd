export type CatalogItemType = {
  district?: string;
  device?: string;
  platform?: string;
  user?: string;
  platform_outer?: string;
  ext?: string;
};

export interface CatalogItem {
  id: string;
  channelId: string;
  deviceId: string;
  name: string;
  type: CatalogItemType;
  createTime: number;
  modifyTime: number;
  children?: CatalogItem[];
}

export type ChannelStatusType =
  | 'online'
  | 'lost'
  | 'defect'
  | 'add'
  | 'delete'
  | 'update'
  | 'offline';

export type PtzType = 'unknown' | 'ball' | 'hemisphere' | 'fixed' | 'remoteControl';

export type CatalogType = keyof CatalogItemType;

export type ChannelType =
  | 'dv_no_storage'
  | 'dv_has_storage'
  | 'dv_decoder'
  | 'networking_monitor_server'
  | 'media_proxy'
  | 'web_access_server'
  | 'video_management_server'
  | 'network_matrix'
  | 'network_controller'
  | 'network_alarm_machine'
  | 'dvr'
  | 'video_server'
  | 'encoder'
  | 'decoder'
  | 'video_switching_matrix'
  | 'audio_switching_matrix'
  | 'alarm_controller'
  | 'nvr'
  | 'hvr'
  | 'camera'
  | 'ipc'
  | 'display'
  | 'alarm_input'
  | 'alarm_output'
  | 'audio_input'
  | 'audio_output'
  | 'mobile_trans'
  | 'other_outer'
  | 'center_server'
  | 'web_server'
  | 'media_dispatcher'
  | 'proxy_server'
  | 'secure_server'
  | 'alarm_server'
  | 'database_server'
  | 'gis_server'
  | 'management_server'
  | 'gateway_server'
  | 'media_storage_server'
  | 'signaling_secure_gateway'
  | 'business_group'
  | 'virtual_group'
  | 'center_user'
  | 'end_user'
  | 'media_iap'
  | 'media_ops'
  | 'district'
  | 'other';

export interface ChannelItem {
  id: string;
  deviceId: string;
  deviceName: string;
  channelId: string;
  name: string;
  manufacturer: string;
  model: string;
  address: string;
  provider: string;
  status: ChannelStatusType;
  others: object;
  description: string;
  parentChannelId: string;
  subCount: integer;
  civilCode: string;
  ptzType: PtzType;
  catalogType: CatalogType;
  channelType: ChannelType;
  catalogCode: string;
  longitude: number;
  latitude: number;
  createTime: number;
  modifyTime: number;
  parentId: string;
  gb28181ProxyStream: boolean;
  gb28181ChannelId: string;
}
