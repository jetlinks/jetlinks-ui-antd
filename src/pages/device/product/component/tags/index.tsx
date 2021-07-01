import React, { useContext, useEffect, useState } from 'react';
import {
  Input,
  Radio,
  Button,
  List,
  Select,
  Drawer,
  Col,
  Row,
  Icon,
  AutoComplete,
  InputNumber,
  Collapse,
  Dropdown,
  Menu,
} from 'antd';
import Form, { FormComponentProps } from 'antd/es/form';
import { renderUnit } from '@/pages/device/public';
import { TagsMeta } from '../data.d';
import Paramter from '../paramter';
import { ProductContext } from "@/pages/device/product/context";
import apis from "@/services";

interface Props extends FormComponentProps {
  data: Partial<TagsMeta>;
  save: Function;
  close: Function;
  unitsData: any;
}

interface State {
  dataType: string;
  data: Partial<TagsMeta>;
  enumData: any[];
  parameterVisible: boolean;
  parameters: any[];
  currentParameter: any;
  properties: any[];
  arrayProperties: any[];
  aType: string;
  arrParameterVisible: boolean;
  arrayEnumData: any[];
}

const TagsDefin: React.FC<Props> = props => {
  const initState: State = {
    dataType: props.data.valueType?.type || '',
    data: props.data,
    enumData: props.data.valueType?.elements || [{ text: '', value: '', id: 0 }],
    parameterVisible: false,
    properties: props.data.valueType?.properties || [],
    currentParameter: {},
    parameters: [],
    arrayEnumData: props.data.valueType?.elementType?.elements || [{ text: '', value: '', id: 0 }],
    arrParameterVisible: false,
    arrayProperties: props.data.valueType?.elementType?.properties || [],
    aType: props.data.valueType?.elementType?.type || '',
  };

  const {
    form: { getFieldDecorator, getFieldsValue },
  } = props;

  const [dataType, setDataType] = useState(initState.dataType);
  const [enumData, setEnumData] = useState(initState.enumData);
  const [parameterVisible, setParameterVisible] = useState(initState.parameterVisible);
  const [properties, setProperties] = useState(initState.properties);
  const [currentParameter, setCurrentParameter] = useState(initState.currentParameter);
  const [configMetadata, setConfigMetadata] = useState<any[]>([]);
  const [loadConfig, setLoadConfig] = useState<boolean>(false);
  const [aType, setAType] = useState<string>(initState.aType);
  const [arrayProperties, setArrayProperties] = useState(initState.arrayProperties);
  const [arrParameterVisible, setArrParameterVisible] = useState(initState.arrParameterVisible);
  const [arrayEnumData, setArrayEnumData] = useState(initState.arrayEnumData);
  useEffect(() => {
    if (dataType === 'enum') {
      const elements = props.data.valueType?.enums || [];
      setEnumData(elements);
    }
  }, []);

  const dataTypeChange = (value: string) => {
    setDataType(value);
  };

  const getFormData = (onlySave: boolean) => {
    const {
      form,
      // data,
    } = props;
    form.validateFields((err: any, fieldValue: any) => {
      if (err) return;
      const data = fieldValue;
      if (dataType === 'enum') {
        data.valueType.elements = enumData;
      }
      if (dataType === 'object') {
        data.valueType.properties = properties;
      }
      if (dataType === 'array' && data.valueType.elementType.type === 'object') {
        data.valueType.elementType.properties = arrayProperties;
      }
      props.save({ ...data }, onlySave);
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button type="default" onClick={() => {
          getFormData(true);
        }}>
          仅保存
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button onClick={() => {
          getFormData(false);
        }}>保存并生效</Button>
      </Menu.Item>
    </Menu>
  );

  let dataSource = [{
    text: 'String类型的UTC时间戳 (毫秒)',
    value: 'string',
  }, 'yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd HH:mm:ss EE', 'yyyy-MM-dd HH:mm:ss zzz'];



  const renderAType = () => {
    switch (aType) {
      case 'float':
      case 'double':
        return (
          <div>
            <Form.Item label="精度">
              {getFieldDecorator('valueType.elementType.scale', {
                // initialValue: initState.data.valueType?.scale,
              })(<InputNumber precision={0} min={0} step={1} placeholder="小数点位数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="单位">
              {getFieldDecorator('valueType.elementType.unit', {
                // initialValue: initState.data.valueType?.unit,
              })(renderUnit(props.unitsData))}
            </Form.Item>
          </div>
        );
      case 'int':
      case 'long':
        return (
          <div>
            <Form.Item label="单位">
              {getFieldDecorator('valueType.elementType.unit', {
                initialValue: initState.data.valueType?.elementType?.unit,
              })(renderUnit(props.unitsData))}
            </Form.Item>
          </div>
        );
      case 'string':
        return (
          <div>
            <Form.Item label="最大长度">
              {getFieldDecorator('valueType.elementType.expands.maxLength', {
                initialValue: initState.data.valueType?.elementType.expands?.maxLength,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'boolean':
        return (
          <div>
            <Form.Item label="布尔值" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.elementType.trueText', {
                  initialValue: initState.data.valueType?.elementType.trueText || '是',
                })(<Input placeholder="trueText" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.elementType.trueValue', {
                    initialValue: initState.data.valueType?.elementType.trueValue || true,
                  })(<Input placeholder="trueValue" />)}
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.elementType.falseText', {
                  initialValue: initState.data.valueType?.elementType.falseText || '否',
                })(<Input placeholder="falseText" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.elementType.falseValue', {
                    initialValue: initState.data.valueType?.elementType.falseValue || false,
                  })(<Input placeholder="falseValue" />)}
                </Form.Item>
              </Col>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              {getFieldDecorator('valueType.elementType.format', {
                initialValue: initState.data.valueType?.elementType.format,
              })(
                <AutoComplete dataSource={dataSource} placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
                  filterOption={(inputValue, option) =>
                    option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                  }
                />,
              )}
            </Form.Item>
          </div>
        );
      case 'enum':
        return (
          <div>
            <Form.Item label="枚举项">
              {arrayEnumData.map((item, index) => (
                <Row key={item.id}>
                  <Col span={10}>
                    <Input
                      placeholder="标识"
                      value={item.value}
                      onChange={event => {
                        arrayEnumData[index].value = event.target.value;
                        setArrayEnumData([...arrayEnumData]);
                      }}
                    />
                  </Col>
                  <Col span={1} style={{ textAlign: 'center' }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={10}>
                    <Input
                      placeholder="对该枚举项的描述"
                      value={item.text}
                      onChange={event => {
                        arrayEnumData[index].text = event.target.value;
                        setArrayEnumData([...arrayEnumData]);
                      }}
                    />
                  </Col>
                  <Col span={3} style={{ textAlign: 'center' }}>
                    {index === 0 ? (
                      (arrayEnumData.length - 1) === 0 ? (
                        <Icon type="plus-circle"
                          onClick={() => {
                            setArrayEnumData([...arrayEnumData, { id: arrayEnumData.length + 1 }]);
                          }}
                        />
                      ) : (
                          <Icon type="minus-circle"
                            onClick={() => {
                              arrayEnumData.splice(index, 1);
                              setArrayEnumData([...arrayEnumData]);
                            }}
                          />
                        )
                    ) : (
                        index === (arrayEnumData.length - 1) ? (
                          <Row>
                            <Icon type="plus-circle"
                              onClick={() => {
                                setArrayEnumData([...arrayEnumData, { id: arrayEnumData.length + 1 }]);
                              }}
                            />
                            <Icon style={{ paddingLeft: 10 }}
                              type="minus-circle"
                              onClick={() => {
                                arrayEnumData.splice(index, 1);
                                setArrayEnumData([...arrayEnumData]);
                              }}
                            />
                          </Row>
                        ) : (
                            <Icon type="minus-circle"
                              onClick={() => {
                                arrayEnumData.splice(index, 1);
                                setArrayEnumData([...arrayEnumData]);
                              }}
                            />
                          )
                      )}
                  </Col>
                </Row>
              ))}
            </Form.Item>
          </div>
        );
      case 'object':
        return (
          <Form.Item label="JSON对象">
            {arrayProperties.length > 0 && (
              <List
                bordered
                dataSource={arrayProperties}
                renderItem={(item: any) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          setArrParameterVisible(true);
                          setCurrentParameter(item);
                        }}
                      >
                        编辑
                      </Button>,
                      <Button
                        type="link"
                        onClick={() => {
                          const index = arrayProperties.findIndex((i: any) => i.id === item.id);
                          arrayProperties.splice(index, 1);
                          setArrayProperties([...arrayProperties]);
                        }}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    参数名称：{item.name}
                  </List.Item>
                )}
              />
            )}
            <Button
              type="link"
              onClick={() => {
                setCurrentParameter({});
                setArrParameterVisible(true);
              }}
            >
              <Icon type="plus" />
              添加参数
            </Button>
          </Form.Item>
        );
      case 'file':
        return (
          <Form.Item label="文件类型">
            {getFieldDecorator('valueType.elementType.fileType', {
              initialValue: initState.data.valueType?.elementType.fileType,
            })(
              <Select>
                <Select.Option value="url">URL(链接)</Select.Option>
                <Select.Option value="base64">Base64(Base64编码)</Select.Option>
                <Select.Option value="binary">Binary(二进制)</Select.Option>
              </Select>,
            )}
          </Form.Item>
        );
      case 'password':
        return (
          <div>
            <Form.Item label="密码长度">
              {getFieldDecorator('valueType.elementType.expands.maxLength', {
                initialValue: initState.data.valueType?.elementType?.expands?.maxLength,
              })(<Input addonAfter="字节" />)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  }

  const renderDataType = () => {
    switch (dataType) {
      case 'float':
      case 'double':
        return (
          <div>
            {/* <Form.Item label="取值范围" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.min', {
                  initialValue: initState.data.valueType?.min,
                })(<InputNumber style={{ width: '100%' }} placeholder="最小值" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.max', {
                    initialValue: initState.data.valueType?.max,
                  })(<InputNumber style={{ width: '100%' }} placeholder="最大值" />)}
                </Form.Item>
              </Col>
            </Form.Item>

            <Form.Item label="步长">
              {getFieldDecorator('valueType.step', {
                initialValue: initState.data.valueType?.step,
              })(<Input placeholder="请输入步长" />)}
            </Form.Item> */}

            <Form.Item label="精度">
              {getFieldDecorator('valueType.scale', {
                initialValue: initState.data.valueType?.scale,
              })(<InputNumber min={0} step={1} placeholder="小数点位数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="单位">
              {getFieldDecorator('valueType.unit', {
                initialValue: initState.data.valueType?.unit,
              })(renderUnit(props.unitsData))}
            </Form.Item>
          </div>
        );
      case 'int':
      case 'long':
        return (
          <div>
            {/* <Form.Item label="取值范围" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.min', {
                  initialValue: initState.data.valueType?.min,
                })(<InputNumber style={{ width: '100%' }} placeholder="最小值" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.max', {
                    initialValue: initState.data.valueType?.max,
                  })(<InputNumber style={{ width: '100%' }} placeholder="最大值" />)}
                </Form.Item>
              </Col>
            </Form.Item>

            <Form.Item label="步长">
              {getFieldDecorator('valueType.step', {
                initialValue: initState.data.valueType?.step,
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入步长" />)}
            </Form.Item> */}
            <Form.Item label="单位">
              {getFieldDecorator('valueType.unit', {
                initialValue: initState.data.valueType?.unit,
              })(renderUnit(props.unitsData))}
            </Form.Item>
          </div>
        );
      case 'string':
        return (
          <div>
            <Form.Item label="最大长度">
              {getFieldDecorator('valueType.expands.maxLength', {
                initialValue: initState.data.valueType?.expands?.maxLength,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'boolean':
        return (
          <div>
            <Form.Item label="布尔值" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.trueText', {
                  initialValue: initState.data.valueType?.trueText || '是',
                })(<Input placeholder="trueText" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.trueValue', {
                    initialValue: initState.data.valueType?.trueValue || true,
                  })(<Input placeholder="trueValue" />)}
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.falseText', {
                  initialValue: initState.data.valueType?.falseText || '否',
                })(<Input placeholder="falseText" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.falseValue', {
                    initialValue: initState.data.valueType?.falseValue || false,
                  })(<Input placeholder="falseValue" />)}
                </Form.Item>
              </Col>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              {getFieldDecorator('valueType.format', {
                initialValue: initState.data.valueType?.format,
              })(
                <AutoComplete dataSource={dataSource} placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
                  filterOption={(inputValue, option) =>
                    option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                  }
                />,
              )}
            </Form.Item>
          </div>
        );
      case 'array':
        return (
          <div>
            <Form.Item label="元素类型">
              {getFieldDecorator('valueType.elementType.type', {
                initialValue: initState.data.valueType?.elementType.type,
              })(
                <Select
                  placeholder="请选择"
                  onChange={(value: string) => {
                    setAType(value);
                    getMetadata(undefined, value)
                  }}
                >
                  <Select.OptGroup label="基本类型">
                    <Select.Option value="int">int(整数型)</Select.Option>
                    <Select.Option value="long">long(长整数型)</Select.Option>
                    <Select.Option value="float">float(单精度浮点型)</Select.Option>
                    <Select.Option value="double">double(双精度浮点数)</Select.Option>
                    <Select.Option value="string">text(字符串)</Select.Option>
                    <Select.Option value="boolean">bool(布尔型)</Select.Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="其他类型">
                    <Select.Option value="date">date(时间型)</Select.Option>
                    <Select.Option value="enum">enum(枚举)</Select.Option>
                    <Select.Option value="object">object(结构体)</Select.Option>
                    <Select.Option value="file">file(文件)</Select.Option>
                    <Select.Option value="password">password(密码)</Select.Option>
                    <Select.Option value="geoPoint">geoPoint(地理位置)</Select.Option>
                  </Select.OptGroup>
                </Select>
              )}
              {renderAType()}
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
                      placeholder="标识"
                      value={item.value}
                      onChange={event => {
                        enumData[index].value = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={1} style={{ textAlign: 'center' }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={10}>
                    <Input
                      placeholder="对该枚举项的描述"
                      value={item.text}
                      onChange={event => {
                        enumData[index].text = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={3} style={{ textAlign: 'center' }}>
                    {index === 0 ? (
                      (enumData.length - 1) === 0 ? (
                        <Icon type="plus-circle"
                          onClick={() => {
                            setEnumData([...enumData, { id: enumData.length + 1 }]);
                          }}
                        />
                      ) : (
                          <Icon type="minus-circle"
                            onClick={() => {
                              enumData.splice(index, 1);
                              setEnumData([...enumData]);
                            }}
                          />
                        )
                    ) : (
                        index === (enumData.length - 1) ? (
                          <Row>
                            <Icon type="plus-circle"
                              onClick={() => {
                                setEnumData([...enumData, { id: enumData.length + 1 }]);
                              }}
                            />
                            <Icon style={{ paddingLeft: 10 }}
                              type="minus-circle"
                              onClick={() => {
                                enumData.splice(index, 1);
                                setEnumData([...enumData]);
                              }}
                            />
                          </Row>
                        ) : (
                            <Icon type="minus-circle"
                              onClick={() => {
                                enumData.splice(index, 1);
                                setEnumData([...enumData]);
                              }}
                            />
                          )
                      )}
                  </Col>
                </Row>
              ))}
            </Form.Item>
          </div>
        );
      case 'object':
        return (
          <Form.Item label="JSON对象">
            {properties.length > 0 && (
              <List
                bordered
                dataSource={properties}
                renderItem={(item: any) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          setParameterVisible(true);
                          setCurrentParameter(item);
                        }}
                      >
                        编辑
                      </Button>,
                      <Button
                        type="link"
                        onClick={() => {
                          const index = properties.findIndex((i: any) => i.id === item.id);
                          properties.splice(index, 1);
                          setProperties([...properties]);
                        }}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    参数名称：{item.name}
                  </List.Item>
                )}
              />
            )}
            <Button
              type="link"
              onClick={() => {
                setCurrentParameter({});
                setParameterVisible(true);
              }}
            >
              <Icon type="plus" />
              添加参数
            </Button>
          </Form.Item>
        );
      case 'file':
        return (
          <Form.Item label="文件类型">
            {getFieldDecorator('valueType.fileType', {
              initialValue: initState.data.valueType?.fileType,
            })(
              <Select>
                <Select.Option value="url">URL(链接)</Select.Option>
                <Select.Option value="base64">Base64(Base64编码)</Select.Option>
                <Select.Option value="binary">Binary(二进制)</Select.Option>
              </Select>,
            )}
          </Form.Item>
        );
      /*case 'geoPoint':
        return (
          <div>
            <Form.Item label="经度字段">
              {getFieldDecorator('valueType.latProperty', {
                initialValue: initState.data.valueType?.latProperty,
              })(<Input placeholder="请输入经度字段" />)}
            </Form.Item>
            <Form.Item label="纬度字段">
              {getFieldDecorator('valueType.lonProperty', {
                initialValue: initState.data.valueType?.lonProperty,
              })(<Input placeholder="请输入纬度字段" />)}
            </Form.Item>
          </div>
        );*/
      case 'password':
        return (
          <div>
            <Form.Item label="密码长度">
              {getFieldDecorator('valueType.expands.maxLength', {
                initialValue: initState.data.valueType?.expands?.maxLength,
              })(<Input addonAfter="字节" />)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };


  const product = useContext<any>(ProductContext);

  useEffect(() => getMetadata(), []);
  const getMetadata = (id?: any, type?: any) => {
    const data = getFieldsValue(['id', 'valueType.type']);
    if (id) {
      data.id = id;
    }
    if (type) {
      data.valueType.type = type;
    }

    if (data.id && data.valueType.type) {
      setLoadConfig(true);
      apis.deviceProdcut.configMetadata({
        productId: product.id,
        modelType: 'property',
        modelId: data.id,
        typeId: data.valueType.type
      }).then(rsp => {
        setLoadConfig(false);
        setConfigMetadata(rsp.result);
      }).finally(() => setLoadConfig(false));
    }
  }
  const renderItem = (config: any) => {
    switch (config.type.type) {
      case 'int':
      case 'string':
        return <Input />
      case 'enum':
        return (
          <Select>
            {config.type.elements.map(i => (
              <Select.Option value={i.value}>{i.text}</Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />
    }
  }

  const renderConfigMetadata = () => {
    return (
      <Collapse>{
        (configMetadata || []).map((item, index) => {
          return (
            <Collapse.Panel header={item.name} key={index}>
              {item.properties.map((config: any) => (
                <Form.Item label={config.name} key={config.property}>
                  {getFieldDecorator(`expands.${config.property}`, {
                    initialValue: (initState.data?.expands || {})[config.property]
                  })(renderItem(config))}
                </Form.Item>
              ))}
            </Collapse.Panel>
          )
        })}</Collapse>
    )
  }

  return (
    <div>
      <Drawer
        title={!initState.data.id ? `添加标签` : `编辑标签`}
        placement="right"
        closable={false}
        onClose={() => props.close()}
        visible
        width="30%"
      >
        <Form>
          <Form.Item label="标签标识">
            {getFieldDecorator('id', {
              rules: [
                { required: true, message: '请输入标签标识' },
                { max: 64, message: '标签标识不超过64个字符' },
                { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '标签标识只能由数字、字母、下划线、中划线组成' }
              ],
              initialValue: initState.data.id,
            })(
              <Input
                onChange={(value) => getMetadata(value.target.value, undefined)}
                disabled={!!initState.data.id}
                style={{ width: '100%' }}
                placeholder="请输入标签标识"
              />,
            )}
          </Form.Item>
          <Form.Item label="标签名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入标签名称' },
                { max: 200, message: '标签名称不超过200个字符' }
              ],
              initialValue: initState.data.name,
            })(<Input style={{ width: '100%' }} placeholder="请输入标签名称" />)}
          </Form.Item>
          <Form.Item label="数据类型">
            {getFieldDecorator('valueType.type', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: initState.data.valueType?.type,
            })(
              <Select
                placeholder="请选择"
                onChange={(value: string) => {
                  dataTypeChange(value);
                  getMetadata(undefined, value)
                }}
              >
                <Select.OptGroup label="基本类型">
                  <Select.Option value="int">int(整数型)</Select.Option>
                  <Select.Option value="long">long(长整数型)</Select.Option>
                  <Select.Option value="float">float(单精度浮点型)</Select.Option>
                  <Select.Option value="double">double(双精度浮点数)</Select.Option>
                  <Select.Option value="string">text(字符串)</Select.Option>
                  <Select.Option value="boolean">bool(布尔型)</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="其他类型">
                  <Select.Option value="date">date(时间型)</Select.Option>
                  <Select.Option value="enum">enum(枚举)</Select.Option>
                  <Select.Option value="array">array(数组)</Select.Option>
                  <Select.Option value="object">object(结构体)</Select.Option>
                  <Select.Option value="file">file(文件)</Select.Option>
                  <Select.Option value="password">password(密码)</Select.Option>
                  <Select.Option value="geoPoint">geoPoint(地理位置)</Select.Option>
                </Select.OptGroup>
              </Select>,
            )}
          </Form.Item>
          {renderDataType()}

          <Form.Item label="是否只读">
            {getFieldDecorator('expands.readOnly', {
              rules: [{ required: true }],
              initialValue: initState.data.expands?.readOnly?.toString?.(),
            })(
              <Radio.Group>
                <Radio value="true">是</Radio>
                <Radio value="false">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {/*<Form.Item label="设备上报">
            {getFieldDecorator('expands.report', {
              rules: [{ required: true }],
              initialValue: initState.data.expands?.report,
            })(
              <Radio.Group>
                <Radio value="true">是</Radio>
                <Radio value="false">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>*/}
          {!loadConfig && renderConfigMetadata()}

          <Form.Item label="描述">
            {getFieldDecorator('description', {
              initialValue: initState.data.description,
            })(<Input.TextArea rows={3} />)}
          </Form.Item>
        </Form>

        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => {
              props.close();
            }}
            style={{ marginRight: 8 }}
          >
            关闭
          </Button>
          <Dropdown overlay={menu}>
            <Button icon="menu" type="primary">
              保存<Icon type="down" />
            </Button>
          </Dropdown>
          {/* <Button
            onClick={() => {
              getFormData();
            }}
            type="primary"
          >
            保存
          </Button> */}
        </div>
        {parameterVisible && (
          <Paramter
            save={item => {
              const index = properties.findIndex((e: any) => e.id === item.id);
              if (index === -1) {
                properties.push(item);
              } else {
                properties[index] = item;
              }
              setProperties(properties);
            }}
            unitsData={props.unitsData}
            close={() => {
              setCurrentParameter({});
              setParameterVisible(false);
            }}
            data={currentParameter}
          />
        )}
        {arrParameterVisible && (
          <Paramter
            save={item => {
              const index = arrayProperties.findIndex((e: any) => e.id === item.id);
              if (index === -1) {
                arrayProperties.push(item);
              } else {
                arrayProperties[index] = item;
              }
              setArrayProperties(arrayProperties);
            }}
            unitsData={props.unitsData}
            close={() => {
              setCurrentParameter({});
              setArrParameterVisible(false);
            }}
            data={currentParameter}
          />
        )}
      </Drawer>
    </div>
  );
};

export default Form.create<Props>()(TagsDefin);
