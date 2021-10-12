import { Descriptions } from 'antd';
import TenantModel from '@/pages/system/Tenant/model';

const Info = () => {
  return (
    <div>
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="ID">{TenantModel.detail?.id}</Descriptions.Item>
        <Descriptions.Item label="名称">{TenantModel.detail?.name}</Descriptions.Item>
        <Descriptions.Item label="状态">{TenantModel.detail?.state?.text}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};
export default Info;
