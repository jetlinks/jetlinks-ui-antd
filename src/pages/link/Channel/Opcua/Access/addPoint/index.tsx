import { Col, Form, Input, Modal, Row, Select, InputNumber, Radio } from 'antd';
import { useEffect } from 'react';
import { service } from '@/pages/link/Channel/Opcua';

interface Props {
  data: any;
  deviceId: string;
  close: Function;
}

const AddPoint = (props: Props) => {
  const [form] = Form.useForm();
  const handleSave = async () => {
    const formData = await form.validateFields();
    console.log(formData);
  };

  useEffect(() => {
    console.log(props.deviceId);
    service.deviceDetail(props.deviceId).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <Modal
      title="编辑"
      visible
      width="40vw"
      destroyOnClose
      onOk={handleSave}
      onCancel={() => {
        props.close();
      }}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="OPC点位ID"
              required
              name="opcPointId"
              rules={[
                { type: 'string', max: 64 },
                { required: true, message: '姓名必填' },
              ]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="属性"
              name="property"
              required
              rules={[{ required: true, message: '属性必选' }]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="数据类型" name="dataType">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item label="数据模式" name="dataMode">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="采样频率" name="interval">
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item label="开启计算" name="enableCalculate">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value={true}>是</Radio.Button>
                <Radio.Button value={false}>否</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item label="初始值" name="initialValue">
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="倍数" name="multiple">
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item label="说明" name="description">
              <Input.TextArea maxLength={200} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddPoint;
