import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Select, Row, Col, Button, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

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
      label: '时间',
      key: 'name$LIKE',
      component: (
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
        />
      ),
    },
    {
      label: 'LEVEL',
      key: 'level',
      component: (
        <Select placeholder="请选择">
          <Select.Option value="notActive">未激活</Select.Option>
          <Select.Option value="offline">离线</Select.Option>
          <Select.Option value="online">在线</Select.Option>
        </Select>
      ),
    },
  ];

  const colSize =
    simpleItems
      .map(item => (item.styles ? item.styles.md : 8))
      .reduce((i, j) => {
        if (i && j) {
          return Number(i) + Number(j);
        }
        return null;
      }) || 1;

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    props.search(data);
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
          <Col md={8} sm={24} key={item.key}>
            <Form.Item label={item.label}>
              {getFieldDecorator<string>(item.key)(item.component)}
            </Form.Item>
          </Col>
        ))}

        <Col push={16 - (Number(colSize) % 24)} md={8} sm={24}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button
              type="primary"
              onClick={() => {
                search();
              }}
            >
              查询
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
                props.search();
              }}
            >
              重置
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
