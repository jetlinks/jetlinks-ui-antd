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
      label: '通知类型',
      key: 'type',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="email">邮件</Select.Option>
          <Select.Option value="sms">短信</Select.Option>
          <Select.Option value="dingding">钉钉</Select.Option>
          <Select.Option value="weixin">微信</Select.Option>
          <Select.Option value="voice">语音</Select.Option>
        </Select>
      ),
    },
    {
      label: '通知器',
      key: 'notifierId',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="...">开发中</Select.Option>
        </Select>
      ),
    },
    {
      label: '通知模版',
      key: 'templateId',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="...">开发中</Select.Option>
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
