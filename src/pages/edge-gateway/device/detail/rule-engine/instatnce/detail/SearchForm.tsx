import React, { useState } from "react";
import {DatePicker, Row, Button, Col} from "antd";
import Form, { FormComponentProps } from "antd/lib/form";
import moment, { Moment } from "moment";

// import styles from './index.less';

// import Icon from "@ant-design/icons";

interface Item {
  label: string,
  key: string,
  props?: any
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
  const [expand] = useState(true);

  const search = () => {
    const data = form.getFieldsValue();
    // 找到时间字段
    Object.keys(data).forEach(i => {
      if (i.indexOf('$btw') !== -1 || i.indexOf('$BTW') !== -1) {
        if (data[i]) {
          const formatDate = data[i].map((e: Moment) =>
            moment(e).format('YYYY-MM-DD HH:mm:ss'));
          data[i] = formatDate.join(',');
        }
      }
    })

    props.search(data);
  };

  return (
    <Form
      // onKeyDown={e => {
      //     if (e.keyCode === 13) {
      //         search()
      //     }
      // // }}className={styles.antAdvancedSearchForm}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {(expand ? formItems.slice(0, 2) : formItems).map(item => (
          <Col
            style={{ height: 56 }}
            md={8}
            sm={24}
            key={item.key}
          >
            <Form.Item
              label={item.label}
            >
              {getFieldDecorator(item.key)(
                <DatePicker.RangePicker
                  style={{ width: '200%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </Form.Item>
          </Col>
        ))}
        <div
          style={{
            float: 'right',
            marginBottom: 24,
            marginRight: 30,
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
        </div>
      </Row>
    </Form>
  )
};

export default Form.create<Props>()(SearchForm);
