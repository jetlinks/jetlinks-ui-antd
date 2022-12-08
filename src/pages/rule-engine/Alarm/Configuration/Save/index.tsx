import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Scene from './Scene';
import Base from './Base';
import Log from './Log';
import useLocation from '@/hooks/route/useLocation';
import { useState } from 'react';
import { onlyMessage } from '@/utils/util';

export default () => {
  const location = useLocation();
  const id = location?.query?.id || '';
  const [tab, setTab] = useState<string>('1');
  return (
    <PageContainer>
      <Card style={{ minHeight: 600 }}>
        <Tabs
          activeKey={tab}
          onChange={(key: string) => {
            if (!id) {
              onlyMessage('请先保存基础配置', 'error');
            } else {
              setTab(key);
            }
          }}
          items={[
            {
              label: `基础配置`,
              key: '1',
              children: <Base />,
            },
            {
              label: `关联场景联动`,
              key: '2',
              // disabled: !id,
              children: <Scene />,
            },
            {
              label: `告警记录`,
              key: '3',
              // disabled: !id,
              children: <Log />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};
