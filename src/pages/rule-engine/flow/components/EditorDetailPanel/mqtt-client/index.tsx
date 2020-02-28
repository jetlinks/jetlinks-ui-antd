import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Input, Form, Row, Col, Select, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  mqttList: any[];
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
    mqttList: [],
  };

  const [mqttList, setMqttList] = useState(initState.mqttList);
  useEffect(() => {
    apis.ruleEngine
      .networkList(
        encodeQueryParam({
          terms: {
            type: 'MQTT_CLIENT',
          },
        }),
      )
      .then(response => {
        if (response) {
          setMqttList(response.result);
        }
      });
  }, []);

  const config: any[] = [
    {
      label: 'MQTT连接',
      key: 'clientId',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          {mqttList.map(i => (
            <Select.Option value={i.id} key={i.id}>
              {i.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '操作',
      key: 'clientType',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          <Select.Option value="consumer">接收消息</Select.Option>
          <Select.Option value="producer">发送消息</Select.Option>
        </Select>
      ),
    },
    {
      label: '消息体类型',
      key: 'payloadType',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
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
      label: '主题（Topic）',
      key: 'topics',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      // formStyle: {
      //     wrapperCol: { span: 24 },
      //     labelCol: { span: 24 },
      // },
      component: <Input.TextArea rows={2} />,
    },
    {
      label: '主题变量',
      key: 'topicVariables',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      // formStyle: {
      //     wrapperCol: { span: 24 },
      //     labelCol: { span: 24 },
      // },
      component: (
        <Input.TextArea
          rows={3}
          placeholder="接收消息时有效: 例:/topic/{deviceId}/{key},下游通过vars变量获取占位符对应的变量."
        />
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
