import ProCard from '@ant-design/pro-card';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Form, Row, Select, Statistic } from 'antd';
import { Col } from 'antd';

const Assets = () => {
  return (
    <Card>
      <Form.Item label="成员" style={{ width: 200 }}>
        <Select />
      </Form.Item>
      <ProCard gutter={[16, 16]} style={{ marginTop: 16 }}>
        <ProCard
          title="产品"
          colSpan="25%"
          bordered
          actions={[<EyeOutlined key="setting" />, <EditOutlined key="edit" />]}
        >
          <Row>
            <Col span={12}>
              <Statistic title="已发布" value={20} />
            </Col>
            <Col span={12}>
              <Statistic title="未发布" value={19} />
            </Col>
          </Row>
        </ProCard>

        <ProCard
          title="设备"
          colSpan="25%"
          bordered
          actions={[<EyeOutlined key="setting" />, <EditOutlined key="edit" />]}
        >
          <Row>
            <Col span={12}>
              <Statistic title="已发布" value={20} />
            </Col>
            <Col span={12}>
              <Statistic title="未发布" value={19} />
            </Col>
          </Row>
        </ProCard>
      </ProCard>
    </Card>
  );
};
export default Assets;
