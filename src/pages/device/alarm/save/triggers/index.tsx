import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { AutoComplete, Card, Col, Icon, Input, Popconfirm, Row, Select } from 'antd';
import { AlarmTrigger } from '@/pages/device/alarm/data';

interface Props extends FormComponentProps {
  trigger: Partial<AlarmTrigger>;
  save: Function;
  remove: Function;
  position: number;
  metaData: string;
}

interface State {
  triggerType: string;
  messageType: string;
  parameters: any[];
  trigger: any;
  filters: any[];
  dataSource: any[];
}

const Trigger: React.FC<Props> = props => {
  const initState: State = {
    triggerType: '',
    messageType: '',
    parameters: props.trigger.parameters ? (props.trigger.parameters.length > 0 ? props.trigger.parameters
      : [{ _id: 0 }]) : [{ _id: 0 }],
    trigger: props.trigger,
    filters: props.trigger.filters ? (props.trigger.filters.length > 0 ? props.trigger.filters : [{ _id: 0 }]) : [{ _id: 0 }],
    dataSource: [],
  };

  const [triggerType, setTriggerType] = useState(initState.triggerType);
  const [messageType, setMessageType] = useState(initState.messageType);
  const [parameters, serParameters] = useState(initState.parameters);
  const [filters, setFilters] = useState(initState.filters);
  const [dataSource, setDataSource] = useState(initState.dataSource);
  const [trigger, setTrigger] = useState(initState.trigger);

  useEffect(() => {
    setTriggerType(trigger.trigger);
    setMessageType(trigger.type);
  }, []);

  const submitData = () => {
    props.save({
      ...trigger,
    });
  };

  const setDataSourceValue = (type: string, parameter: any, value: string) => {
    dataSource.length = 0;
    dataSource.push(value);
    let data = parameter.props.data;
    if (type !== 'function') {
      if (data.valueType.type === 'object') {
        data.valueType.properties.map((p: any) => {
          dataSource.push(`${value}.${p.id}`);
        });
      }
    } else {
      if (data.output.type === 'object') {
        data.valueType.properties.map((p: any) => {
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
          <Col span={6} style={{ paddingBottom: 10,paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型属性" value={trigger.modelId} key={Math.round(Math.random() * 100000)}
                    onChange={(value: string, data: any) => {
                      setDataSourceValue('properties', data, value);
                      trigger.modelId = value;
                      setTrigger({ ...trigger });
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
          <Col span={6} style={{ paddingBottom: 10,paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型事件" value={trigger.modelId} key={Math.round(Math.random() * 100000)}
                    onChange={(value: string, data: any) => {
                      setDataSourceValue('event', data, value);
                      trigger.modelId = value;
                      setTrigger({ ...trigger });
                      submitData();
                    }}
            >
              {JSON.parse(props.metaData).events?.map((item: any) => (
                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
              ))}
            </Select>
          </Col>
        );
      case 'function':
        return (
          <Col span={6} style={{ paddingBottom: 10,paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型功能" value={trigger.modelId} key={Math.round(Math.random() * 100000)}
                    onChange={(value: string, data: any) => {
                      setDataSourceValue('function', data, value);
                      trigger.modelId = value;
                      setTrigger({ ...trigger });
                      submitData();
                    }}
            >
              {JSON.parse(props.metaData).functions?.map((item: any) => (
                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
              ))}
            </Select>
          </Col>
        );
      default:
        return null;
    }
  };

  const renderDataType = () => {
    switch (triggerType) {
      case 'device':
        return (
          <div key={Math.round(Math.random() * 100000)}>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Select placeholder="选择类型，如：属性/事件" value={trigger.type} key={Math.round(Math.random() * 100000)}
                        onChange={(value: string) => {
                          setMessageType(() => value);
                          trigger.type = value;
                          setTrigger({ ...trigger });
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
                  {/*{props.metaData && JSON.parse(props.metaData).functions && (
                  <Select.Option value="function">功能</Select.Option>
                )}*/}
                </Select>
              </Col>
              {renderType()}
            </Col>
            <Col span={24}>
              {filters.map((item: any, index) => (
                <div key={Math.round(Math.random() * 100000)}>
                  <Col span={6} style={{ paddingLeft: -1, paddingRight: 12,paddingBottom:10 }}>
                    <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" children={item.key}
                                  value={item.key}
                                  onChange={value => {
                                    filters[index].key = value;
                                    //setFilters([...filters]);
                                    trigger.filters = filters;
                                    setTrigger({ ...trigger });
                                    submitData();
                                  }}
                                  filterOption={(inputValue, option) =>
                                    option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                                  }
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 3, paddingRight: 9,paddingBottom:10 }}>
                    <Select placeholder="操作符" value={item.operator} key={Math.round(Math.random() * 100000)}
                            onChange={(value: string) => {
                              filters[index].operator = value;
                              setFilters([...filters]);
                              trigger.filters = filters;
                              setTrigger({ ...trigger });
                              submitData();
                            }}>
                      <Select.Option value="eq">等于(=)</Select.Option>
                      <Select.Option value="not">不等于(!=)</Select.Option>
                      <Select.Option value="gt">大于(>)</Select.Option>
                      <Select.Option value="lt">小于(&gt;)</Select.Option>
                      <Select.Option value="gte">大于等于(>=)</Select.Option>
                      <Select.Option value="lte">小于等于(&gt;=)</Select.Option>
                      <Select.Option value="like">模糊(%)</Select.Option>
                    </Select>
                  </Col>
                  <Col span={7} style={{ paddingLeft: 7, paddingRight: 3,paddingBottom:10 }}>
                    <Input placeholder="过滤条件值" value={item.value} key={Math.round(Math.random() * 100000)}
                           onChange={event => {
                             filters[index].value = event.target.value;
                             setFilters([...filters]);
                             trigger.filters = filters;
                             setTrigger({ ...trigger });
                             submitData();
                           }}
                    />
                  </Col>
                  <Col span={5} style={{ textAlign: 'right', marginTop: 6,paddingBottom:10 }}>
                    {index === 0 ? (
                      <Row key={Math.round(Math.random() * 100000)}>
                        <a onClick={() => {
                          setFilters([...filters, { _id: Math.round(Math.random() * 100000) }]);
                        }}>添加</a>
                        <a style={{ paddingLeft: 10, paddingTop: 7 }}
                           onClick={() => {
                             filters.splice(index, 1);
                             setFilters([...filters]);
                             trigger.filters = filters;
                             setTrigger({ ...trigger });
                             submitData();
                           }}
                        >删除</a>
                      </Row>
                    ) : (
                      <a style={{ paddingLeft: 10, paddingTop: 7 }}
                         onClick={() => {
                           filters.splice(index, 1);
                           setFilters([...filters]);
                           trigger.filters = filters;
                           setTrigger({ ...trigger });
                           submitData();
                         }}
                      >删除</a>
                    )}
                  </Col>
                </div>
              ))}
            </Col>
          </div>
        );
      case 'timer':
        return (
          <div key={Math.round(Math.random() * 100000)}>
            <Col span={6} style={{ paddingBottom: 10 }}>
              <Input placeholder="cron表达式" value={trigger.cron} key="cron"
                     onChange={event => {
                       trigger.cron = event.target.value;
                       setTrigger({ ...trigger });
                       submitData();
                     }}
              />
            </Col>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Select placeholder="选择类型，如：属性/事件" value={trigger.type} key={Math.round(Math.random() * 100000)}
                        onChange={(value: string) => {
                          setMessageType(() => value);
                          trigger.type = value;
                          setTrigger({ ...trigger });
                          submitData();
                        }}>
                  {props.metaData && JSON.parse(props.metaData).properties && (
                    <Select.Option value="properties">属性</Select.Option>
                  )}
                  {props.metaData && JSON.parse(props.metaData).events && (
                    <Select.Option value="event">事件</Select.Option>
                  )}
                  {/*{props.metaData && JSON.parse(props.metaData).functions && (
                  <Select.Option value="function">功能</Select.Option>
                )}*/}
                </Select>
              </Col>
              {renderType()}
            </Col>
            {triggerType === 'timer' && messageType === 'function' && (
              <Col span={24} style={{ backgroundColor: '#F5F5F6', paddingBottom: 10 }}>
                {parameters.map((item: any, index) => (
                  <Row key={Math.round(Math.random() * 100000)} style={{ paddingBottom: 5, paddingTop: 5 }}>
                    <Col span={7}>
                      <Input placeholder="请输入属性" key={Math.round(Math.random() * 100000)} value={item.property}
                             onChange={event => {
                               parameters[index].property = event.target.value;
                               serParameters([...parameters]);
                               trigger.parameters = parameters;
                               setTrigger({ ...trigger });
                               submitData();
                             }}
                      />
                    </Col>
                    <Col span={1} style={{ textAlign: 'center' }}/>
                    <Col span={7}>
                      <Input placeholder="请输入别名" value={item.alias} key={Math.round(Math.random() * 100000)}
                             onChange={event => {
                               parameters[index].alias = event.target.value;
                               serParameters([...parameters]);
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
                                  serParameters([...parameters, { _id: Math.round(Math.random() * 100000) }]);
                                }}
                          />
                          <Icon style={{ paddingLeft: 10, paddingTop: 7, fontSize: 20 }}
                                type="minus-circle" title="删除转换"
                                onClick={() => {
                                  parameters.splice(index, 1);
                                  serParameters([...parameters]);
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
                                serParameters([...parameters]);
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
            )}
            <Col span={24}>
              {filters.map((item: any, index) => (
                <div key={Math.round(Math.random() * 100000)}>
                  <Col span={6} style={{ paddingLeft: -1, paddingRight: 12,paddingBottom:10 }}>
                    <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" key="key" children={item.key}
                                  value={item.key}
                                  onChange={value => {
                                    filters[index].key = value;
                                    setFilters([...filters]);
                                    trigger.filters = filters;
                                    setTrigger({ ...trigger });
                                    submitData();
                                  }}
                                  filterOption={(inputValue, option) =>
                                    option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                                  }
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 3, paddingRight: 9,paddingBottom:10 }}>
                    <Select placeholder="操作符" value={item.operator} key={Math.round(Math.random() * 100000)}
                            onChange={(value: string) => {
                              filters[index].operator = value;
                              setFilters([...filters]);
                              trigger.filters = filters;
                              setTrigger({ ...trigger });
                              submitData();
                            }}>
                      <Select.Option value="eq">等于(=)</Select.Option>
                      <Select.Option value="not">不等于(!=)</Select.Option>
                      <Select.Option value="gt">大于(>)</Select.Option>
                      <Select.Option value="lt">小于(&gt;)</Select.Option>
                      <Select.Option value="gte">大于等于(>=)</Select.Option>
                      <Select.Option value="lte">小于等于(&gt;=)</Select.Option>
                      <Select.Option value="like">模糊(%)</Select.Option>
                    </Select>
                  </Col>
                  <Col span={7} style={{ paddingLeft: 7, paddingRight: 3,paddingBottom:10 }}>
                    <Input placeholder="过滤条件值" value={item.value} key={Math.round(Math.random() * 100000)}
                           onChange={event => {
                             filters[index].value = event.target.value;
                             setFilters([...filters]);
                             trigger.filters = filters;
                             setTrigger({ ...trigger });
                             submitData();
                           }}
                    />
                  </Col>
                  <Col span={5} style={{ textAlign: 'right', marginTop: 6,paddingBottom:10 }}>
                    {index === 0 ? (
                      <Row key={Math.round(Math.random() * 100000)}>
                        <a onClick={() => {
                          setFilters([...filters, { _id: Math.round(Math.random() * 100000) }]);
                        }}>添加</a>
                        <a style={{ paddingLeft: 10, paddingTop: 7 }}
                           onClick={() => {
                             filters.splice(index, 1);
                             setFilters([...filters]);
                             trigger.filters = filters;
                             setTrigger({ ...trigger });
                             submitData();
                           }}
                        >删除</a>
                      </Row>
                    ) : (
                      <a style={{ paddingLeft: 10, paddingTop: 7 }}
                         onClick={() => {
                           filters.splice(index, 1);
                           setFilters([...filters]);
                           trigger.filters = filters;
                           setTrigger({ ...trigger });
                           submitData();
                         }}
                      >删除</a>
                    )}
                  </Col>
                </div>
              ))}
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingBottom: 5 }} key={Math.round(Math.random() * 100000)}>
      <Card size="small" bordered={false} style={{ backgroundColor: '#F5F5F6' }}>
        <Row style={{marginLeft:-2}} key={Math.round(Math.random() * 100000)}>
          <span>触发器: {props.position + 1}</span>
          <Popconfirm title="确认删除此触发器？"
                      onConfirm={() => props.remove(props.position)}
          >
            <a style={{ paddingLeft: 30 }}>删除</a>
          </Popconfirm>
        </Row>

        <Row gutter={16} key={Math.round(Math.random() * 100000)} style={{paddingLeft:10}}>
          <Col span={6} style={{paddingBottom:10}}>
            <Select placeholder="选择触发器类型" value={trigger.trigger} key={Math.round(Math.random() * 100000)}
                    onChange={(value: string) => {
                      setTriggerType(() => value);
                      trigger.trigger = value;
                      setTrigger({ ...trigger });
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
