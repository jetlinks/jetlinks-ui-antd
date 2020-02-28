import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Input, Form, Row, Col, Select, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const DeviceOperation: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 5 },
    },
    wrapperCol: {
      sm: { span: 19 },
    },
  };

  const config: any[] = [
    {
      label: '操作',
      key: 'operation',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select>
          <Select.Option value="ONLINE">上线</Select.Option>
          <Select.Option value="OFFLINE">下线</Select.Option>
          <Select.Option value="ENCODE">编码</Select.Option>
          <Select.Option value="DECODE">解码</Select.Option>
          <Select.Option value="SEND_MESSAGE">发送消息</Select.Option>
          <Select.Option value="HANDLE_MESSAGE">桥接发往设备的消息</Select.Option>
          <Select.Option value="REPLY_MESSAGE">回复平台设备消息</Select.Option>
        </Select>
      ),
    },
    {
      label: '传输协议',
      key: 'transport',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select>
          <Select.Option value="MQTT">MQTT</Select.Option>
          <Select.Option value="other">其他</Select.Option>
        </Select>
      ),
    },
    {
      label: '设备ID',
      key: 'deviceId',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      formStyle: {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
      },
      component: <Input.TextArea rows={3} placeholder="$.{#deviceId}" />,
    },
  ];

  const saveModelData = () => {
    const temp = form.getFieldsValue();
    props.save(temp);
    props.close();
  };

  return (
    <Modal
      title="编辑属性"
      visible
      width={640}
      onCancel={() => props.close()}
      onOk={() => saveModelData()}
    >
      <Form {...inlineFormItemLayout} className={styles.configForm}>
        <Row gutter={16}>
          {config.map(item => (
            <Col
              key={item.key}
              {...item.styles}
              // onBlur={() => {
              //   saveModelData();
              // }}
            >
              <Form.Item label={item.label} {...item.formStyle}>
                {getFieldDecorator<string>(item.key, {
                  initialValue: props.config ? props.config[item.key] : '',
                })(item.component)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(DeviceOperation);
