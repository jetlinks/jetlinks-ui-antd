import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Button } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const Route: React.FC<Props> = props => {
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
      label: '调度规则',
      key: 'rule',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: <Button>编辑</Button>,
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

export default Form.create<Props>()(Route);
