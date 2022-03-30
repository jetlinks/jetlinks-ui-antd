import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import type { InstanceItem } from './typings';

class Service extends BaseService<InstanceItem> {
  saveRule = (data: InstanceItem) =>
    request(`/${SystemConst.API_BASE}/rule-editor/flows/_create`, {
      method: 'POST',
      data,
    });

  startRule = (id: string) =>
    request(`/${SystemConst.API_BASE}/rule-engine/instance/${id}/_start`, {
      method: 'POST',
    });

  stopRule = (id: string) =>
    request(`/${SystemConst.API_BASE}/rule-engine/instance/${id}/_stop`, {
      method: 'POST',
    });
}

export default Service;
