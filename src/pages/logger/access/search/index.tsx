import React, { useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
// import { FormItemConfig } from "@/utils/common";
import { Input, Row, Col, Button, Icon, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

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
      label: '请求路径',
      key: 'url$LIKE',
      component: <Input placeholder="请输入" />,
    },
    {
      label: 'IP',
      key: 'ip',
      component: <Input placeholder="请输入" />,
    },
  ];

  const advancedItems: any[] = [
    {
      label: '请求路径',
      key: 'url$LIKE',
      component: <Input placeholder="请输入" />,
    },
    {
      label: 'IP',
      key: 'ip',
      component: <Input placeholder="请输入" />,
    },

    {
      label: '操作',
      key: 'action',
      component: <Input />,
    },
    {
      label: '请求ID',
      key: 'id',
      component: <Input />,
    },
    // {
    //     label: "用户名",
    //     key: "context.username$LIKE", // TODO 用户名嵌套查询
    //     component:
    //         <Input />
    // },
    {
      label: '日志时间',
      key: 'requestTime$btw',
      component: (
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
        />
      ),
    },
  ];

  const colSize =
    (expandForm ? simpleItems : advancedItems)
      .map(item => (item.styles ? item.styles.md : 8))
      .reduce((i, j) => {
        if (i && j) {
          return Number(i) + Number(j);
        }
        return null;
      }) || 1;

  const search = () => {
    const data = form.getFieldsValue();
    if (data.requestTime$btw) {
      const formatDate = data.requestTime$btw.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      data.requestTime$btw = formatDate.join(',');
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
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {expandForm
          ? simpleItems.map(item => (
            <Col md={8} sm={24} key={item.key}>
              <Form.Item label={item.label}>
                {getFieldDecorator<string>(item.key)(item.component)}
              </Form.Item>
            </Col>
          ))
          : advancedItems.map(item => (
            <Col
              // md={item.styles ? item.styles.md : 8}
              // sm={item.styles ? item.styles.sm : 24}
              // key={item.key}
              // style={{ height: 56 }}
              md={8} sm={24}
            >
              <Form.Item label={item.label}>
                {getFieldDecorator<string>(item.key, item.options)(item.component)}
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
            <a style={{ marginLeft: 8 }} onClick={() => setExpandForm(!expandForm)}>
              {expandForm ? '展开' : '收起'} <Icon type={expandForm ? 'down' : 'up'} />
            </a>
          </div>
        </Col>
      </Row>
    </Form >
  );
};

export default Form.create<Props>()(Search);
