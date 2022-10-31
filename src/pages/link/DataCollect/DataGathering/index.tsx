import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';
import ChannelTree from '../components/Tree';
import { observer } from '@formily/reactive-react';
import { model } from '@formily/reactive';
import Device from '../components/Device';
import Point from '../components/Point';
import { Empty } from '@/components';

const DataCollectModel = model<{
  id: Partial<string>;
  type: 'channel' | 'device';
  provider: 'OPC_UA' | 'MODBUS_TCP';
  data: any;
}>({
  type: 'channel',
  id: '',
  provider: 'MODBUS_TCP',
  data: {},
});

export default observer(() => {
  const obj = {
    channel: <Device type={false} id={DataCollectModel.id} provider={DataCollectModel.provider} />,
    device: (
      <Point type={false} provider={DataCollectModel.provider} data={DataCollectModel.data} />
    ),
  };
  return (
    <PageContainer>
      <Card bordered={false}>
        <div className={styles.container}>
          <div className={styles.left}>
            <ChannelTree
              change={(key, type, provider, data) => {
                DataCollectModel.id = key;
                DataCollectModel.type = type;
                DataCollectModel.provider = provider;
                DataCollectModel.data = data || {};
              }}
            />
          </div>
          {DataCollectModel?.id ? (
            <div className={styles.right}>{obj[DataCollectModel.type]}</div>
          ) : (
            <Empty style={{ marginTop: 100 }} />
          )}
        </div>
      </Card>
    </PageContainer>
  );
});
