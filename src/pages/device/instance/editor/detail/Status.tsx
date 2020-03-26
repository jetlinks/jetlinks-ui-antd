import React, { useEffect, useState } from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import { Badge, Col, Icon, Row, Spin, Tooltip } from 'antd';
import { MiniArea } from '@/pages/analysis/components/Charts';
import { IVisitData } from '@/pages/analysis/data';
import { EventSourcePolyfill } from 'event-source-polyfill';
import moment from 'moment';
import apis from '@/services';
import EventLog from './event-log/EventLog';
import encodeQueryParam from '@/utils/encodeParam';
import { getAccessToken } from '@/utils/authority';
import { wrapAPI } from '@/utils/utils';
import PropertiesInfo from './properties-data/propertiesInfo';


interface Props {
  device: any
}

interface State {
  runInfo: any;
  propertiesData: any[];
  eventVisible: boolean;
  propertiesVisible: boolean;
  propertiesInfo: any;
  metadata: any;
  eventData: any[];
  deviceState: any;
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

// mock data
const visitData: IVisitData[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const eventLevel = new Map();
eventLevel.set('ordinary', <Badge status="processing" text="普通"/>);
eventLevel.set('warn', <Badge status="warning" text="警告"/>);
eventLevel.set('urgent', <Badge status="error" text="紧急"/>);

const Status: React.FC<Props> = (props) => {

  const initState: State = {
    runInfo: {},
    propertiesData: [],
    eventVisible: false,
    propertiesVisible: false,
    propertiesInfo: {},
    metadata: {},
    eventData: [],
    deviceState: {},
  };
  const [runInfo, setRunInfo] = useState(initState.runInfo);
  const [propertiesData, setPropertiesData] = useState(initState.propertiesData);
  const [eventVisible, setEventVisible] = useState(initState.eventVisible);
  const [metadata, setMetadata] = useState(initState.metadata);
  const [eventData, setEventData] = useState(initState.eventData);
  const [deviceState, setDeviceState] = useState(initState.deviceState);
  const [propertiesVisible, setPropertiesVisible] = useState(initState.propertiesVisible);
  const [propertiesInfo, setPropertiesInfo] = useState(initState.propertiesInfo);

  let source: EventSourcePolyfill | null = null;

  const loadProperties = () => {
    apis.deviceInstance.properties(props.device.productId, props.device.id)
      .then(response => {
        if (response.status === 200) {
          setPropertiesData(response.result);
        }
      }).catch(() => {
    });
  };

  useEffect(() => {
    runInfo.loading = true;
    setRunInfo({ ...runInfo });
    props.device.loading = false;
    setRunInfo(props.device);
    setDeviceState(props.device);
    loadProperties();
  }, []);

  useEffect(() => {
    // 组装数据
    if (runInfo && runInfo.metadata) {
      const metadata = JSON.parse(runInfo.metadata);
      const { properties, events } = metadata;
      // 设置properties的值
      if (properties) {
        metadata.properties = properties.map((item: any) => {
          const temp = propertiesData.find(i => i.property === item.id);
          // if (!temp) return item;
          item.loading = false;
          item.formatValue = temp?.formatValue ? temp?.formatValue : '--';
          item.visitData = [];
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
              eventData.push({ eventId: event.id, data });
              setEventData([...eventData]);
            }
          }).catch(() => {

          });
        });
      }
      setMetadata(metadata);

      if (source) {
        source.close();
      }

      source = new EventSourcePolyfill(
        wrapAPI(`/jetlinks/dashboard/device/${props.device.productId}/properties/realTime?:X_Access_Token=${getAccessToken()}&deviceId=${props.device.id}&history=15`),
      );
      source.onmessage = (e: any) => {

        const data = JSON.parse(e.data);

        const dataValue = data.value;
        metadata.properties = properties.map((item: any) => {
          if (item.id === dataValue.property) {
            item.formatValue = dataValue?.formatValue ? dataValue.formatValue : '--';
            if (item.valueType.type === 'int' || item.valueType.type === 'float' || item.valueType.type === 'double') {
              if (item.visitData.length >= 15) {
                item.visitData.splice(0, 1);
              }
              item.visitData.push(
                {
                  'x': data.timeString,
                  'y': Math.floor(Number(dataValue.value) * 100) / 100,
                },
              );
            }
          }
          return item;
        });
        setMetadata({ ...metadata });
      };
      source.onerror = () => {
      };
      source.onopen = () => {
      };
    }

    return () => {
      if (source) {
        source.close();
        runInfo.loading = false;
      }
    };
  }, [runInfo]);

  const refresDeviceState = () => {
    runInfo.loading = true;
    apis.deviceInstance.refreshState(props.device.id)
      .then(response => {
        if (response.status === 200) {
          runInfo.loading = false;
          setDeviceState({ state: response.result });
        }
      }).catch(() => {

    });
  };

  const refreshProperties = (item: any) => {
    const { properties } = metadata;
    apis.deviceInstance.property(props.device.id, item.id)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          if (tempResult) {
            const temp = properties.map((e: any) => {
              if (e.id === tempResult.property) {
                e.formatValue = tempResult.formatValue;
              }
              e.loading = false;
              return e;
            });
            metadata.properties = temp;
          } else {
            const temp = properties.map((e: any) => {
              e.loading = false;
              return e;
            });
            metadata.properties = temp;
          }
          setMetadata({ ...metadata });
        } else {
          const temp = properties.map((e: any) => {
            e.loading = false;
            return e;
          });
          metadata.properties = temp;
          setMetadata({ ...metadata });
        }
      });
  };

  const refreshPropertyItem = (item: any) => {
    const { properties } = metadata;
    // 先修改加载状态
    // const temp = properties.find(i => i.id !== item.id);
    // item.loading = true;
    metadata.properties = properties.map((i: any) => {
      if (i.id === item.id) {
        i.loading = true;
      }
      return i;
    });
    setMetadata({ ...metadata });

    // 为了显示Loading效果
    refreshProperties(item);

  };

  const refreshEventItem = (item: any) => {
    const { events } = metadata;
    // 修改加载状态
    metadata.events = events.map((i: any) => {
      if (i.id === item.id) {
        i.loading = true;
      }
      return i;
    });
    setMetadata({ ...metadata });
    // 为了显示Loading效果
    // setTimeout(() => loadEventData(item.id), 5000);
    // loadEventData(item.id);
    apis.deviceInstance.eventData(
      props.device.id, item.id,
      encodeQueryParam({}),
    ).then(response => {
      // const tempEvent = response.result;
      if (response.status === 200) {
        eventData.forEach(i => {
          if (i.eventId === item.id) {
            i.data = response.result;
          }
        });
        setEventData([...eventData]);

        // 关闭加载中状态
        const { eventsInfo } = metadata;
        // 修改加载状态
        metadata.events = eventsInfo.map((i: any) => {
          if (i.id === item.id) {
            i.loading = false;
          }
          return i;
        });
        setMetadata({ ...metadata });
      }
    }).catch(() => {

    });
  };

  return (
    <div>
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
                        refresDeviceState();
                      }}/>
                    </Tooltip>
                  }
                  contentHeight={46}
                  total={deviceState?.state?.text}
                >
                  <span>上线时间：{moment(runInfo?.onlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
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
                              <Icon title='刷新' type="sync" onClick={() => {
                                refreshPropertyItem(item);
                              }}/>
                              <Icon title='详情' style={{ marginLeft: '10px' }} type="bars"
                                    onClick={() => {
                                      setPropertiesVisible(true);
                                      setPropertiesInfo(item);
                                    }}/>
                            </div>
                          }
                          total={item.formatValue || 0}
                          contentHeight={46}
                        >
                      <span>
                        <MiniArea height={40} color="#975FE4" data={item.visitData}/>
                      </span>
                        </ChartCard>
                      </Spin>
                    </Col>
                  );
                },
              )
            }
            {
              propertiesVisible &&
              <PropertiesInfo
                item={propertiesInfo}
                close={() => {
                  setPropertiesVisible(false);
                }}
                type={props.device.productId}
                deviceId={props.device.id}
              />
            }
            {
              (metadata.events).map((item: any) => {
                  const tempData = eventData.find(i => i.eventId === item.id);
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

                          total={`${tempData?.data.total || 0}次`}
                          contentHeight={46}
                        >
                      <span>
                        {eventLevel.get(item.expands?.level)}
                        <a
                          style={{ float: 'right' }}
                          onClick={() => {
                            setEventVisible(true);
                          }}>
                          查看详情
                        </a>
                      </span>
                        </ChartCard>

                      </Spin>

                      {
                        eventVisible &&
                        <EventLog
                          data={tempData?.data}
                          item={item}
                          close={() => {
                            setEventVisible(false);
                          }}
                          type={props.device.productId}
                          deviceId={props.device.id}
                        />
                      }
                    </Col>
                  );
                },
              )
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
                      refresDeviceState();
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
    </div>
  );
};

export default Status;
