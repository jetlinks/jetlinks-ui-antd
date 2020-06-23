import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, Button, Icon, Form } from 'antd';
import apis from '@/services';
import { FormComponentProps } from 'antd/lib/form';
import { DeviceProduct } from '../../product/data.d';
import { getPageQuery } from '@/utils/utils';

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  expandForm: boolean;
  productList: DeviceProduct[];
}

const Search: React.FC<Props> = props => {
  const initState: State = {
    expandForm: false,
    productList: [],
  };

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const [expandForm, setExpandForm] = useState(initState.expandForm);
  const [productList, setProductList] = useState(initState.productList);

  useEffect(() => {
    // 获取下拉框数据
    apis.deviceProdcut
      .queryNoPagin()
      .then(e => {
        setProductList(e.result);
      })
      .catch(() => {
        //
      });
  }, []);

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    props.search(data);
  };

  useEffect(() => {
    const query = getPageQuery();
    if (!query.hasOwnProperty("productId")){
      setExpandForm(true);
    }
    form.setFieldsValue(query, () => search());
  }, []);

  const simpleItems: any[] = [
    {
      label: '设备名称',
      key: 'name$like',
      component: <Input placeholder="请输入" />,
    },
    {
      label: '状态',
      key: 'state',
      component: (
        <Select placeholder="请选择" allowClear>
          <Select.Option value="notActive">未激活</Select.Option>
          <Select.Option value="offline">离线</Select.Option>
          <Select.Option value="online">在线</Select.Option>
        </Select>
      ),
    },
  ];

  const advancedItems: any[] = [
    {
      label: '设备名称',
      key: 'name$like',
      component: <Input placeholder="请输入" />,
    },
    {
      label: '状态',
      key: 'state',
      component: (
        <Select placeholder="请选择" allowClear>
          <Select.Option value="notActive">未激活</Select.Option>
          <Select.Option value="offline">离线</Select.Option>
          <Select.Option value="online">在线</Select.Option>
        </Select>
      ),
    },
    {
      label: '设备产品',
      key: 'productId',
      component: (
        <Select placeholder="请选择" allowClear showSearch>
          {productList.map(item => (
            <Select.Option key={item.id}>{item.name}</Select.Option>
          ))}
        </Select>
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
                md={item.styles ? item.styles.md : 8}
                sm={item.styles ? item.styles.sm : 24}
                key={item.key}
                style={{ height: 56 }}
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
            {
              <a style={{ marginLeft: 8 }} onClick={() => setExpandForm(!expandForm)}>
                {expandForm ? '展开' : '收起'} <Icon type={expandForm ? 'down' : 'up'} />
              </a>
            }
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
