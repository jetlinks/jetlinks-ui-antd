import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import Access from '@/pages/Log/Access';
import System from '@/pages/Log/System';

const Log = () => {
  const [tab, setTab] = useState<string>('access');
  const list = [
    {
      key: 'access',
      tab: '访问日志',
      component: <Access />,
    },
    {
      key: 'system',
      tab: '系统日志',
      component: <System />,
    },
  ];

  return (
    <PageContainer onTabChange={setTab} tabList={list} tabActiveKey={tab}>
      {list.find((k) => k.key === tab)?.component}
    </PageContainer>
  );
};

export default Log;
