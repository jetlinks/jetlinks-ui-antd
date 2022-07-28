import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Input, Row, Select } from 'antd';
import { getPageQuery } from '@/utils/utils';

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  parameterType: string;
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: { getFieldDecorator, setFieldsValue },
  } = props;

  const initState: State = {
    parameterType: 'id$LIKE',
  };

  const [parameterType, setParameterType] = useState(initState.parameterType);

  const mapType = new Map();
  mapType.set('id$LIKE', 'id');
  mapType.set('iccId$LIKE', 'iccId');

  useEffect(() => {
    setParameterType('id$LIKE');
    const query: any = getPageQuery();
    if (query && query !== {}) {
      mapType.forEach((value, key) => {
        let k = Object.keys(query)[0]
        if(value === k){
          form.setFieldsValue({ parameter: key });
          form.setFieldsValue({ value: query[k] });
        }
      });
    }else{
      form.setFieldsValue({ parameter: 'id$LIKE' });
    }
  }, []);

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    const map = {};
    let params = {}
    params[mapType.get(data.parameter)] = data.value
    params['productId'] = getPageQuery().productId
    if(getPageQuery().productId){
      params['productId'] = getPageQuery().productId
      map['productId'] = getPageQuery().productId
    }
    map[data.parameter] = data.value;
    props.search(map);
  };

  const renderType = () => {
    switch (parameterType) {
      case 'id$LIKE':
      case 'iccId$LIKE':
        return (
          <>
            {getFieldDecorator('value', {})(
              <Input placeholder="请输入" style={{ width: 'calc(100% - 100px)' }} />,
            )}
          </>
        );
      default:
        return null;
    }
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
        <Col md={8} sm={24} key='parameter'>
          <Input.Group compact>
            {getFieldDecorator('parameter', {
              initialValue: parameterType,
            })(
              <Select style={{ width: 100 }} placeholder="请选择"
                onChange={(value: string) => {
                  setFieldsValue({ 'value': undefined });
                  setParameterType(value);
                }}>
                <Select.Option value="id$LIKE" key="id$LIKE">卡号</Select.Option>
                <Select.Option value="iccId$LIKE" key="iccId$LIKE">ICCID</Select.Option>
              </Select>,
            )}
            {renderType()}
          </Input.Group>
        </Col>

        <div style={{
          float: 'right',
          marginBottom: 24,
          marginRight: 30,
          marginTop: 4
        }}>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={() => {
            search();
          }}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => {
            form.resetFields();
            form.setFieldsValue({ parameter: 'id$LIKE', value: undefined });
            setParameterType('id$LIKE');
            setFieldsValue({ 'value': undefined });
            props.search({});
          }}>
            重置
          </Button>
        </div>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
