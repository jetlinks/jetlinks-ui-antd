import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Col, Input, Row, Select } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  parameterType: string;
  organizationList: any[];
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const initState: State = {
    parameterType: '',
    organizationList: [],
  };

  const [parameterType, setParameterType] = useState(initState.parameterType);
  const [organizationList, setOrganizationList] = useState(initState.organizationList);

  useEffect(() => {
    setParameterType('id');
    form.setFieldsValue({ parameter: 'id' });

    apis.deviceProdcut
      .queryOrganization()
      .then(res => {
        if (res.status === 200) {
          setOrganizationList(res.result);
        }
      }).catch(() => {
    });

  }, []);

  const search = () => {
    const data = form.getFieldsValue();
    // TODO 查询数据
    const map = {};
    map[data.parameter] = data.value;
    props.search(map);
  };

  const renderType = () => {
    switch (parameterType) {
      case 'id':
        return (
          <Col md={8} sm={24} key='value'>
            {getFieldDecorator('value', {})(
              <Input placeholder="请输入"/>,
            )}
          </Col>
        );
      case 'name$like':
        return (
          <Col md={8} sm={24} key='value'>
            {getFieldDecorator('value', {})(
              <Input placeholder="请输入"/>,
            )}
          </Col>
        );
      case 'orgId':
        return (
          <Col md={8} sm={24} key='value'>
            {getFieldDecorator('value', {})(
              <Select placeholder="所属机构，可输入查询" showSearch={true} allowClear={true}
                      filterOption={(inputValue, option) =>
                        option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                      }
              >
                {(organizationList || []).map(item => (
                  <Select.Option
                    key={JSON.stringify({ orgId: item.id, productName: item.name })}
                    value={item.id}
                  >
                    {item.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Col>
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
        <Col md={3} sm={24} key='parameter'>
          {getFieldDecorator('parameter', {
            initialValue: 'id',
          })(
            <Select placeholder="请选择" onChange={(value: string) => {
              setParameterType(value);
            }}>
              <Select.Option value="id" key="id">设备ID</Select.Option>
              <Select.Option value="name$like" key="name$like">设备名称</Select.Option>
              <Select.Option value="orgId" key="orgId">所属机构</Select.Option>
            </Select>,
          )}
        </Col>
        {renderType()}
        <Col push={16 - (Number(16) % 24)} md={12} sm={24}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => {
              search();
            }}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => {
              form.resetFields();
              form.setFieldsValue({ parameter: 'id' });
              setParameterType('id');
              props.search({});
            }}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
