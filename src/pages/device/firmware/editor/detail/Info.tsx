import React from 'react';
import { Card, Descriptions } from 'antd';
import { FirmwareData } from '@/pages/device/firmware/data';

interface Props {
  data: Partial<FirmwareData>;
}

const Info: React.FC<Props> = (props) => {

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Descriptions style={{ marginBottom: 20 }} bordered column={3} title={<span>固件信息</span>}>
          <Descriptions.Item label="固件名称" span={1}>
            {props.data.name}
          </Descriptions.Item>
          <Descriptions.Item label="所属产品" span={1}>
            {props.data.productName}
          </Descriptions.Item>
          <Descriptions.Item label="版本" span={1}>
            {props.data.version}
          </Descriptions.Item>
          <Descriptions.Item label="版本序号" span={1}>
            {props.data.versionOrder}
          </Descriptions.Item>
          <Descriptions.Item label="签名方式" span={1}>
            {props.data.signMethod}
          </Descriptions.Item>
          <Descriptions.Item label="签名" span={1}>
            {props.data.sign}
          </Descriptions.Item>
          <Descriptions.Item label="说明" span={3}>
            {props.data.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Info;
