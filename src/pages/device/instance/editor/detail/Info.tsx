import React from 'react';
import { Card, Descriptions } from 'antd';
import { DeviceInstance } from '../../data';

interface Props {
  data: Partial<DeviceInstance>;
}
interface State {}
const Info: React.FC<Props> = props => (
  <div>
    <Card style={{ marginBottom: 20 }} title="基本信息">
      <Descriptions style={{ marginBottom: 20 }} bordered column={2}>
        <Descriptions.Item label="设备名称" span={1}>
          {props.data.name}
        </Descriptions.Item>
        <Descriptions.Item label="设备型号" span={1}>
          {props.data.productName}
        </Descriptions.Item>
        <Descriptions.Item label="设备类型" span={1}>
          {props.data.deviceType}
        </Descriptions.Item>
        <Descriptions.Item label="所属机构" span={1}>
          {props.data.orgId}
        </Descriptions.Item>
        <Descriptions.Item label="链接协议" span={1}>
          {props.data.transportProtocol}
        </Descriptions.Item>
        <Descriptions.Item label="消息协议" span={1}>
          {props.data.messageProtocol}
        </Descriptions.Item>
        <Descriptions.Item label="说明" span={2}>
          {props.data.describe}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

export default Info;
