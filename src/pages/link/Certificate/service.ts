import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<CertificateItem> {
  // 上传证书并返回证书BASE64
  public uploadCertificate = (data?: any) =>
    request(`/${SystemConst.API_BASE}/network/certificate/upload`, {
      method: 'POST',
      data,
    });
}

export default Service;
