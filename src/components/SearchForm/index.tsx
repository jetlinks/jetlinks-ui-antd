import React, { useState } from 'react';
import {
  Input,
  DatePicker,
  InputNumber,
  Form,
  Row,
  Col,
  Button,
  Icon,
  Select,
  TreeSelect,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';

import styles from './index.less';

interface Item {
  label: string;
  key: string;
  type: string;
  props?: any;
  value?: any;
}

interface Props extends FormComponentProps {
  formItems: Item[];
  search: Function;
}

const SearchForm = (props: Props) => {
  const {
    formItems,
    form,
    form: { getFieldDecorator },
  } = props;
  const [expand, setExpand] = useState(true);

  const search = () => {
    const data = form.getFieldsValue();
    // 找到时间字段
    Object.keys(data).forEach(i => {
      if (i.indexOf('$btw') !== -1 || i.indexOf('$BTW') !== -1) {
        if (data[i]) {
          const formatDate = data[i].map((e: Moment) => moment(e).format('YYYY-MM-DD HH:mm:ss'));
          data[i] = formatDate.join(',');
        }
      }
    });
    // if (data.requestTime$btw) {
    //     const formatDate = data.requestTime$btw.map((e: Moment) =>
    //         moment(e).format('YYYY-MM-DD HH:mm:ss'),
    //     );
    //     data.requestTime$btw = formatDate.join(',');
    // }
    props.search(data);
  };

  const renderItem = (type: string, label?: string, itemProps?: any) => {
    if (type === 'string') {
      return <Input placeholder={`请输入${label}`} />;
    }
    if (type === 'list') {
      const list = itemProps?.data || [];
      return (
        <Select mode={itemProps?.mode || 'multiple'}>
          {list.map((item: any) => (
            <Select.Option value={item.id || item} key={item.id || item}>
              {item.name || item}
            </Select.Option>
          ))}
        </Select>
      );
    }
    if (type === 'dateTime') {
      return <DatePicker showTime style={{ width: '100%' }} />;
    }
    if (type === 'dateRange' || type === 'time') {
      return <DatePicker.RangePicker showTime style={{ width: '100%' }} />;
    }
    if (type === 'dateTimeRange') {
      return (
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
        />
      );
    }
    if (type === 'number') {
      return <InputNumber style={{ width: '100%' }} placeholder={`请输入${label}`} />;
    }
    if (type === 'treeSelect') {
      return (
        <TreeSelect
          dropdownStyle={itemProps?.dropdownStyle}
          allowClear
          treeDataSimpleMode
          showSearch={itemProps?.showSearch || false}
          multiple={itemProps?.multiple || false}
          placeholder={`${label}`}
          treeData={itemProps?.data || []}
          treeNodeFilterProp="title"
        />
      );
    }
    return <Input />;
  };
  return (
    <Form
      onKeyDown={e => {
        if (e.keyCode === 13) {
          search();
        }
      }}
      className={styles.antAdvancedSearchForm}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {(expand ? formItems.slice(0, 2) : formItems).map(item => (
          <Col style={{ height: 56 }} md={8} sm={24} key={item.key}>
            <Form.Item label={item.label}>
              {getFieldDecorator(item.key, {
                initialValue: item?.value,
              })(renderItem(item.type, item.label, item.props))}
            </Form.Item>
          </Col>
        ))}
        <div
          style={{
            float: 'right',
            marginBottom: 24,
            marginRight: 30,
            marginTop: 4,
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
          {formItems.length > 2 && (
            <a style={{ marginLeft: 8 }} onClick={() => setExpand(!expand)}>
              {expand ? '展开' : '收起'} <Icon type={expand ? 'down' : 'up'} />
            </a>
          )}
        </div>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(SearchForm);
