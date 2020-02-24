import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select, Input } from 'antd';
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
      label: 'HTTP客户端',
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
      label: 'uri',
      key: 'uri',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: <Input />,
    },
    {
      label: '请求方式',
      key: 'requestType',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="POST">POST</Select.Option>
          <Select.Option value="PUT">PUT</Select.Option>
          <Select.Option value="GET">GET</Select.Option>
          <Select.Option value="DELETE">DELETE</Select.Option>
          <Select.Option value="PATCH">PATCH</Select.Option>
        </Select>
      ),
    },
    {
      label: 'contentType',
      key: 'contentType',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="APPLICATION_FORM_URLENCODED">
            APPLICATION_FORM_URLENCODED
          </Select.Option>
          <Select.Option value="APPLICATION_JSON">APPLICATION_JSON</Select.Option>
        </Select>
      ),
    },
    {
      label: '请求数据类型',
      key: 'requestDataType',
      component: (
        <Select>
          <Select.Option value="JSON">JSON</Select.Option>
          <Select.Option value="STRING">字符串</Select.Option>
          <Select.Option value="BINARY">BINARY</Select.Option>
          <Select.Option value="HEX">16进制字符</Select.Option>
        </Select>
      ),
    },
    {
      label: '响应数据类型',
      key: 'responseDataType',
      component: (
        <Select>
          <Select.Option value="JSON">JSON</Select.Option>
          <Select.Option value="STRING">字符串</Select.Option>
          <Select.Option value="BINARY">BINARY</Select.Option>
          <Select.Option value="HEX">16进制字符</Select.Option>
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
