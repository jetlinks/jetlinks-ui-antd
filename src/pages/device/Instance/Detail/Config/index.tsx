import { Card, Divider } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect } from 'react';
import { observer } from '@formily/react';

const Config = observer(() => {
  useEffect(() => {
    if (InstanceModel.current?.id) {
      service.getConfigMetadata(InstanceModel.current.id).then((response) => {
        InstanceModel.config = response?.result;
      });
    }
  }, []);
  return (
    <>
      <Card title="配置">{JSON.stringify(InstanceModel.config)}</Card>
      <Divider />
      <Card title="标签">{JSON.stringify(InstanceModel.detail.tags)}</Card>
    </>
  );
});

export default Config;
