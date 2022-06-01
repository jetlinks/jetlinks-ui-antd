import { Card, Col, Row } from 'antd';

const Statistics = () => {
  return (
    <Card
      title={'设备统计'}
      extra={
        <a
          onClick={() => {
            // pageJump(!!getMenuPathByCode('device/DashBoard'), 'device/DashBoard');
          }}
        >
          详情
        </a>
      }
    >
      <Row gutter={24}>
        <Col span={12}>
          <Card bordered>产品数量</Card>
        </Col>
        <Col span={12}>
          <Card bordered>设备数量</Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Statistics;
