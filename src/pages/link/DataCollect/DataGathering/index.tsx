import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';
import ChannelTree from '../components/Tree';
import { observer } from '@formily/reactive-react';
import { model } from '@formily/reactive';
import Device from '../components/Device';
import Point from '../components/Point';

const DataCollectModel = model<{
  id: Partial<string>;
  type: 'channel' | 'device';
  provider: 'OPC_UA' | 'MODBUS_TCP';
}>({
  type: 'channel',
  id: '',
  provider: 'MODBUS_TCP',
});

export default observer(() => {
  const obj = {
    channel: <Device type={false} id={DataCollectModel.id} />,
    device: <Point type={false} provider={DataCollectModel.provider} id={DataCollectModel.id} />,
  };
  return (
    <PageContainer>
      <Card bordered={false}>
        <div className={styles.container}>
          <div className={styles.left}>
            <ChannelTree
              change={(key, type, provider) => {
                DataCollectModel.id = key;
                DataCollectModel.type = type;
                DataCollectModel.provider = provider;
              }}
            />
          </div>
          <div className={styles.right}>{obj[DataCollectModel.type]}</div>
        </div>
      </Card>
    </PageContainer>
  );
});
