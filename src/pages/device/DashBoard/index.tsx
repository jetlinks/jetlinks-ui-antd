import { PageContainer } from '@ant-design/pro-layout';
import { Card, Badge } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import Service from './service';
import encodeQuery from '@/utils/encodeQuery';
import { useRequest } from 'umi';

interface TopCardProps {
  url?: string;
  isEcharts: boolean;
  title: string;
  total: number | string;
  bottomRender: () => React.ReactNode;
}
const service = new Service('device/instance');
const TopCard = (props: TopCardProps) => {
  return (
    <div className={'top-card-item'}>
      <div className={'top-card-top'}>
        {!props.isEcharts && <div className={'top-card-top-left'}></div>}
        <div className={'top-card-top-right'}>
          <div className={'top-card-title'}>{props.title}</div>
          <div className={'top-card-total'}>{props.total}</div>
        </div>
      </div>
      <div className={'top-card-bottom'}>{props.bottomRender()}</div>
    </div>
  );
};

const DashBoard = () => {
  const [deviceOnline, setDeviceOnline] = useState(0);
  const [deviceOffline, setDeviceOffline] = useState(0);

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });

  //设备数量
  const deviceStatus = async () => {
    const onlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'online' } }));
    if (onlineRes.status === 200) {
      setDeviceOnline(onlineRes.result);
    }
    const offlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'offline' } }));
    if (offlineRes.status === 200) {
      setDeviceOffline(offlineRes.result);
    }
  };
  useEffect(() => {
    deviceStatus();
  }, []);

  return (
    <PageContainer>
      <div className={'media-dash-board'}>
        <Card className={'top-card-items'} bodyStyle={{ display: 'flex', gap: 12 }}>
          <TopCard
            title={'产品数量'}
            total={1}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="未发布" />{' '}
                <span style={{ padding: '0 4px' }}>{1}</span>
                <Badge status="error" text="已发布" /> <span style={{ padding: '0 4px' }}>{1}</span>
              </>
            )}
          />
          <TopCard
            title={'设备数量'}
            total={deviceTotal}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="在线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOnline}</span>
                <Badge status="error" text="离线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'当前在线'}
            total={1}
            isEcharts={true}
            bottomRender={() => <>昨日在线： </>}
          />
          <TopCard
            title={'今日设备消息量'}
            total={1}
            isEcharts={true}
            bottomRender={() => <>当月设备消息量： </>}
          />
        </Card>
      </div>
    </PageContainer>
  );
};
export default DashBoard;
