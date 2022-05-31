import { BaseItem } from '@/utils/typings';

type LevelItem = {
  level: number;
  title: string;
};

type IOConfigItem = {
  id?: string;
  address: string;
  topic: string;
  username: string;
  password: string;
};
type IOItem = {
  alarmConfigId: string;
  sourceType: string;
  config: Partial<{
    type: string;
    dataSourceId: string;
    config: Partial<IOConfigItem>;
  }>;
  exchangeType: 'consume' | 'producer'; //订阅｜推送
  state: 'disable' | 'enabled'; //禁用|正常
  description: string;
} & BaseItem;
