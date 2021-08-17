import { PageContainer } from '@ant-design/pro-layout';
import { InstanceModel } from '@/pages/device/Instance';
import { history } from 'umi';
import { Button, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import { statusMap } from '@/pages/device/Product';

const InstanceDetail = () => {
  const [tab, setTab] = useState<string>('detail');
  useEffect(() => {
    if (!InstanceModel.current) history.goBack();
  }, []);
  return (
    <PageContainer
      onBack={() => history.goBack()}
      onTabChange={setTab}
      tabList={[
        {
          key: 'detail',
          tab: '实例信息',
        },
        {
          key: 'metadata',
          tab: '物模型',
        },
        {
          key: 'log',
          tab: '日志管理',
        },
        {
          key: 'alarm',
          tab: '告警设置',
        },
        {
          key: 'visualization',
          tab: '可视化',
        },
        {
          key: 'shadow',
          tab: '设备影子',
        },
      ]}
      content={
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="设备ID">{InstanceModel.current?.id}</Descriptions.Item>
          <Descriptions.Item label="产品名称">{InstanceModel.current?.name}</Descriptions.Item>
          <Descriptions.Item label="设备类型">
            {InstanceModel.current?.deviceType?.text}
          </Descriptions.Item>
          <Descriptions.Item label="链接协议">
            {InstanceModel.current?.protocolName}
          </Descriptions.Item>
          <Descriptions.Item label="消息协议">
            {InstanceModel.current?.transportProtocol}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {InstanceModel.current?.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {InstanceModel.current?.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="最后上线时间">
            {InstanceModel.current?.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="说明">{InstanceModel.current?.createTime}</Descriptions.Item>
        </Descriptions>
      }
      extra={[
        statusMap[0],
        <Button key="2">停用</Button>,
        <Button key="1" type="primary">
          应用配置
        </Button>,
      ]}
    >
      设备实例{tab}
      {JSON.stringify(InstanceModel.current)}
    </PageContainer>
  );
};
export default InstanceDetail;
