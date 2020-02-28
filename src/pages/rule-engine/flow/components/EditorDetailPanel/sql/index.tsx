import Form, { FormComponentProps } from 'antd/lib/form';
import { Input, Row, Col, Modal } from 'antd';
import React from 'react';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

const SqlExecutor: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 3 },
    },
    wrapperCol: {
      sm: { span: 21 },
    },
  };

  const config: any[] = [
    // {
    //   label: '数据源',
    //   key: 'datasource',
    //   styles: {
    //     lg: { span: 24 },
    //     md: { span: 24 },
    //     sm: { span: 24 },
    //   },
    //   component: (
    //     <Select>
    //       <Select.Option value="DEFAULT">默认数据源</Select.Option>
    //     </Select>
    //   ),
    // },
    // {
    //   label: '开启事务',
    //   key: 'transcation',
    //   styles: {
    //     lg: { span: 24 },
    //     md: { span: 24 },
    //     sm: { span: 24 },
    //   },
    //   component: (
    //     <Radio.Group>
    //       <Radio.Button value>是</Radio.Button>
    //       <Radio.Button value={false}>否</Radio.Button>
    //     </Radio.Group>
    //   ),
    // },
    // {
    //   label: '流式结果',
    //   key: 'stream',
    //   styles: {
    //     lg: { span: 24 },
    //     md: { span: 24 },
    //     sm: { span: 24 },
    //   },
    //   component: (
    //     <Radio.Group>
    //       <Radio.Button value>是</Radio.Button>
    //       <Radio.Button value={false}>否</Radio.Button>
    //     </Radio.Group>
    //   ),
    // },
    {
      label: 'SQL',
      key: 'sql',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: <Input.TextArea rows={3} />,
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

export default Form.create<Props>()(SqlExecutor);
