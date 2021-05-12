import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { AutoComplete, Card, Col, Icon, Input, message, Popconfirm, Radio, Row, Select, Switch } from 'antd';
import { Triggers } from '@/pages/rule-engine/scene/data';
import apis from '@/services';
import Bind from './bind';

interface Props extends FormComponentProps {
  trigger: Partial<Triggers>;
  save: Function;
  remove: Function;
  position: number;
}

const Trigger: React.FC<Props> = props => {
  const [deviceName, setDeviceName] = useState('');
  const [sceneListNoPage, setSceneListNoPage] = useState([]);
  const [shakeLimit, setShakeLimit] = useState(props.trigger.device && props.trigger.device.shakeLimit ? props.trigger.device.shakeLimit : { enabled: false });
  const [bindVisible, setBindVisible] = useState(false);
  const [deviceData, setDeviceData] = useState({});
  const [metaData, setMetaData] = useState({
    properties: [],
    events: [],
    functions: []
  });
  const [triggerType, setTriggerType] = useState(props.trigger.trigger);
  const [messageType, setMessageType] = useState(props.trigger.device ? props.trigger.device.type : '');
  const [filters, setFilters] = useState(props.trigger.device ? props.trigger.device.filters : []);
  const [dataSource, setDataSource] = useState([]);

  const [trigger, setTrigger] = useState(props.trigger);
  useEffect(() => {
    apis.scene.listNoPaging({}).then(res => {
      if (res.status === 200) {
        setSceneListNoPage(res.result);
      }
    });
    if (props.trigger.device && props.trigger.device.deviceId) {
      findDeviceById(props.trigger.device.deviceId)
    }
  }, []);

  const setDataSourceValue = (type: string, data: any, value: string) => {
    let dataSource = [];
    data.map((item: any) => {
      if (item.id === trigger.device.modelId) {
        data = item
      } else {
        data = []
      }
    });
    dataSource.push(value);
    if (type === 'function') {
      if (data.output !== undefined && data.output.type === 'object') {
        data.valueType.properties.map((p: any) => {
          dataSource.push(`${value}.${p.id}`);
        });
      }
    } else if (type === 'event') {
      dataSource.push('this');
      if (data.valueType !== undefined && data.valueType.type === 'object') {
        data.valueType.properties.map((p: any) => {
          dataSource.push(`${p.id}`);
        });
      }
    } else if (type === 'properties') {
      if (data.valueType !== undefined && data.valueType.type === 'object') {
        data.valueType.properties.map((p: any) => {
          dataSource.push(`${value}.${p.id}`);
        });
      }
    }
    setDataSource(dataSource);
  };

  const findDeviceById = (deviceId: string) => {
    apis.deviceInstance.info(deviceId)
      .then((response: any) => {
        if (response.status === 200) {
          setDeviceData(response.result);
          trigger.device.productId = response.result.productId;
          trigger.device.deviceId = response.result.id;
          setMetaData(JSON.parse(response.result.metadata));
          setDeviceName(response.result.name)
        }
      }).catch(() => {
      });
  };

  const submitData = () => {
    if(trigger.device.type === 'online' || trigger.device.type === 'offline'){
      trigger.device.filters = []
    }
    props.save({
      ...trigger,
    });
  };

  const renderType = () => {
    switch (messageType) {
      case 'properties':
        return (
          <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型属性" defaultValue={props.trigger.device?.modelId}
              onChange={(value: string) => {
                setDataSourceValue('properties', metaData.properties, value);
                trigger.device.modelId = value;
                setTrigger(trigger);
                submitData();
              }}
            >
              {metaData.properties?.map((item: any) => (
                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
              ))}
            </Select>
          </Col>
        );
      case 'event':
        return (
          <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型事件" defaultValue={props.trigger.device?.modelId}
              onChange={(value: string) => {
                setDataSourceValue('events', metaData.events, value);
                trigger.device.modelId = value;
                setTrigger(trigger);
                submitData();
              }}
            >
              {metaData.events?.map((item: any) => (
                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
              ))}
            </Select>
          </Col>
        );
      case 'function':
        return (
          <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
            <Select placeholder="物模型功能" defaultValue={props.trigger.device?.modelId}
              onChange={(value: string) => {
                setDataSourceValue('function', metaData.functions, value);
                trigger.device.modelId = value;
                setTrigger(trigger);
                submitData();
              }}
            >
              {metaData.functions?.map((item: any) => (
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
          <div>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Input addonAfter={<Icon onClick={() => {
                  setBindVisible(true);
                }} type='gold' title="点击选择设备" />}
                  defaultValue={deviceName}
                  placeholder="点击选择设备"
                  readOnly={true}
                  value={deviceData?.name}
                />
              </Col>
            </Col>
            <Col span={24}>
              <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                <Select placeholder="选择消息类型" defaultValue={props.trigger.device?.type}
                  onChange={(value: string) => {
                    setMessageType(() => value);
                    trigger.device.type = value;
                    setTrigger(trigger);
                    submitData();
                  }}>
                  <Select.Option value="online">上线</Select.Option>
                  <Select.Option value="offline">离线</Select.Option>
                  <Select.Option value="properties">属性</Select.Option>
                  <Select.Option value="event">事件</Select.Option>
                  <Select.Option value="function">功能</Select.Option>
                </Select>
              </Col>
              {renderType()}
            </Col>
            { (messageType === 'properties' || messageType === 'event' || messageType === 'function') &&
              <>
                <Col span={24}>
                  {filters.map((item: any, index: number) => (
                    <div className="ant-row" key={index}>
                      <Col span={6} style={{ paddingLeft: -1, paddingRight: 12, paddingBottom: 10 }}>
                        <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" children={item.key}
                          defaultValue={item.key}
                          onBlur={value => {
                            filters[index].key = value;
                            trigger.device.filters = filters;
                            setTrigger(trigger);
                          }}
                          filterOption={(inputValue, option) =>
                            option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Col>
                      <Col span={6} style={{ paddingLeft: 3, paddingRight: 9, paddingBottom: 10 }}>
                        <Select placeholder="操作符" defaultValue={item.operator}
                          onChange={(value: string) => {
                            filters[index].operator = value;
                            trigger.device.filters = filters;
                            setTrigger(trigger);
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
                            trigger.device.filters = filters;
                            setTrigger(trigger);
                          }}
                        />
                      </Col>
                      <Col span={5} style={{ textAlign: 'right', marginTop: 6, paddingBottom: 10 }}>
                        <a style={{ paddingLeft: 10, paddingTop: 7 }}
                          onClick={() => {
                            filters.splice(index, 1);
                            setFilters([...filters]);
                            trigger.device.filters = filters;
                            setTrigger({ ...trigger });
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
              </>
            }
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
                }}
              />
            </Col>
          </div>
        );
      case 'scene':
        return (
          <div>
            <Col span={6} style={{ paddingBottom: 10 }}>
              <Select placeholder="请选择场景" mode="multiple" defaultValue={trigger.scene?.sceneIds}
                onChange={(value: string) => {
                  trigger.scene.sceneIds = value;
                  setTrigger(trigger);
                }}
              >
                {
                  sceneListNoPage.map((item, index) => {
                    return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                  })
                }
              </Select>
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingBottom: 5 }} key={props.position}>
      <Card size="small" bordered={false} style={{ backgroundColor: '#F5F5F6' }}>
        <Row style={{ marginLeft: -2 }}>
          <span>触发器: {props.position + 1}</span>
          <Popconfirm title="确认删除此触发器？"
            onConfirm={() => props.remove(props.position)}
          >
            <a style={{ paddingLeft: 30 }}>删除</a>
          </Popconfirm>
        </Row>

        <Row gutter={16} style={{ paddingLeft: 10 }}>
          <Col span={24} style={{ paddingBottom: 10 }}>
            <div style={{ display: 'flex' }}>
              <Col span={6}>
                <Select placeholder="选择触发器类型" value={trigger.trigger}
                  onChange={(value: string) => {
                    setTriggerType(() => value);
                    trigger.trigger = value;
                    if (value === 'scene' && trigger.scene === undefined) {
                      trigger.scene = {};
                      trigger.scene.sceneIds = []
                    }
                    setTrigger(trigger);
                  }}
                >
                  <Select.Option value="manual">手动触发</Select.Option>
                  <Select.Option value="timer">定时触发</Select.Option>
                  <Select.Option value="device">设备触发</Select.Option>
                  <Select.Option value="scene">场景触发</Select.Option>
                </Select>
              </Col>
              {
                triggerType === 'device' && (
                  <Switch key='shakeLimit.enabled' checkedChildren="开启防抖" unCheckedChildren="关闭防抖"
                    defaultChecked={shakeLimit.enabled ? shakeLimit.enabled : false}
                    style={{ marginLeft: 20, width: '100px' }}
                    onChange={(value: boolean) => {
                      shakeLimit.enabled = value;
                      setShakeLimit({ ...shakeLimit });
                      trigger.device.shakeLimit.enabled = value;
                      setTrigger(trigger);
                    }}
                  />
                )
              }
              {shakeLimit.enabled && triggerType == 'device' && (
                <Col span={12}>
                  <Col span={24} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                    <Input style={{ width: 80, marginLeft: 3 }} size='small' key='shakeLimit.time'
                      defaultValue={shakeLimit.time}
                      onBlur={event => {
                        trigger.device.shakeLimit.time = event.target.value;
                        setTrigger(trigger)
                      }}
                    />秒内发生
                    <Input style={{ width: 80 }} size='small' key='shakeLimit.threshold'
                      defaultValue={shakeLimit.threshold}
                      onBlur={event => {
                        trigger.device.shakeLimit.threshold = event.target.value;
                        setTrigger(trigger)
                      }}
                    />次及以上时，处理
                    <Radio.Group defaultValue={shakeLimit.alarmFirst} key='shakeLimit.alarmFirst' size='small'
                      buttonStyle="solid"
                      onChange={event => {
                        trigger.device.shakeLimit.alarmFirst = Boolean(event.target.value);
                        setTrigger(trigger)
                      }}
                    >
                      <Radio.Button value={true}>第一次</Radio.Button>
                      <Radio.Button value={false}>最后一次</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Col>
              )}
            </div>
          </Col>
          <Col span={24}>
            {renderDataType()}
          </Col>
        </Row>
      </Card>
      {bindVisible && (
        <Bind selectionType='radio'
          close={() => {
            setBindVisible(false);
          }}
          save={(item: any) => {
            if (item[0]) {
              setBindVisible(false);
              findDeviceById(item[0]);
            } else {
              message.error('请勾选设备');
              return;
            }
          }}
        />
      )}
    </div>
  );
};

export default Form.create<Props>()(Trigger);
