import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';
import { request } from 'umi';
import { IOConfigItem, LevelItem } from '@/pages/rule-engine/Alarm/Config/typing';

class Service extends BaseService<IOConfigItem> {
  saveLevel = (data: LevelItem[]) =>
    request(`/${SystemConst.API_BASE}/alarm/config/default/level`, {
      method: 'PATCH',
      data,
    });

  queryLevel = () =>
    request(`/${SystemConst.API_BASE}/alarm/config/default/level`, {
      method: 'GET',
    });

  // 保存告警数据输出
  saveOutputData = (data: any) =>
    request(`/${SystemConst.API_BASE}/alarm/config/data-exchange`, {
      method: 'PATCH',
      data,
    });
}

export default Service;
