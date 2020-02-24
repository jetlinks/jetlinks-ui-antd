import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const MqttClient: React.FC<Props> = props => {
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
      label: 'TCP客户端',
      key: 'clientId',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="ONLINE">开发中</Select.Option>
        </Select>
      ),
    },
    {
      label: '推送消息类型',
      key: 'publish',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="JSON">JSON</Select.Option>
          <Select.Option value="STRING">字符串</Select.Option>
          <Select.Option value="BINARY">二进制</Select.Option>
          <Select.Option value="HEX">16进制字符</Select.Option>
        </Select>
      ),
    },
    {
      label: '订阅消息类型',
      key: 'subscribe',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="JSON">JSON</Select.Option>
          <Select.Option value="STRING">字符串</Select.Option>
          <Select.Option value="BINARY">二进制</Select.Option>
          <Select.Option value="HEX">16进制字符</Select.Option>
        </Select>
      ),
    },
    {
      label: '操作',
      key: 'action',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="send">发送消息</Select.Option>
          <Select.Option value="subscribe">订阅消息</Select.Option>
        </Select>
      ),
    },
  ];

  const saveModelData = () => {
    const temp = form.getFieldsValue();
    props.save(temp);
  };

  return (
    <Form {...inlineFormItemLayout} className={styles.configForm}>
      <Row gutter={16}>
        {config.map(item => (
          <Col
            key={item.key}
            {...item.styles}
            onBlur={() => {
              saveModelData();
            }}
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
  );
};

export default Form.create<Props>()(MqttClient);
