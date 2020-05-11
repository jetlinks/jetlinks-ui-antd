import React, { useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Input, Select, Row, Col, Button, Icon, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

import styles from '../../index.less';

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  expandForm: boolean;
}

const Search: React.FC<Props> = props => {
  const initState: State = {
    expandForm: true,
  };

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const [expandForm, setExpandForm] = useState(initState.expandForm);

  const simpleItems: any[] = [
    {
      label: '名称',
      key: 'name$LIKE',
      component: <Input placeholder="请输入" />,
    },
    {
      label: '日志级别',
      key: 'level',
      component: (
        <Select>
          <Select.Option value="ERROR">ERROR</Select.Option>
          <Select.Option value="INFO">INFO</Select.Option>
          <Select.Option value="WARN">WARN</Select.Option>
          <Select.Option value="DEBUG">DEBUG</Select.Option>
        </Select>
      ),
    },
  ];

  const advancedItems: any[] = [
    {
      label: '名称',
      key: 'name$LIKE',
      component: <Input placeholder="请输入" />,
    },
    {
      label: '日志级别',
      key: 'level',
      component: (
        <Select>
          <Select.Option value="ERROR">ERROR</Select.Option>
          <Select.Option value="INFO">INFO</Select.Option>
          <Select.Option value="WARN">WARN</Select.Option>
          <Select.Option value="DEBUG">DEBUG</Select.Option>
        </Select>
      ),
    },
    {
      label: '日志时间',
      key: 'createTime$btw',
      component: (
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={['开始时间', '结束时间']}
        />
      ),
    },
    {
      label: '日志内容',
      key: 'message$LIKE',
      component: <Input />,
    },
  ];

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    if (data.createTime$btw) {
      const formatDate = data.createTime$btw.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      data.createTime$btw = formatDate.join(',');
    }
    props.search(data);
  };



  return (
    <Form className={styles.antAdvancedSearchForm} >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {expandForm
          ? simpleItems.map(item => (
            <Col style={{ height: 56 }} md={8} sm={24} key={item.key}>
              <Form.Item label={item.label}>
                {getFieldDecorator<string>(item.key)(item.component)}
              </Form.Item>
            </Col>
          ))
          : advancedItems.map(item => (
            <Col
              md={8} sm={24}
              key={item.key}
              style={{ height: 56 }}
            >
              <Form.Item label={item.label}>
                {getFieldDecorator<string>(item.key, item.options)(item.component)}
              </Form.Item>
            </Col>
          ))}

        <div
          style={{
            float: 'right',
            // marginBottom: 24,
            // marginRight: 0,
            marginTop: 4
          }}

        >
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
          <a style={{ marginLeft: 8 }} onClick={() => setExpandForm(!expandForm)}>
            {expandForm ? '展开' : '收起'} <Icon type={expandForm ? 'down' : 'up'} />
          </a>
        </div>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
