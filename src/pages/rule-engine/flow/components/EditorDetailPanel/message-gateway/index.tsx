import Form, { FormComponentProps } from 'antd/lib/form';
import { Select, Input, Row, Col } from 'antd';
import React from 'react';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const MessageGateway: React.FC<Props> = props => {
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
      label: '网关',
      key: 'gateway',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select>
          <Select.Option value="DEFAULT">系统默认</Select.Option>
        </Select>
      ),
    },
    {
      label: '类型',
      key: 'type',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select>
          <Select.Option value="SUBSCRIBE">订阅消息</Select.Option>
          <Select.Option value="PUBLISH">发送消息</Select.Option>
        </Select>
      ),
    },
    {
      label: '主题Topic',
      key: 'topic',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: <Input.TextArea rows={3} placeholder="支持通配符:/device/**,/device/*/event/*" />,
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

export default Form.create<Props>()(MessageGateway);
