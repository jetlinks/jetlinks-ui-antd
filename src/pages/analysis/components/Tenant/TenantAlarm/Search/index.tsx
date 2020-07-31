import React, {useEffect, useState} from 'react';
import Form, {FormComponentProps} from 'antd/lib/form';
import {Button, Col, Icon, Input, Row, Select} from 'antd';

interface Props extends FormComponentProps {
  search: Function;
}

interface State {
  parameterType: string;
  tagsData: any[];
}

const Search: React.FC<Props> = props => {

  const {
    form,
    form: {getFieldDecorator, setFieldsValue},
  } = props;

  const initState: State = {
    parameterType: 'deviceId$like',
    tagsData: [],
  };

  const [parameterType, setParameterType] = useState(initState.parameterType);

  useEffect(() => {
    setParameterType('deviceId$like');
    form.setFieldsValue({parameter: 'deviceId$like'});
  }, []);

  const search = () => {
    const data = form.getFieldsValue();
    const map = {};
    map[data.parameter] = data.value;
    props.search(map);
  };

  const renderType = () => {
    switch (parameterType) {
      case 'deviceId$like':
      case 'deviceName$like':
      case 'alarmName$LIKE':
        return (
          <>
            {getFieldDecorator('value', {})(
              <Input placeholder="请输入" style={{width: 'calc(100% - 150px)'}} allowClear
                     onChange={(event) => {
                       if (event.target.value === '' || event.target.value.length <= 0) {
                         form.resetFields();
                         form.setFieldsValue({parameter: 'deviceId$like', value: undefined});
                         setParameterType('deviceId$like');
                         setFieldsValue({'value': undefined});
                         props.search({});
                       }
                     }}
              />,
            )}
          </>
        );
      default:
        return null;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={{md: 12, lg: 24, xl: 48}}>
        <span style={{paddingLeft: 20}}>
          <b style={{fontSize: 18}}>告警记录</b>
        </span>
        <Col md={18} sm={24} key='parameter' style={{float: 'right'}}>
          <Input.Group compact>
            {getFieldDecorator('parameter', {
              initialValue: parameterType,
            })(
              <Select style={{width: 100}} placeholder="请选择"
                      onChange={(value: string) => {
                        setFieldsValue({'value': undefined});
                        setParameterType(value);
                      }}>
                <Select.Option value="deviceId$like" key="deviceId$like">设备ID</Select.Option>
                <Select.Option value="deviceName$like" key="deviceName$like">设备名称</Select.Option>
                <Select.Option value="alarmName$LIKE" key="alarmName$LIKE">告警名称</Select.Option>
              </Select>,
            )}
            {renderType()}
            <Button type="primary" style={{width: 50, textAlign: 'center'}} title='查询' onClick={() => {
              search();
            }}>
              <Icon type="search"/>
            </Button>
          </Input.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create<Props>()(Search);
