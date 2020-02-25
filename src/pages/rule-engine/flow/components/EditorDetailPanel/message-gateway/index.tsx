import Form, { FormComponentProps } from 'antd/lib/form';
import { Select, Input, Row, Col, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { NodeProps } from '../data';
import styles from '../index.less';
import apis from '@/services';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  gatewayList: any[];
}
const MessageGateway: React.FC<Props> = props => {
  const initState: State = {
    gatewayList: [],
  };
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

  const [gatewayList, setGatewayList] = useState(initState.gatewayList);

  useEffect(() => {
    apis.ruleEngine.gatewayMessage().then(response => {
      if (response) {
        setGatewayList(response.result);
      }
    });
  }, []);
  const config: any[] = [
    {
      label: '网关',
      key: 'gatewayId',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select>
          {gatewayList.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
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
          <Select.Option value="consumer">订阅消息</Select.Option>
          <Select.Option value="producer">发送消息</Select.Option>
        </Select>
      ),
    },
    {
      label: '主题Topic',
      key: 'topics',
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
            <Col key={item.key} {...item.styles}>
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

export default Form.create<Props>()(MessageGateway);
