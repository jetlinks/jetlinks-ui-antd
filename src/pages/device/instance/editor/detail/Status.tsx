import React, {useEffect, useState} from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import {Badge, Col, Icon, message, Row, Spin, Tooltip} from 'antd';
import {MiniArea} from '@/pages/analysis/components/Charts';
import moment from 'moment';
import apis from '@/services';
import EventLog from './event-log/EventLog';
import encodeQueryParam from '@/utils/encodeParam';
import PropertiesInfo from './properties-data/propertiesInfo';
import {getWebsocket} from '@/layouts/GlobalWebSocket';
import AutoHide from '@/pages/device/location/info/autoHide';
import UpdateProperty from "@/pages/device/instance/editor/detail/updateProperty";

interface Props {
  refresh: Function;
  device: any
}

interface State {
  runInfo: any;
  eventVisible: boolean;
  propertiesVisible: boolean;
  propertiesInfo: any;
  metadata: any;
  deviceState: any;
  updatePropertiesData: any;
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: 24},
};

const eventLevel = new Map();
eventLevel.set('ordinary', <Badge status="processing" text="普通"/>);
eventLevel.set('warn', <Badge status="warning" text="警告"/>);
eventLevel.set('urgent', <Badge status="error" text="紧急"/>);

const Status: React.FC<Props> = props => {

  const initState: State = {
    runInfo: {},
    eventVisible: false,
    propertiesVisible: false,
    propertiesInfo: {},
    metadata: {},
    deviceState: {},
    updatePropertiesData: {},
  };
  const [runInfo, setRunInfo] = useState(initState.runInfo);
  const [eventVisible, setEventVisible] = useState(initState.eventVisible);
  const [metadata, setMetadata] = useState(initState.metadata);
  const [deviceState, setDeviceState] = useState(initState.deviceState);
  const [propertiesVisible, setPropertiesVisible] = useState(initState.propertiesVisible);
  const [propertiesInfo, setPropertiesInfo] = useState(initState.propertiesInfo);
  const [eventInfo, setEventInfo] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [spinning, setSpinning] = useState(true);
  const [eventDataCount, setEventDataCount] = useState({});
  const [updateProperties, setUpdateProperties] = useState(false);
  const [updatePropertiesData, setUpdatePropertiesData] = useState(initState.updatePropertiesData);

  useEffect(() => {
    let statusRealTime: any;
    let propertySubs: any;
    let eventSubs: any;

    runInfo.loading = true;
    props.device.loading = false;
    setRunInfo(props.device);
    setDeviceState(props.device);

    const metadata = JSON.parse(props.device.metadata);
    const {properties} = metadata;
    // 设置properties的值
    if (properties) {
      properties.map((item: any) => {
        propertyData[item.id] = {
          formatValue: '/',
          visitData: [],
          type: item.valueType.type,
        };
      });
      const list = [{
        'dashboard': 'device',
        'object': props.device.productId,
        'measurement': 'properties',
        'dimension': 'history',
        'params': {
          'deviceId': props.device.id,
          'history': 15,
        },
      }];

      apis.deviceInstance.propertiesRealTime(list)
        .then(response => {
          setSpinning(false);
          if (response.status === 200) {
            const tempResult = response?.result;
            tempResult.forEach((item: any) => {

              if (item.data.value?.formatValue && typeof item.data.value?.formatValue === 'object') {
                propertyData[item.data.value.property].formatValue = item.data.value?.formatValue ? JSON.stringify(item.data.value.formatValue) : '/';
              } else if (propertyData[item.data.value.property].type === 'int' || propertyData[item.data.value.property].type === 'float'
                || propertyData[item.data.value.property].type === 'double' || propertyData[item.data.value.property].type === 'long') {
                propertyData[item.data.value.property].formatValue = item.data.value?.formatValue ? item.data.value.formatValue : '/';
                propertyData[item.data.value.property].value = item.data.value?.value ? item.data.value.value : 0;
              } else if (item.data.value?.formatValue) {
                propertyData[item.data.value.property].formatValue = item.data.value?.formatValue ? item.data.value.formatValue : '/';
              } else {
                propertyData[item.data.value.property].formatValue = '/';
              }

              if (propertyData[item.data.value.property].type === 'int' || propertyData[item.data.value.property].type === 'float'
                || propertyData[item.data.value.property].type === 'double' || propertyData[item.data.value.property].type === 'long') {

                if (propertyData[item.data.value.property].visitData.length >= 15) {
                  propertyData[item.data.value.property].visitData.splice(0, 1);
                }
                propertyData[item.data.value.property].visitData.push({
                  'x': item.data.timeString,
                  'y': Math.floor(Number(item.data.value.value) * 100) / 100,
                });
              }
            });
            setPropertyData({...propertyData});
          }
        }).catch();

      statusRealTime && statusRealTime.unsubscribe();
      statusRealTime = getWebsocket(
        `instance-info-status-${props.device.id}`,
        `/dashboard/device/status/change/realTime`,
        {
          deviceId: props.device.id,
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;
          setDeviceState({
            state: payload.value.type === 'online' ? {value: 'online', text: '在线'} : {
              value: 'offline',
              text: '离线'
            },
          });
          if (payload.value.type === 'online') {
            runInfo.onlineTime = payload.timestamp;
            runInfo.loading = false;
            setRunInfo({...runInfo});
          } else {
            runInfo.offlineTime = payload.timestamp;
            runInfo.loading = false;
            setRunInfo({...runInfo});
          }
        },
      );

      propertySubs && propertySubs.unsubscribe();
      propertySubs = getWebsocket(
        `instance-info-property-${props.device.id}-${props.device.productId}`,
        `/dashboard/device/${props.device.productId}/properties/realTime`,
        {
          deviceId: props.device.id,
          history: 1,
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;
          const dataValue = payload.value;

          if (!propertyData[dataValue.property]) return;

          if (dataValue?.formatValue && typeof dataValue?.formatValue === 'object') {
            propertyData[dataValue.property].formatValue = dataValue?.formatValue ? JSON.stringify(dataValue.formatValue) : '/';
          } else if (propertyData[dataValue.property].type === 'int' || propertyData[dataValue.property].type === 'float'
            || propertyData[dataValue.property].type === 'double' || propertyData[dataValue.property].type === 'long') {
            propertyData[dataValue.property].formatValue = dataValue?.formatValue ? dataValue.formatValue : '/';
            propertyData[dataValue.property].value = dataValue?.value ? dataValue.value : 0;
          } else if (dataValue?.formatValue) {
            propertyData[dataValue.property].formatValue = dataValue?.formatValue ? dataValue.formatValue : '/';
          } else {
            propertyData[dataValue.property].formatValue = '/';
          }

          if (propertyData[dataValue.property].type === 'int' || propertyData[dataValue.property].type === 'float'
            || propertyData[dataValue.property].type === 'double' || propertyData[dataValue.property].type === 'long') {

            if (propertyData[dataValue.property].visitData.length >= 15) {
              propertyData[dataValue.property].visitData.splice(0, 1);
            }
            propertyData[dataValue.property].visitData.push({
              'x': payload.timeString,
              'y': Math.floor(Number(dataValue.value) * 100) / 100,
            });
          }
          setPropertyData({...propertyData});
        },
      );

      eventSubs && eventSubs.unsubscribe();
      eventSubs = getWebsocket(
        `instance-info-event-${props.device.id}-${props.device.productId}`,
        `/dashboard/device/${props.device.productId}/events/realTime`,
        {
          deviceId: props.device.id,
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;
          eventDataCount[payload.value.event] = (eventDataCount[payload.value.event] + 1);
          setEventDataCount({...eventDataCount});
        },
      );
    }

    return () => {
      statusRealTime && statusRealTime.unsubscribe();
      propertySubs && propertySubs.unsubscribe();
      eventSubs && eventSubs.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 组装数据
    if (runInfo && runInfo.metadata) {

      const metadata = JSON.parse(runInfo.metadata);
      const {properties, events} = metadata;
      // 设置properties的值
      if (properties) {
        metadata.properties = properties.map((item: any) => {
          item.loading = false;
          return item;
        });
      }

      // 设置event数据
      if (events) {
        events.map((event: any) => {
          // 加载数据
          event.loading = false;
          apis.deviceInstance.eventData(
            props.device.id,
            event.id,
            encodeQueryParam({
              pageIndex: 0,
              pageSize: 10,
            }),
          ).then(response => {
            if (response.status === 200) {
              const data = response.result;
              eventDataCount[event.id] = data.total;
              setEventDataCount({...eventDataCount});
            }
          }).catch(() => {

          });
        });
      }

      setMetadata({...metadata});
    }
  }, [runInfo]);

  const refreshProperties = (item: any) => {
    const {properties} = metadata;
    apis.deviceInstance.property(props.device.id, item.id)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          if (tempResult) {
            metadata.properties = properties.map((e: any) => {
              if (e.id === tempResult.property) {
                e.formatValue = tempResult.formatValue;
              }
              e.loading = false;
              return e;
            });
          } else {
            metadata.properties = properties.map((e: any) => {
              e.loading = false;
              return e;
            });
          }
          setMetadata({...metadata});
        } else {
          metadata.properties = properties.map((e: any) => {
            e.loading = false;
            return e;
          });
          setMetadata({...metadata});
        }
      });
  };

  const refreshPropertyItem = (item: any) => {
    const {properties} = metadata;
    // 先修改加载状态

    metadata.properties = properties.map((i: any) => {
      if (i.id === item.id) {
        i.loading = true;
      }
      return i;
    });
    setMetadata({...metadata});
    // 为了显示Loading效果
    refreshProperties(item);
  };

  const refreshEventItem = (item: any) => {
    const {events} = metadata;
    // 修改加载状态
    metadata.events = events.map((i: any) => {
      if (i.id === item.id) {
        i.loading = true;
      }
      return i;
    });
    setMetadata({...metadata});
    // 为了显示Loading效果
    apis.deviceInstance.eventData(
      props.device.id, item.id,
      encodeQueryParam({}),
    ).then(response => {
      // const tempEvent = response.result;
      if (response.status === 200) {
        eventDataCount[item.id] = response.result.total;
        setEventDataCount({...eventDataCount});
        // 关闭加载中状态
        const {events} = metadata;
        // 修改加载状态
        metadata.events = events.map((i: any) => {
          if (i.id === item.id) {
            i.loading = false;
          }
          return i;
        });
        setMetadata({...metadata});
      }
    }).catch(() => {
    });
  };

  const updateProperty = (item: any) => {
    apis.deviceInstance.updateProperty(props.device.id, item)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('操作成功');
          setUpdateProperties(false);
        }
      })
      .catch(() => {
      })
  };

  return (
    <div>
      <Spin tip="加载中..." spinning={spinning}>
        {
          metadata && metadata.properties ? <Row gutter={24}>
              <Col {...topColResponsiveProps}>
                <Spin spinning={runInfo.loading}>
                  <ChartCard
                    bordered={false}
                    title='设备状态'
                    action={
                      <Tooltip
                        title='刷新'
                      >
                        <Icon type="sync" onClick={() => {
                          props.refresh();
                        }}/>
                      </Tooltip>
                    }
                    contentHeight={46}
                    total={deviceState?.state?.text}
                  >
                    {deviceState?.state?.value === 'online' ? (
                      <span>上线时间：{moment(runInfo?.onlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    ) : (
                      <span>离线时间：{moment(runInfo?.offlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )}
                  </ChartCard>
                </Spin>
              </Col>

              {
                (metadata.properties).map((item: any) => {
                    if (!item) return false;
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Spin spinning={item.loading}>
                          <ChartCard
                            bordered={false}
                            title={item.name}
                            action={
                              <div>
                                {item.expands.readOnly === 'false' && (
                                  <Tooltip placement="top" title='设置属性至设备'>
                                    <Icon title='编辑' type="edit" onClick={() => {
                                      setUpdateProperties(true);
                                      if (propertyData[item.id].value) {
                                        item.formatValue = propertyData[item.id]?.value || 0;
                                      } else {
                                        item.formatValue = propertyData[item.id]?.formatValue || '/';
                                      }
                                      setUpdatePropertiesData(item);
                                    }}/>
                                  </Tooltip>
                                )}
                                <Tooltip placement="top" title='从设备端获取属性值'>
                                  <Icon title='刷新' style={{marginLeft: '10px'}} type="sync"
                                        onClick={() => {
                                          refreshPropertyItem(item);
                                        }}/>
                                </Tooltip>
                                <Icon title='详情' style={{marginLeft: '10px'}} type="bars"
                                      onClick={() => {
                                        setPropertiesVisible(true);
                                        setPropertiesInfo(item);
                                      }}/>
                              </div>
                            }
                            total={
                              <AutoHide title={...propertyData[item.id]?.formatValue || '/'} style={{width: '100%'}}/>
                            }
                            contentHeight={46}
                          >
                        <span>
                          {propertyData[item.id]?.visitData.length > 0 && (
                            <MiniArea height={40} color="#975FE4" data={...propertyData[item.id]?.visitData}/>
                          )}
                        </span>
                          </ChartCard>
                        </Spin>
                      </Col>
                    );
                  },
                )
              }
              {
                updateProperties &&
                <UpdateProperty
                  data={updatePropertiesData}
                  save={(item: any) => {
                    updateProperty(item);
                  }}
                  close={() => {
                    setUpdateProperties(false);
                    setUpdatePropertiesData({});
                  }}
                />
              }
              {
                propertiesVisible &&
                <PropertiesInfo
                  item={propertiesInfo}
                  close={() => {
                    setPropertiesVisible(false);
                  }}
                  deviceId={props.device.id}
                />
              }
              {
                (metadata.events).map((item: any) => {
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Spin spinning={item.loading}>
                          <ChartCard
                            bordered={false}
                            title={item.name}
                            action={
                              <Tooltip
                                title='刷新'
                              >
                                <Icon type="sync" onClick={() => {
                                  refreshEventItem(item);
                                }}/>
                              </Tooltip>
                            }
                            total={<AutoHide title={`${eventDataCount[item.id] || 0}次`} style={{width: '100%'}}/>}
                            contentHeight={46}
                          >
                        <span>
                          {eventLevel.get(item.expands?.level)}
                          <a
                            style={{float: 'right'}}
                            onClick={() => {
                              setEventInfo(item);
                              setEventVisible(true);
                            }}>
                            查看详情
                        </a>
                        </span>
                          </ChartCard>
                        </Spin>
                      </Col>
                    );
                  },
                )
              }
              {
                eventVisible &&
                <EventLog
                  item={eventInfo}
                  close={() => {
                    setEventVisible(false);
                  }}
                  type={props.device.productId}
                  deviceId={props.device.id}
                />
              }
            </Row>
            :
            <Col {...topColResponsiveProps}>
              <Spin spinning={runInfo.loading}>
                <ChartCard
                  bordered={false}
                  title='设备状态'
                  action={
                    <Tooltip
                      title='刷新'
                    >
                      <Icon type="sync" onClick={() => {
                        props.refresh();
                      }}/>
                    </Tooltip>
                  }
                  contentHeight={46}
                  total={runInfo.state?.text}
                >
                  <span/>
                </ChartCard>
              </Spin>
            </Col>
        }
      </Spin>
    </div>
  );
};

export default Status;
