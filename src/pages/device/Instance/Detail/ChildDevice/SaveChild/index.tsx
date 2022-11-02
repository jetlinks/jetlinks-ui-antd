import TitleComponent from '@/components/TitleComponent';
import { Button, Col, Form, Input, Row } from 'antd';
import MapTable from '../../EdgeMap/mapTable';

interface Props {
  close: () => void;
}

const SaveChild = (props: Props) => {
  const [form] = Form.useForm();
  return (
    <>
      <TitleComponent
        data={
          <>
            基本信息
            <Button
              onClick={() => {
                props.close();
              }}
              style={{ marginLeft: 10 }}
            >
              返回
            </Button>
          </>
        }
      />
      <Form layout="vertical" form={form}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="设备名称"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="产品名称"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <MapTable metaData={[]} deviceId={''} title={'点位映射'} ref={form} />
        </Row>
      </Form>
    </>
  );
};

export default SaveChild;
