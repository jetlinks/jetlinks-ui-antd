import { Modal, Form, Input, Col, Row } from 'antd';

interface Props {
  data: any;
  save: Function;
  close: Function;
}

const InfoEdit = (props: Props) => {
  const [form] = Form.useForm();
  const { data } = props;
  const handleSave = async () => {
    const formData = await form.validateFields();
    console.log(formData);
    props.save({
      name: formData.name,
      email: formData.email || '',
      telephone: formData.telephone || '',
    });
  };

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
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: data.name,
          username: data.username,
          role: data?.roleList[0]?.name,
          org: data?.orgList[0]?.name,
          telephone: data.telephone,
          email: data.email,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="姓名"
              required
              name="name"
              rules={[
                { type: 'string', max: 64 },
                { required: true, message: '姓名必填' },
              ]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="用户名" name="username">
              <Input placeholder="请输入用户名" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item label="角色" name="role">
              <Input placeholder="请输入姓名" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="部门" name="org">
              <Input placeholder="请输入用户名" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="手机号"
              name="telephone"
              rules={[
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '请输入正确手机号',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  type: 'email',
                },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default InfoEdit;
