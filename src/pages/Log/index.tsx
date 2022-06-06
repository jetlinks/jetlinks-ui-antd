import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import Access from '@/pages/Log/Access';
import System from '@/pages/Log/System';
import useLocation from '@/hooks/route/useLocation';

const Log = () => {
  const [tab, setTab] = useState<string>('access');

  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state?.key) {
      setTab(state?.key);
    }
  }, [location]);

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
