import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Input, Row } from 'antd';

interface Props extends FormComponentProps {
  search: Function;
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const simpleItems: any[] = [
    {
      label: '设备ID',
      key: 'id$LIKE',
      component: <Input placeholder="请输入" />,
    },
    {
      label: '设备名称',
      key: 'name$LIKE',
      component: <Input placeholder="请输入" />,
    }
  ];

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    props.search(data);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {simpleItems.map(item => (
          <Col md={8} sm={24} key={item.key}>
            <Form.Item label={item.label}>
              {getFieldDecorator<string>(item.key)(item.component)}
            </Form.Item>
          </Col>
        ))}

        <Col push={16 - (Number(16) % 24)} md={8} sm={24}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" onClick={() => {search();}}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => {form.resetFields();props.search();}}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
