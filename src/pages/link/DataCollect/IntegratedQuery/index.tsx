import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/reactive-react';
import { model } from '@formily/reactive';
import Point from '../components/Point';
import Device from '../components/Device';
import Channel from '../components/Channel';

const dataModel = model<{
  tab: string;
}>({
  tab: 'channel',
});

export default observer(() => {
  const list = [
    {
      key: 'channel',
      tab: '通道',
      component: <Channel type={true} />,
    },
    {
      key: 'device',
      tab: '采集器',
      component: <Device type={true} />,
    },
    {
      key: 'point',
      tab: '点位',
      component: <Point type={true} />,
    },
  ];
  return (
    <PageContainer
      tabList={list}
      tabActiveKey={dataModel.tab}
      onTabChange={(key: string) => {
        dataModel.tab = key;
      }}
    >
      {list.find((item) => item.key === dataModel.tab)?.component}
    </PageContainer>
  );
});
