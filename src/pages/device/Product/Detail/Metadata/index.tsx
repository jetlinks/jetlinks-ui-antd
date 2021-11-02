import { observer } from '@formily/react';
import { Button, Space, Tabs } from 'antd';
import BaseMetadata from '@/pages/device/Product/Detail/Metadata/Base';

const Metadata = observer(() => {
  return (
    <Tabs
      tabBarExtraContent={
        <Space>
          <Button>快速导入</Button>
          <Button>物模型TSL</Button>
        </Space>
      }
      destroyInactiveTabPane
    >
      <Tabs.TabPane tab="属性定义" key="properties">
        <BaseMetadata type={'properties'} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="功能定义" key="functions">
        <BaseMetadata type={'functions'} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="事件定义" key="events">
        <BaseMetadata type={'events'} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="标签定义" key="tags">
        <BaseMetadata type={'tags'} />
      </Tabs.TabPane>
    </Tabs>
  );
});
export default Metadata;
