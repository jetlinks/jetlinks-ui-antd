import {
  AutoComplete,
  Button,
  Col,
  Collapse,
  Drawer,
  Form,
  Icon,
  Input,
  InputNumber,
  List,
  message,
  Row,
  Select
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../index.less';
import { groupBy } from 'lodash';
import { Unit } from '@/utils/unit';
import { ProductContext } from '../../context';
import apis from '@/services';
import _ from 'lodash';

interface Props {
  save: (data: any) => void;
  close: Function;
  data: any;
  unitsData: any;
}

interface State {
  dataType: string;
  parameterVisible: boolean;
  data: any;
  enumData: any[];
  currentParameter: any;
  arrayEnumData: any[];
  arrParameterVisible: boolean;
  arrayProperties: any[];
  aType: string;
}

const Paramter: React.FC<Props> = props => {
  const initState: State = {
    dataType: props.data.valueType?.type || '',
    parameterVisible: false,
    data: { ...props.data },
    enumData: props.data.valueType?.elements || [{ text: '', value: '', id: 0 }],
    currentParameter: {},
    aType: props.data.valueType?.elementType?.type || '',
    arrayEnumData: props.data.valueType?.elementType?.elements || [{ text: '', value: '', id: 0 }],
    arrParameterVisible: false,
    arrayProperties: props.data.valueType?.elementType?.properties || [],
  };
  const [dataType, setDataType] = useState(initState.dataType);
  const [parameterVisible, setParameterVisible] = useState(initState.parameterVisible);
  const [data, setData] = useState(initState.data);
  const [currentParameter, setCurrentParameter] = useState(initState.currentParameter);
  const [enumData, setEnumData] = useState(initState.enumData);
  const [configMetadata, setConfigMetadata] = useState<any[]>([]);
  const [loadConfig, setLoadConfig] = useState<boolean>(false);
  const [arrayEnumData, setArrayEnumData] = useState(initState.arrayEnumData);
  const [arrParameterVisible, setArrParameterVisible] = useState(initState.arrParameterVisible);
  const [arrayProperties, setArrayProperties] = useState(initState.arrayProperties);
  const [aType, setAType] = useState<string>(initState.aType);

  const dataTypeChange = (value: string) => {
    setDataType(value);
  };

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
              <InputNumber
                onChange={(value) => {
                  data.valueType.elementType.scale = value;
                  setData({ ...data });
                }}
                value={data.valueType.elementType?.scale}
                precision={0}
                min={0}
                step={1}
                placeholder="小数点位数"
                style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="单位">
              <Select
                onChange={(value: string) => {
                  data.valueType.elementType.unit = value;
                  setData({ ...data });
                }}
                value={data.valueType?.elementType?.unit}
              >
                {Array.from(new Set<string>(props.unitsData.map((unit: any) => {
                  return unit.type;
                }))).map(type => {
                  const typeData = groupBy(props.unitsData, unit => unit.type)[type];
                  return (
                    <Select.OptGroup label={type} key={type}>
                      {typeData.map((e: Unit) => (
                        <Select.Option value={e.id} key={e.id}>
                          {e.name} / {e.symbol}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        );
      case 'int':
      case 'long':
        return (
          <div>

            <Form.Item label="单位">
              <Select
                onChange={(value: string) => {
                  data.valueType.elementType.unit = value;
                  setData({ ...data });
                }}
                value={data.valueType?.elementType?.unit}
              >
                {Array.from(new Set<string>(props.unitsData.map((unit: any) => {
                  return unit.type;
                }))).map(type => {
                  const typeData = groupBy(props.unitsData, unit => unit.type)[type];
                  return (
                    <Select.OptGroup label={type} key={type}>
                      {typeData.map((e: Unit) => (
                        <Select.Option value={e.id} key={e.id}>
                          {e.name} / {e.symbol}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        );
      case 'string':
        return (
          <div>
            <Form.Item label="最大长度">
              <Input
                onChange={(value) => {
                  if (!data.valueType.elementType.expands) {
                    data.valueType.elementType.expands = {};
                  }
                  data.valueType.elementType.expands.maxLength = value.target.value;
                  setData({ ...data });
                }}
                value={data.valueType?.elementType?.expands?.maxLength}
              />
            </Form.Item>
          </div>
        );
      case 'boolean':
        return (
          <div>
            <Form.Item label="布尔值" style={{ height: 69 }}>
              <Col span={11}>
                <Input
                  onChange={(value) => {
                    data.valueType.elementType.trueText = value.target.value;
                    setData({ ...data });
                  }}
                  value={data.valueType?.elementType?.trueText}

                  placeholder="trueText" />
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  <Input
                    onChange={(value) => {
                      data.valueType.elementType.trueValue = value.target.value;
                      setData({ ...data });
                    }}
                    value={data.valueType?.elementType?.trueValue}
                    placeholder="trueValue" />
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item style={{ height: 69 }}>
              <Col span={11}>
                <Input
                  onChange={(value) => {
                    data.valueType.elementType.falseText = value.target.value;
                    setData({ ...data });
                  }}
                  value={data.valueType?.elementType?.falseText}
                  placeholder="falseText" />
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  <Input
                    onChange={(value) => {
                      data.valueType.elementType.falseValue = value.target.value;
                      setData({ ...data });
                    }}
                    value={data.valueType?.elementType?.falseValue}
                    placeholder="falseValue" />
                </Form.Item>
              </Col>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              <AutoComplete
                onChange={(value) => {
                  data.valueType.elementType.format = value;
                  setData({ ...data });
                }}
                value={data.valueType?.elementType?.format}
                dataSource={dataSource}
                placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
                filterOption={(inputValue, option) =>
                  option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                }
              />
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
            <Select
              onChange={(value: any) => {
                // data.valueType.elementType.fileType = value;
                _.set(data, 'valueType.elementType.fileType', value);
                setData({ ...data });

              }}
              value={data.valueType?.elementType?.fileType}
            >
              <Select.Option value="url">URL(链接)</Select.Option>
              <Select.Option value="base64">Base64(Base64编码)</Select.Option>
              <Select.Option value="binary">Binary(二进制)</Select.Option>
            </Select>

          </Form.Item>
        );
      case 'password':
        return (
          <div>
            <Form.Item label="密码长度">
              <Input
                onChange={(e: any) => {
                  if (!data.valueType.elementType.expands) {
                    data.valueType.elementType.expands = {};
                  }
                  data.valueType.elementType.expands.maxLength = e.target.value;
                  setData({ ...data });
                }}
                value={data.valueType?.elementType?.expands?.maxLength}
                addonAfter="字节" />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  }
  const renderDetailForm = () => {
    switch (dataType) {
      case 'int':
      case 'long':
        return (
          <div>
            <Form.Item label="单位">
              <Select
                onChange={(value: string) => {
                  data.valueType.unit = value;
                  setData({ ...data });
                }}
                value={data.valueType.unit}
              >
                {Array.from(new Set<string>(props.unitsData.map((unit: any) => {
                  return unit.type;
                }))).map(type => {
                  const typeData = groupBy(props.unitsData, unit => unit.type)[type];
                  return (
                    <Select.OptGroup label={type} key={type}>
                      {typeData.map((e: Unit) => (
                        <Select.Option value={e.id} key={e.id}>
                          {e.name} / {e.symbol}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        );
      case 'double':
      case 'float':
        return (
          <div>
            <Form.Item label="精度" style={{ height: 69 }}>
              <InputNumber
                min={0} step={1} placeholder="请输入精度"
                value={data.valueType.scale}
                style={{ width: '100%' }}
                onChange={value => {
                  data.valueType.scale = value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
            <Form.Item label="单位">
              <Select
                onChange={(value: string) => {
                  data.valueType.unit = value;
                  setData({ ...data });
                }}
                value={data.valueType.unit}
              >
                {Array.from(new Set<string>(props.unitsData.map((unit: any) => {
                  return unit.type;
                }))).map(type => {
                  const typeData = groupBy(props.unitsData, unit => unit.type)[type];
                  return (
                    <Select.OptGroup label={type} key={type}>
                      {typeData.map((e: Unit) => (
                        <Select.Option value={e.id} key={e.id}>
                          {e.name} / {e.symbol}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  );
                })}
                {/*{renderUnit(props.unitsData)}*/}
              </Select>
            </Form.Item>
          </div>
        );
      case 'string':
        return (
          <div>
            <Form.Item label="最大长度">
              <Input
                value={data.valueType?.expands?.maxLength}
                onChange={event => {
                  if (!data.valueType.expands) {
                    data.valueType.expands = {};
                  }
                  data.valueType.expands.maxLength = event.target.value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
          </div>
        );
      case 'boolean':
        return (
          <div>
            <Form.Item label="布尔值" style={{ height: 69 }}>
              <Col span={11}>
                <Input
                  value={data.valueType?.trueText}
                  placeholder="trueText"
                  onChange={event => {
                    data.valueType.trueText = event.target.value;
                    setData({ ...data });
                  }}
                />
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  <Input
                    value={data.valueType?.trueValue}
                    placeholder="trueValue"
                    onChange={event => {
                      data.valueType.trueValue = event.target.value;
                      setData({ ...data });
                    }}
                  />
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item style={{ height: 69 }}>
              <Col span={11}>
                <Input
                  value={data.valueType?.falseText}
                  placeholder="falseText"
                  onChange={event => {
                    data.valueType.falseText = event.target.value;
                    setData({ ...data });
                  }}
                />
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  <Input
                    value={data.valueType?.falseValue}
                    placeholder="falseValue"
                    onChange={event => {
                      data.valueType.falseValue = event.target.value
                      setData({ ...data });
                    }}
                  />
                </Form.Item>
              </Col>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              <AutoComplete dataSource={dataSource} placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
                value={data.valueType?.format}
                onChange={value => {
                  data.valueType.format = value;
                  setData({ ...data });
                }}
                filterOption={(inputValue, option) =>
                  option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </div>
        );
      case 'array':
        return (
          <div>
            <Form.Item label="元素类型">
              <Select
                placeholder="请选择"
                value={data.valueType?.elementType?.type}
                onChange={(value: string) => {
                  setAType(value);
                  _.set(data, 'valueType.elementType.type', value);
                  setData({ ...data });
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
            </Form.Item>
            {renderAType()}
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
            {(data.valueType.parameters || []).length > 0 && (
              <List
                bordered
                dataSource={data.valueType.parameters || []}
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
                          const index = data.valueType.parameters.findIndex(
                            (i: any) => i.id === item.id,
                          );
                          data.valueType.parameters.splice(index, 1);
                          setData({ ...data });
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
      /*case 'geoPoint':
        return (
          <div>
            <Form.Item label="经度字段">
              <Input
                value={data.valueType.latProperty}
                onChange={event => {
                  data.valueType.latProperty = event.target.value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
            <Form.Item label="纬度字段">
              <Input
                value={data.valueType.lonProperty}
                onChange={event => {
                  data.valueType.lonProperty = event.target.value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
          </div>
        );*/
      case 'password':
        return (
          <div>
            <Form.Item label="密码长度">
              <Input
                addonAfter="字节"
                value={data.valueType?.expands?.maxLength}
                onChange={event => {
                  if (!data.valueType.expands) {
                    data.valueType.expands = {};
                  }
                  data.valueType.expands.maxLength = event.target.value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  function saveData() {
    // 递归保存数据
    if (data.valueType.type === 'enum') {
      data.valueType.elements = enumData;
    }
    if(data.valueType.type === 'array' && arrayProperties.length > 0){
      data.valueType.elementType.properties = arrayProperties
    }
    props.save(data);
    message.success('保存成功');
    props.close();
  }


  const product = useContext<any>(ProductContext);

  useEffect(() => getMetadata(), []);
  const getMetadata = (id?: any, type?: any) => {

    if (id) {
      data.id = id;
    }
    if (type) {
      data.valueType.type = type;
    }

    if (data.id && data.valueType?.type) {
      setLoadConfig(true);
      apis.deviceProdcut.configMetadata({
        productId: product.id,
        modelType: 'functionParameter',
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
        return (
          <Input
            value={(data?.expands || {})[config.property]}
            onChange={e => {
              if (!data.expands) data.expands = {};
              data.expands[config.property] = e.target.value;
              setData({ ...data });
            }} />
        )
      case 'enum':
        return (
          <Select
            value={(data?.expands || {})[config.property]}
            onChange={e => {
              if (!data.expands) data.expands = {};
              data.expands[config.property] = e;
              setData({ ...data });
            }}
          >
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
                  {renderItem(config)}
                </Form.Item>
              ))}
            </Collapse.Panel>
          )
        })}</Collapse>
    )
  }
  return (
    <Drawer
      title="新增参数"
      placement="right"
      closable={false}
      onClose={() => props.close()}
      visible
      width="30%"
    >
      <Form className={styles.paramterForm}>
        <Form.Item label="参数标识">
          <Input
            disabled={!!props.data.id}
            value={data.id}
            onChange={e => {
              data.id = e.target.value;
              setData({ ...data });
            }}
            onBlur={(value) => getMetadata(value.target.value, undefined)}
          />
        </Form.Item>
        <Form.Item label="参数名称">
          <Input
            value={data.name}
            onChange={e => {
              data.name = e.target.value;
              setData({ ...data });
            }}
          />
        </Form.Item>
        <Form.Item label="数据类型">
          <Select
            placeholder="请选择"
            value={data.valueType?.type}
            onChange={(value: string) => {
              if (!data.valueType) {
                data.valueType = {};
              }
              data.valueType.type = value;
              dataTypeChange(value);
              setData({ ...data });
              getMetadata(undefined, value)
            }}
          >
            <Select.OptGroup label="基本类型">
              <Select.Option value="int">int(整数型)</Select.Option>
              <Select.Option value="long">long(长整数型)</Select.Option>
              <Select.Option value="double">double(双精度浮点数)</Select.Option>
              <Select.Option value="float">float(单精度浮点数)</Select.Option>
              <Select.Option value="string">text(字符串)</Select.Option>
              <Select.Option value="boolean">bool(布尔型)</Select.Option>
              <Select.Option value="date">date(时间型)</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="其他类型">
              <Select.Option value="enum">enum(枚举)</Select.Option>
              <Select.Option value="array">array(数组)</Select.Option>
              <Select.Option value="object">object(结构体)</Select.Option>
              <Select.Option value="geoPoint">geoPoint(地理位置)</Select.Option>
            </Select.OptGroup>
          </Select>
        </Form.Item>
        {renderDetailForm()}
        {!loadConfig && renderConfigMetadata()}
        <Form.Item label="描述">
          <Input.TextArea
            value={data.description}
            onChange={e => {
              data.description = e.target.value;
              setData({ ...data });
            }}
            rows={3}
          />
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
        <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
      {parameterVisible && (
        <Paramter
          data={currentParameter}
          unitsData={props.unitsData}
          save={item => {
            if (!data.valueType.parameters) {
              data.valueType.parameters = [];
            }
            const index = data.valueType.parameters.findIndex((e: any) => e.id === item.id);
            if (index === -1) {
              data.valueType.parameters.push(item);
            } else {
              data.valueType.parameters[index] = item;
            }
            setData({ ...data });
            // props.close();
          }}
          close={() => {
            setCurrentParameter({});
            setParameterVisible(false);
          }}
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
  );
};

export default Paramter;
