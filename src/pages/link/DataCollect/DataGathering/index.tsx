import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';
import ChannelTree from '../components/Tree';
import { observer } from '@formily/reactive-react';
import { model } from '@formily/reactive';
import Device from '../components/Device';
import Point from '../components/Point';
import { Empty } from '@/components';

export const DataCollectModel = model<{
  id: Partial<string>;
  type: 'channel' | 'device' | undefined;
  provider: 'OPC_UA' | 'MODBUS_TCP';
  data: any;
  reload: boolean;
  refresh: boolean;
}>({
  type: 'channel',
  id: '',
  provider: 'MODBUS_TCP',
  data: {},
  reload: false,
  refresh: false,
});

export default observer(() => {
  const onReload = () => {
    DataCollectModel.reload = !DataCollectModel.reload;
  };

  const obj = {
    channel: (
      <Device
        reload={onReload}
        type={false}
        id={DataCollectModel.id}
        provider={DataCollectModel.provider}
        refresh={DataCollectModel.refresh}
      />
    ),
    device: (
      <Point type={false} provider={DataCollectModel.provider} data={DataCollectModel.data} />
    ),
  };

  return (
    <PageContainer>
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
        <div className={styles.container}>
          <div className={styles.left}>
            <ChannelTree
              change={(key, type, provider, data) => {
                DataCollectModel.type = undefined;
                DataCollectModel.id = key;
                DataCollectModel.provider = provider;
                DataCollectModel.data = data || {};
                setTimeout(() => {
                  DataCollectModel.type = type;
                }, 0);
              }}
              reload={DataCollectModel.reload}
              onReload={() => {
                DataCollectModel.refresh = !DataCollectModel.refresh;
              }}
            />
          </div>
          {DataCollectModel?.id ? (
            <div className={styles.right}>
              {DataCollectModel.type ? obj[DataCollectModel.type] : ''}
            </div>
          ) : (
            <Empty style={{ marginTop: 100 }} />
          )}
        </div>
      </Card>
    </PageContainer>
  );
});
