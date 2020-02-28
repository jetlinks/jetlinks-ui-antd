import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Input, Form, Row, Col, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const SmsSender: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 10 },
    },
    wrapperCol: {
      sm: { span: 14 },
    },
  };

  const config: any[] = [
    {
      label: '发信人',
      key: 'senderId',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      formStyle: {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
      },
      component: <Input />,
    },
    {
      label: '收信人',
      key: 'sendTo',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      formStyle: {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
      },
      component: <Input />,
    },
    {
      label: '短信模版',
      key: 'templateId',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      formStyle: {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
      },
      component: <Input placeholder="短信模版和短信内容不能同时为空" />,
    },
    {
      label: '短信内容',
      key: 'text',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      formStyle: {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
      },
      component: (
        <Input.TextArea
          rows={3}
          placeholder="变量描述：$.{#attr[error_stack]},$.{#attr[error_message]},$.{#attr[error_type]} "
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

export default Form.create<Props>()(SmsSender);
