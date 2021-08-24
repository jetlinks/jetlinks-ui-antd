import { observer } from '@formily/react';
import ProCard from '@ant-design/pro-card';
import { Col, Input, Row } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import ItemList from '@/pages/device/Instance/Detail/Metadata/ItemList';
import ItemDetail from '@/pages/device/Instance/Detail/Metadata/ItemDetail';
import ItemParam from '@/pages/device/Instance/Detail/Metadata/ItemParam';

const Metadata = observer(() => {
  const metadata = JSON.parse(InstanceModel.detail.metadata as string) as DeviceMetadata;
  return (
    <ProCard
      tabs={{
        tabPosition: 'left',
      }}
    >
      <ProCard.TabPane tab="属性" key="property" style={{ overflowX: 'auto' }}>
        <ProCard gutter={[16, 16]} style={{ height: '50vh' }}>
          <ProCard
            bordered={true}
            colSpan={5}
            extra={
              <Row>
                <Col span={18}>
                  <Input.Search size="small" />
                </Col>
                <Col span={2} />
                <Col span={4} style={{ alignItems: 'center' }}>
                  <a>新增</a>
                </Col>
              </Row>
            }
            style={{ height: '40vh', marginRight: 10 }}
          >
            <ItemList metadata={metadata} />
          </ProCard>
          <ProCard
            extra={<a>保存</a>}
            bordered={true}
            colSpan={7}
            style={{ height: '40vh', marginRight: 10 }}
          >
            <ItemDetail />
          </ProCard>
          <ProCard
            extra={<a>保存</a>}
            bordered={true}
            colSpan={7}
            style={{ height: '40vh', marginRight: 10 }}
          >
            <ItemParam />
          </ProCard>
          <ProCard
            extra={<a>保存</a>}
            bordered={true}
            colSpan={7}
            style={{ height: '40vh', marginRight: 10 }}
          >
            <ItemParam />
          </ProCard>
          <ProCard
            extra={<a>保存</a>}
            bordered={true}
            colSpan={7}
            style={{ height: '40vh', marginRight: 10 }}
          >
            <ItemParam />
          </ProCard>
          <ProCard
            extra={<a>保存</a>}
            bordered={true}
            colSpan={7}
            style={{ height: '40vh', marginRight: 10, display: '' }}
          >
            <ItemParam />
          </ProCard>
        </ProCard>
      </ProCard.TabPane>
      <ProCard.TabPane tab="事件" key="events">
        事件
      </ProCard.TabPane>
      <ProCard.TabPane tab="功能" key="functions">
        功能
      </ProCard.TabPane>
      <ProCard.TabPane tab="标签" key="tags">
        标签
      </ProCard.TabPane>
    </ProCard>
  );
});
export default Metadata;
