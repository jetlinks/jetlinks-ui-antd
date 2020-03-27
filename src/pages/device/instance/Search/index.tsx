import React, { useEffect } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Input, Row, Select } from 'antd';

interface Props extends FormComponentProps {
  search: Function;
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    form.setFieldsValue({parameter:'id'});
  }, []);

  const simpleItems: any[] = [
    {
      key: 'parameter',
      style:{width:'10%'},
      component: (
        <Select placeholder="请选择">
          <Select.Option value="id" key="id">设备ID</Select.Option>
          <Select.Option value="name$like" key="name$like">设备名称</Select.Option>
        </Select>
      ),
    },
    {
      key: 'value',
      component: <Input placeholder="请输入"/>,
    }
  ];

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    const map = {};
    map[data.parameter] = data.value;
    props.search(map);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {simpleItems.map(item => (
          <Col md={8} sm={24} key={item.key} style={item.style}>
              {getFieldDecorator<string>(item.key)(item.component)}
          </Col>
        ))}
        <Col push={16 - (Number(16) % 24)} md={12} sm={24}>
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
