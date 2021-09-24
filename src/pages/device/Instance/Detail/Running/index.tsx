import { InstanceModel } from '@/pages/device/Instance';
import ProCard from '@ant-design/pro-card';
import { SyncOutlined } from '@ant-design/icons';
import { Badge, Col, message, Row } from 'antd';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';

const Running = () => {
  const intl = useIntl();
  const metadata = JSON.parse(InstanceModel.detail.metadata as string) as DeviceMetadata;
  return (
    <ProCard style={{ marginTop: 8 }} gutter={[16, 16]} wrap>
      <ProCard
        title={intl.formatMessage({
          id: 'pages.device.instanceDetail.running.status',
          defaultMessage: '设备状态',
        })}
        extra={<SyncOutlined onClick={() => message.success('刷新')} />}
        layout="default"
        bordered
        headerBordered
        colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
      >
        <div style={{ height: 60 }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Badge status="success" text={<span style={{ fontSize: 25 }}>在线</span>} />
            </Col>
            <Col span={24}>
              {intl.formatMessage({
                id: 'pages.device.instanceDetail.running.onlineTime',
                defaultMessage: '在线时间',
              })}
              : 2021-8-20 12:20:33
            </Col>
          </Row>
        </div>
      </ProCard>
      {metadata.properties.map((item) => (
        <ProCard
          title={item.name}
          extra={<SyncOutlined onClick={() => message.success('刷新')} />}
          layout="center"
          bordered
          headerBordered
          colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
        >
          <div style={{ height: 60 }}>{`${item.name}-属性`}</div>
        </ProCard>
      ))}
      {metadata.events.map((item) => (
        <ProCard
          title={item.name}
          extra={<SyncOutlined onClick={() => message.success('刷新')} />}
          layout="center"
          bordered
          headerBordered
          colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
        >
          <div style={{ height: 60 }}>{`${item.name}-事件`}</div>
        </ProCard>
      ))}
    </ProCard>
  );
};
export default Running;
