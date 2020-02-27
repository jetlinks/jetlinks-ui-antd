import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Row, Col, Button, DatePicker, Input } from 'antd';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

interface Props extends FormComponentProps {
  search: Function;
}

const Search: React.FC<Props> = props => {
  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const search = () => {
    const data = form.getFieldsValue();
    if (data.createTime$btw) {
      const formatDate = data.createTime$btw.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      data.createTime$btw = formatDate.join(',');
    }
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
        <Col span={12}>
          <Form.Item label="时间">
            {getFieldDecorator('createTime$btw')(
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="事件">{getFieldDecorator('event')(<Input />)}</Form.Item>
        </Col>

        <Col span={6}>
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
