import React, { useState, useEffect } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  tcpList: any[];
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
    tcpList: [],
  };

  const [tcpList, setTcpList] = useState(initState.tcpList);
  useEffect(() => {
    apis.ruleEngine
      .networkList(
        encodeQueryParam({
          terms: {
            type: 'TCP_CLIENT',
          },
        }),
      )
      .then(response => {
        if (response) {
          setTcpList(response.result);
        }
      });
  }, []);

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
          {tcpList.map(i => (
            <Select.Option value={i.id} key={i.id}>
              {i.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '推送消息类型',
      key: 'sendPayloadType',
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
      key: 'subPayloadType',
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
      key: 'type',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="producer">发送消息</Select.Option>
          <Select.Option value="consumer">订阅消息</Select.Option>
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
