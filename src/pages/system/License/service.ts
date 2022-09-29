import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
    licenseInit = (data?: any) =>
        request(`/${SystemConst.API_BASE}/license/init`, {
            method: 'POST',
            data,
        });
    getModule = () =>
        request(`/${SystemConst.API_BASE}/license/module`, {
            method: 'GET',
        });
    getLicense = () =>
        request(`/${SystemConst.API_BASE}/license`, {
            method: 'GET',
        });
    initPage = () => request(`/${SystemConst.API_BASE}/user/settings/init`, { method: 'GET' })
}

export default Service;
