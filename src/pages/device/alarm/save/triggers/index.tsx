import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { AutoComplete, Card, Col, Icon, Input, Popconfirm, Row, Select } from 'antd';
import { AlarmTrigger } from '@/pages/device/alarm/data';

interface Props extends FormComponentProps {
  trigger: Partial<AlarmTrigger>;
  save: Function;
  remove: Function;
  position: number;
  metaData?: string;
}

interface State {
  triggerType: string;
  messageType: string;
  parameters: any[];
  trigger: any;
  filters: any[];
  dataSource: any[];
  functionData: any;
}

const Trigger: React.FC<Props> = props => {
  const initState: State = {
    triggerType: '',
    messageType: '',
    functionData: {},
    parameters: props.trigger.parameters ? (props.trigger.parameters.length > 0 ? props.trigger.parameters
      : []) : [],
    trigger: props.trigger,
    filters: props.trigger.filters ? (props.trigger.filters.length > 0 ? props.trigger.filters : [{ _id: 0 }]) : [{ _id: 0 }],
    dataSource: [],
  };

  const [functionData, setFunctionData] = useState(initState.functionData);
  const [triggerType, setTriggerType] = useState(initState.triggerType);
  const [messageType, setMessageType] = useState(initState.messageType);
  const [parameters, setParameters] = useState(initState.parameters);
  const [filters, setFilters] = useState(initState.filters);
  const [dataSource, setDataSource] = useState(initState.dataSource);
  const [trigger, setTrigger] = useState(initState.trigger);

  useEffect(() => {
    setTriggerType(trigger.trigger);
    setMessageType(trigger.type);
    let data: any;
    if (props.metaData) {
      let metadata = JSON.parse(props.metaData);
      if (trigger.type === 'event') {
        data = metadata['events'];
      } else if (trigger.type === 'function') {
        data = metadata['functions'];
        metadata['functions'].map((item: any) => {
          if (trigger.modelId === item.id) {
            setFunctionData(item);
          }
        })
      } else {
        data = metadata[trigger.type];
      }
      if (data) {
        dataSource.length = 0;
        dataSource.push(trigger.modelId);
        data.map((item: any) => {
          if (item.id === trigger.modelId) {
            setDataSourceValue(trigger.type, item, trigger.modelId);
          } else {
            setDataSource([]);
          }
        });
      }
    }
  }, []);

  const submitData = () => {
    props.save({
      ...trigger,
    });
  };

  const renderFunctionOnType = (item: any, index: number) => {
    if (item.valueType.type === 'enum') {
      return (<Col span={6} style={{ paddingBottom: 10 }}>
        <Select placeholder="选择调用参数"
          defaultValue={parameters[index]?.value || undefined}
          onChange={(value: string) => {
            parameters.splice(index, 1, { name: item.id, value: value });
            setParameters([...parameters]);
            trigger.parameters = parameters;
            setTrigger({ ...trigger });
            submitData();
          }}
        >
          {item.valueType.elements?.map((item: any) => (
            <Select.Option key={item.value}>{`${item.text}（${item.value}）`}</Select.Option>
          ))}
        </Select>
      </Col>);
    } else if (item.valueType.type === 'boolean') {
      return (<Col span={6} style={{ paddingBottom: 10 }}>
        <Select placeholder="选择调用参数"
          defaultValue={parameters[index]?.value || undefined}
          onChange={(value: string) => {
            parameters.splice(index, 1, { name: item.id, value: value });
            setParameters([...parameters]);
            trigger.parameters = parameters;
            setTrigger({ ...trigger });
            submitData();
          }}
        >
          <Select.Option key={item.valueType.trueValue}>
            {`${item.valueType.trueText}（${item.valueType.trueValue}）`}
          </Select.Option>
          <Select.Option key={item.valueType.falseValue}>
            {`${item.valueType.falseText}（${item.valueType.falseValue}）`}
          </Select.Option>
        </Select>
      </Col>);
    } else {
      return (
        <Col span={6} style={{ paddingBottom: 10 }}>
          <Input key='value' placeholder='填写调用参数'
            defaultValue={parameters[index]?.value || undefined}
            onChange={(event: any) => {
              parameters.splice(index, 1, { name: item.id, value: event.target.value });
              setParameters([...parameters]);
              trigger.parameters = parameters;
              setTrigger({ ...trigger });
              submitData();
            }} />
        </Col>
      );
    }
  };

  const setDataSourceValue = (type: string, data: any, value: string) => {
    dataSource.length = 0;
    dataSource.push(value);
    if (type === 'function') {
      if (data.output?.type === 'object') {
        data.valueType?.properties.map((p: any) => {
          dataSource.push(`${value}.${p.id}`);
        });
      }
    } else if (type === 'event') {
      dataSource.push('this');
      if (data.valueType?.type === 'object') {
        data.valueType?.properties.map((p: any) => {
          dataSource.push(`${p.id}`);
        });
      }
    } else if (type === 'properties') {
      if (data.valueType?.type === 'object') {
        data.valueType?.properties.map((p: any) => {
          dataSource.push(`${value}.${p.id}`);
        });
      }
    }
    setDataSource([...dataSource]);
  };

  const renderType = () => {
    switch (messageType) {
      case 'properties':
        return (
          <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型属性" defaultValue={trigger.modelId}
              onChange={(value: string, data: any) => {
                setDataSourceValue('properties', data.props.data, value);
                trigger.modelId = value;
                setTrigger(trigger);
                submitData();
              }}
            >
              {JSON.parse(props.metaData).properties?.map((item: any) => (
                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
              ))}
            </Select>
          </Col>
        );
      case 'event':
        return (
          <>
            <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
              <Select placeholder="物模型事件" defaultValue={trigger.modelId}
                onChange={(value: string, data: any) => {
                  setDataSourceValue('event', data.props.data, value);
                  trigger.modelId = value;
                  setTrigger(trigger);
                  submitData();
                }}
              >
                {JSON.parse(props.metaData).events?.map((item: any) => (
                  <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
                ))}
              </Select>
            </Col>
          </>
        );
      case 'function':
        return (
          <>
            <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
              <Select placeholder="物模型功能" defaultValue={trigger.modelId}
                onChange={(value: string, data: any) => {
                  setFunctionData(data.props.data)
                  setDataSourceValue('function', data.props.data, value);
                  trigger.modelId = value;
                  setTrigger(trigger);
                  submitData();
                }}
              >
                {JSON.parse(props.metaData).functions?.map((item: any) => (
                  <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
                ))}
              </Select>
            </Col>
            {functionData.id && functionData.inputs.map((item: any, index: number) => {
              return (
                <Col span={24} style={{ marginLeft: -8 }}>
                  <div key={`functions${item.id}_${index}`}>
                    <Col span={4}>
                      <Input value={`${item.name}(${item.id})`} readOnly={true} />
                    </Col>
                    {renderFunctionOnType(item, index)}
                  </div>
                </Col>
              );
            })}
          </>
        );
      default:
        return null;
    }
  };

  const renderDataType = () => {
    switch (triggerType) {
      case 'device':
        return (
          <div>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Select placeholder="选择类型，如：属性/事件" defaultValue={trigger.type}
                  onChange={(value: string) => {
                    setMessageType(() => value);
                    trigger.type = value;
                    setTrigger(trigger);
                    submitData();
                  }}>
                  <Select.Option value="online">上线</Select.Option>
                  <Select.Option value="offline">离线</Select.Option>
                  {props.metaData && JSON.parse(props.metaData).properties && (
                    <Select.Option value="properties">属性</Select.Option>
                  )}
                  {props.metaData && JSON.parse(props.metaData).events && (
                    <Select.Option value="event">事件</Select.Option>
                  )}
                  {/* {props.metaData && JSON.parse(props.metaData).functions && (
                  <Select.Option value="function">功能</Select.Option>
                )} */}
                </Select>
              </Col>
              {renderType()}
            </Col>
            <Col span={24}>
              {filters.map((item: any, index) => (
                <div className="ant-row">
                  <Col span={6} style={{ paddingLeft: -1, paddingRight: 12, paddingBottom: 10 }}>
                    <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" children={item.key}
                      defaultValue={item.key}
                      onBlur={value => {
                        filters[index].key = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}
                      /*onChange={value => {
                        filters[index].key = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}*/
                      filterOption={(inputValue, option) =>
                        option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 3, paddingRight: 9, paddingBottom: 10 }}>
                    <Select placeholder="操作符" defaultValue={item.operator}
                      onChange={(value: string) => {
                        filters[index].operator = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}>
                      <Select.Option value="eq">等于(=)</Select.Option>
                      <Select.Option value="not">不等于(!=)</Select.Option>
                      <Select.Option value="gt">大于(&gt;)</Select.Option>
                      <Select.Option value="lt">小于(&lt;)</Select.Option>
                      <Select.Option value="gte">大于等于(&gt;=)</Select.Option>
                      <Select.Option value="lte">小于等于(&lt;=)</Select.Option>
                      <Select.Option value="like">模糊(%)</Select.Option>
                    </Select>
                  </Col>
                  <Col span={7} style={{ paddingLeft: 7, paddingRight: 3, paddingBottom: 10 }}>
                    <Input placeholder="过滤条件值" defaultValue={item.value}
                      onChange={event => {
                        filters[index].value = event.target.value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}
                    />
                  </Col>
                  <Col span={5} style={{ textAlign: 'right', marginTop: 6, paddingBottom: 10 }}>
                    <a style={{ paddingLeft: 10, paddingTop: 7 }}
                      onClick={() => {
                        filters.splice(index, 1);
                        setFilters([...filters]);
                        trigger.filters = filters;
                        setTrigger({ ...trigger });
                        submitData();
                      }}
                    >删除</a>
                  </Col>
                </div>
              ))}
            </Col>
            <Col span={24}>
              <div>
                <a onClick={() => {
                  setFilters([...filters, { _id: Math.round(Math.random() * 100000) }]);
                }}>添加</a>
              </div>
            </Col>
          </div>
        );
      case 'timer':
        return (
          <div>
            <Col span={6} style={{ paddingBottom: 10 }}>
              <Input placeholder="cron表达式" defaultValue={trigger.cron} key="cron"
                onBlur={event => {
                  trigger.cron = event.target.value;
                  setTrigger(trigger);
                  submitData();
                }}
              /*onChange={event => {
                trigger.cron = event.target.value;
                setTrigger(trigger);
                submitData();
              }}*/
              />
            </Col>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Select placeholder="选择类型，如：属性/事件" defaultValue={trigger.type}
                  onChange={(value: string) => {
                    setMessageType(() => value);
                    trigger.type = value;
                    setTrigger(trigger);
                    submitData();
                  }}>
                  {props.metaData && JSON.parse(props.metaData).properties && (
                    <Select.Option value="properties">属性</Select.Option>
                  )}
                  {/* {props.metaData && JSON.parse(props.metaData).events && (
                    <Select.Option value="event">事件</Select.Option>
                  )} */}
                  {props.metaData && JSON.parse(props.metaData).functions && (
                    <Select.Option value="function">功能</Select.Option>
                  )}
                </Select>
              </Col>
              {renderType()}
            </Col>
            {/* {triggerType === 'timer' && messageType === 'function' && (
              <Col span={24} style={{ backgroundColor: '#F5F5F6', paddingBottom: 10 }}>
                {parameters.map((item: any, index) => (
                  <Row style={{ paddingBottom: 5, paddingTop: 5 }}>
                    <Col span={7}>
                      <Input placeholder="请输入属性" value={item.property}
                        onChange={event => {
                          parameters[index].property = event.target.value;
                          setParameters([...parameters]);
                          trigger.parameters = parameters;
                          setTrigger({ ...trigger });
                          submitData();
                        }}
                      />
                    </Col>
                    <Col span={1} style={{ textAlign: 'center' }} />
                    <Col span={7}>
                      <Input placeholder="请输入别名" value={item.alias}
                        onChange={event => {
                          parameters[index].alias = event.target.value;
                          setParameters([...parameters]);
                          trigger.parameters = parameters;
                          setTrigger({ ...trigger });
                          submitData();
                        }}
                      />
                    </Col>
                    <Col span={1} style={{ textAlign: 'center' }}>
                      {index === 0 ? (
                        <Row>
                          <Icon type="plus-circle" title="新增转换"
                            style={{ fontSize: 20, paddingTop: 7 }}
                            onClick={() => {
                              setParameters([...parameters, { _id: Math.round(Math.random() * 100000) }]);
                            }}
                          />
                          <Icon style={{ paddingLeft: 10, paddingTop: 7, fontSize: 20 }}
                            type="minus-circle" title="删除转换"
                            onClick={() => {
                              parameters.splice(index, 1);
                              setParameters([...parameters]);
                              trigger.parameters = parameters;
                              setTrigger({ ...trigger });
                              submitData();
                            }}
                          />
                        </Row>
                      ) : (
                        <Icon type="minus-circle" title="删除转换"
                          style={{ fontSize: 20, paddingTop: 7 }}
                          onClick={() => {
                            parameters.splice(index, 1);
                            setParameters([...parameters]);
                            trigger.parameters = parameters;
                            setTrigger({ ...trigger });
                            submitData();
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                ))}
              </Col>
            )} */}
            <Col span={24}>
              {filters.map((item: any, index) => (
                <div className="ant-row">
                  <Col span={6} style={{ paddingLeft: -1, paddingRight: 12, paddingBottom: 10 }}>
                    <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" children={item.key}
                      defaultValue={item.key}
                      onBlur={value => {
                        filters[index].key = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}
                      /*onChange={value => {
                        filters[index].key = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}*/
                      filterOption={(inputValue, option) =>
                        option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 3, paddingRight: 9, paddingBottom: 10 }}>
                    <Select placeholder="操作符" defaultValue={item.operator}
                      onChange={(value: string) => {
                        filters[index].operator = value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}>
                      <Select.Option value="eq">等于(=)</Select.Option>
                      <Select.Option value="not">不等于(!=)</Select.Option>
                      <Select.Option value="gt">大于(&gt;)</Select.Option>
                      <Select.Option value="lt">小于(&lt;)</Select.Option>
                      <Select.Option value="gte">大于等于(&gt;=)</Select.Option>
                      <Select.Option value="lte">小于等于(&lt;=)</Select.Option>
                      <Select.Option value="like">模糊(%)</Select.Option>
                    </Select>
                  </Col>
                  <Col span={7} style={{ paddingLeft: 7, paddingRight: 3, paddingBottom: 10 }}>
                    <Input placeholder="过滤条件值" defaultValue={item.value}
                      onBlur={event => {
                        filters[index].value = event.target.value;
                        trigger.filters = filters;
                        setTrigger(trigger);
                        submitData();
                      }}
                    /*onChange={event => {
                      filters[index].value = event.target.value;
                      trigger.filters = filters;
                      setTrigger(trigger);
                      submitData();
                    }}*/
                    />
                  </Col>
                  <Col span={5} style={{ textAlign: 'right', marginTop: 6, paddingBottom: 10 }}>
                    <a style={{ paddingLeft: 10, paddingTop: 7 }}
                      onClick={() => {
                        filters.splice(index, 1);
                        setFilters([...filters]);
                        if (filters.length > 0) {
                          trigger.filters = filters;
                          setTrigger({ ...trigger });
                        }
                        submitData();
                      }}
                    >删除</a>
                  </Col>
                </div>
              ))}
            </Col>
            <Col span={24}>
              <div>
                <a onClick={() => {
                  setFilters([...filters, { _id: Math.round(Math.random() * 100000) }]);
                }}>添加</a>
              </div>
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingBottom: 5 }}>
      <Card size="small" bordered={false} style={{ backgroundColor: '#F5F5F6' }}>
        <Row style={{ marginLeft: -2 }}>
          <span>触发器: {props.position + 1}</span>
          <Popconfirm
            title="确认删除此触发器？"
            onConfirm={() => {
              props.remove(props.position);
            }}
          >
            <a style={{ paddingLeft: 30 }}>删除</a>
          </Popconfirm>
        </Row>

        <Row gutter={16} style={{ paddingLeft: 10 }}>
          <Col span={6} style={{ paddingBottom: 10 }}>
            <Select
              placeholder="选择触发器类型"
              value={trigger.trigger}
              onChange={(value: string) => {
                setTriggerType(() => value);
                setTrigger({
                  trigger :value
                });
                setFilters([{}])
                submitData();
              }}
            >
              <Select.Option value="device">设备触发</Select.Option>
              <Select.Option value="timer">定时触发</Select.Option>
            </Select>
          </Col>
          {renderDataType()}
        </Row>
      </Card>
    </div>
  );
};

export default Form.create<Props>()(Trigger);
