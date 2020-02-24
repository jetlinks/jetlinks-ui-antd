import { Card, Form, Input, Button } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  data: any;
  save: Function;
}
const RuleModel: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const saveModel = () => {
    const data = form.getFieldsValue();
    props.save(data);
  };
  return (
    <Card type="inner" size="small" title="模型信息" bordered={false}>
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="模型ID">
          {getFieldDecorator('id', {
            initialValue: props.data.id,
          })(<Input disabled={props.data.option === 'update'} />)}
        </Form.Item>
        <Form.Item label="模型名称">
          {getFieldDecorator('name', {
            initialValue: props.data.name,
          })(<Input />)}
        </Form.Item>
        {/* <Form.Item label="运行方式">
                    {getFieldDecorator('runType', {

                    })(<Input />)}
                </Form.Item> */}
        <Form.Item label="描述" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          {getFieldDecorator('describe', {
            initialValue: props.data.describe,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
        <Button
          style={{ width: '100%', marginBottom: '5px' }}
          type="primary"
          onClick={() => {
            saveModel();
          }}
        >
          保存
        </Button>
      </Form>
    </Card>
  );
};
export default Form.create<Props>()(RuleModel);
