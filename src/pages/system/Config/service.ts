import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';

export default class Service extends BaseService<any> {
  getAMapKey = () => request(`${this.uri}/config/amap`, { method: 'GET' });
}
