import React, { useState, useEffect } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select, Input, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  httpList: any[];
}
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

  const initState: State = {
    httpList: [],
  };

  const [httpList, setHttpList] = useState(initState.httpList);
  useEffect(() => {
    apis.ruleEngine
      .networkList(
        encodeQueryParam({
          terms: {
            type: 'HTTP_CLIENT',
          },
        }),
      )
      .then(response => {
        if (response) {
          setHttpList(response.result);
        }
      });
  }, []);

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
          {httpList.map(i => (
            <Select.Option value={i.id} key={i.id}>
              {i.name}
            </Select.Option>
          ))}
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
      key: 'httpMethod',
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
      key: 'requestPayloadType',
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
      key: 'responsePayloadType',
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

export default Form.create<Props>()(MqttClient);
