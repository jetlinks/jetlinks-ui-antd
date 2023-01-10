import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';
import CollectorTree from './components/Tree';
import { observer } from '@formily/reactive-react';
import { model } from '@formily/reactive';
import Point from './components/Point';
import { useEffect } from 'react';
import useLocations from '@/hooks/route/useLocation';

export const DataCollectModel = model<{
  provider: 'OPC_UA' | 'MODBUS_TCP';
  data: any;
  reload: boolean;
  refresh: boolean;
  channelId: string;
}>({
  provider: 'MODBUS_TCP',
  data: {},
  reload: false,
  refresh: false,
  channelId: '',
});

export default observer(() => {
  const location = useLocations();

  useEffect(() => {
    if (location.state?.channelId) {
      DataCollectModel.channelId = location.state.channelId;
    } else {
      DataCollectModel.channelId = '';
    }
  }, [location.state]);
  return (
    <PageContainer>
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
        <div className={styles.container}>
          <div className={styles.left}>
            <CollectorTree
              channelId={DataCollectModel.channelId}
              change={(data) => {
                DataCollectModel.provider = data?.provider;
                DataCollectModel.data = data || {};
              }}
            />
          </div>
          <div className={styles.right}>
            <Point provider={DataCollectModel.provider} data={DataCollectModel.data} />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
});
