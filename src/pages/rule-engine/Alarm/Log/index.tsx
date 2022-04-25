import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/reactive-react';
import { AlarmLogModel } from './model';

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
      key: 'department',
      tab: '部门',
    },
    {
      key: 'other',
      tab: '其他',
    },
  ];
  return (
    <PageContainer
      // onTabChange={(key: 'product' | 'device' | 'department' | 'other') => {
      //     AlarmLogModel.tab = key
      // }}
      tabList={list}
      tabActiveKey={AlarmLogModel.tab}
    >
      test
    </PageContainer>
  );
});

export default Log;
