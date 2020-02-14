import { Modal, Form, Input, Radio, Select, Col, Row, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';
import { renderUnit } from '@/pages/device/public';

import styles from '../index.less';
import { Parameter } from '../data.d';

interface Props extends FormComponentProps {
  visible: boolean;
  closeVisible: Function;
  saveData: Function;
  data: Partial<Parameter>;
}

interface State {
  dataType: string | undefined;
  data: Partial<Parameter>;
  enumData: any[];
}

const ParameterUI: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
  } = props;
  const initState: State = {
    dataType: props.data.dataType,
    data: props.data,
    enumData: props.data.valueType?.properties || [{ key: '', value: '', id: 0 }],
  };

  const [dataType, setDataType] = useState(initState.dataType);
  const [enumData, setEnumData] = useState(initState.enumData);

  const dataTypeChange = (value: string) => {
    setDataType(value);
  };

  const saveData = () => {
    const { form } = props;
    const { id } = props.data;
    form.validateFields((err: any, fieldValue: any) => {
      if (err) return;
      props.saveData({ ...fieldValue, id });
      props.closeVisible();
    });
  };

  const renderDetailForm = () => {
    switch (dataType) {
      case 'int':
      case 'double':
      case 'float':
        return (
          <div>
            <Form.Item label="取值范围" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.min', {
                  rules: [{ required: true, message: '请输入最小值' }],
                  initialValue: initState.data.valueType?.min,
                })(<Input placeholder="最小值" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.max', {
                    rules: [{ required: true, message: '请输入最大值' }],
                    initialValue: initState.data.valueType?.max,
                  })(<Input placeholder="最大值" />)}
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item label="步长">
              {getFieldDecorator('valueType.step', {
                rules: [{ required: true, message: '请选择步长' }],
                initialValue: initState.data.valueType?.step,
              })(<Input placeholder="请输入步长" />)}
            </Form.Item>
            <Form.Item label="单位">
              {getFieldDecorator('valueType.unit', {
                rules: [{ required: true, message: '请选择单位' }],
                initialValue: initState.data.valueType?.unit,
              })(renderUnit())}
            </Form.Item>
          </div>
        );
      case 'text':
      case 'string':
        return (
          <div>
            <Form.Item label="数据长度">
              {getFieldDecorator('valueType.length', {
                rules: [{ required: true, message: '请输入数据长度' }],
                initialValue: initState.data.valueType?.length,
              })(<Input addonAfter="字节" />)}
            </Form.Item>
          </div>
        );
      case 'bool':
        return (
          <div>
            <Form.Item label="布尔值">
              {getFieldDecorator('valueType.true', {
                rules: [{ required: true, message: '请输入对应数据' }],
                initialValue: initState.data.valueType?.true,
              })(<Input addonBefore="0" placeholder="如：关" />)}
              <Form.Item>
                {getFieldDecorator('valueType.false', {
                  rules: [{ required: false }],
                  initialValue: initState.data.valueType?.false,
                })(<Input addonBefore="1" placeholder="如：开" />)}
              </Form.Item>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              {getFieldDecorator('valueType.dateTemplate', {
                initialValue: initState.data.valueType?.dateTemplate,
              })(
                <Select>
                  <Select.Option value="string">String类型的UTC时间戳 (毫秒)</Select.Option>
                  <Select.Option value="yyyy-MM-dd">yyyy-MM-dd</Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss EE">
                    yyyy-MM-dd HH:mm:ss EE
                  </Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss zzz">
                    yyyy-MM-dd HH:mm:ss zzz
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </div>
        );
      case 'array':
        return (
          <div>
            <Form.Item label="元素类型">
              {getFieldDecorator('arrayType', {
                rules: [{ required: true }],
                initialValue: initState.data.valueType?.arrayType,
              })(
                <Radio.Group>
                  <Radio value="int32">int32</Radio>
                  <Radio value="float">float</Radio>
                  <Radio value="double">double</Radio>
                  <Radio value="text">text</Radio>
                  <Radio value="struct">struct</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </div>
        );
      case 'enum':
        return (
          <div>
            <Form.Item label="枚举项">
              {enumData.map((item, index) => (
                <Row key={item.id}>
                  <Col span={10}>
                    <Input
                      placeholder="编号为：0"
                      value={item.value}
                      onChange={event => {
                        enumData[index].value = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={10}>
                    <Input
                      placeholder="对该枚举项的描述"
                      value={item.key}
                      onChange={event => {
                        enumData[index].key = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    {index === 0 ? (
                      <Icon
                        type="plus-circle"
                        onClick={() => {
                          setEnumData([...enumData, { id: enumData.length + 1 }]);
                        }}
                      />
                    ) : (
                      <Icon
                        type="minus-circle"
                        onClick={() => {
                          enumData.splice(index, 1);
                          setEnumData([...enumData]);
                        }}
                      />
                    )}
                  </Col>
                </Row>
              ))}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible
      title="编辑参数"
      onCancel={() => {
        props.closeVisible();
      }}
      onOk={() => {
        saveData();
      }}
    >
      <Form className={styles.paramterForm}>
        <Form.Item label="参数名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入参数名称' }],
            initialValue: initState.data.name,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标识符">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入标识符' }],
            initialValue: initState.data.id,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="数据类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: initState.data.dataType,
          })(
            <Select
              placeholder="请选择"
              onChange={(value: string) => {
                dataTypeChange(value);
              }}
            >
              <Select.OptGroup label="基本类型">
                <Select.Option value="int">int(整数型)</Select.Option>
                <Select.Option value="double">double(双精度浮点数)</Select.Option>
                <Select.Option value="float">float(单精度浮点数)</Select.Option>
                <Select.Option value="string">text(字符串)</Select.Option>
                <Select.Option value="bool">bool(布尔型)</Select.Option>
                <Select.Option value="date">date(时间型)</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="其他类型">
                <Select.Option value="enum">enum(枚举)</Select.Option>
                <Select.Option value="array">array(数组)</Select.Option>
                <Select.Option value="struct">struct(结构体)</Select.Option>
              </Select.OptGroup>
            </Select>,
          )}
        </Form.Item>
        {renderDetailForm()}
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            initialValue: initState.data.description,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(ParameterUI);
