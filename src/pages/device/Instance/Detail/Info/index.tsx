import { Descriptions } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import moment from 'moment';

const Info = () => {
  return (
    <>
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="设备ID">{InstanceModel.detail?.id}</Descriptions.Item>
        <Descriptions.Item label="产品名称">{InstanceModel.detail?.name}</Descriptions.Item>
        <Descriptions.Item label="设备类型">
          {InstanceModel.detail?.deviceType?.text}
        </Descriptions.Item>
        <Descriptions.Item label="链接协议">{InstanceModel.detail?.protocolName}</Descriptions.Item>
        <Descriptions.Item label="消息协议">{InstanceModel.detail?.transport}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(InstanceModel.detail?.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="注册时间">{InstanceModel.detail?.createTime}</Descriptions.Item>
        <Descriptions.Item label="最后上线时间">
          {InstanceModel.detail?.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="说明">{InstanceModel.detail?.description}</Descriptions.Item>
      </Descriptions>
    </>
  );
};
export default Info;
