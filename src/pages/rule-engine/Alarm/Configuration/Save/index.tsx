import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Scene from './Scene';
import Base from './Base';
import Log from './Log';

export default () => {
  return (
    <PageContainer>
      <Card style={{ minHeight: 600 }}>
        <Tabs
          defaultActiveKey="1"
          onChange={() => {}}
          items={[
            {
              label: `基础配置`,
              key: '1',
              children: <Base />,
            },
            {
              label: `关联场景联动`,
              key: '2',
              children: <Scene />,
            },
            {
              label: `告警记录`,
              key: '3',
              children: <Log />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};
