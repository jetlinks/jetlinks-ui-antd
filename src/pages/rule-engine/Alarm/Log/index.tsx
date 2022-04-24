import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/reactive-react';
import { useEffect } from 'react';
import { AlarmLogModel } from './model';
import TabComponent from './TabComponent';
import Service from './service';

export const service = new Service('alarm/record');

const Log = observer(() => {
  const list = [
    {
      key: 'product',
      tab: '产品',
    },
    {
      key: 'device',
      tab: '设备',
    },
    {
      key: 'org',
      tab: '部门',
    },
    {
      key: 'other',
      tab: '其他',
    },
  ];

  useEffect(() => {
    service.queryDefaultLevel().then((resp) => {
      if (resp.status === 200) {
        AlarmLogModel.defaultLevel = resp.result?.levels || [];
      }
    });
  }, []);

  return (
    <PageContainer
      onTabChange={(key: string) => {
        AlarmLogModel.tab = key;
      }}
      tabList={list}
      tabActiveKey={AlarmLogModel.tab}
    >
      <TabComponent type={AlarmLogModel.tab} />
    </PageContainer>
  );
});

export default Log;
