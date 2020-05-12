import React, { useEffect, useState } from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import { Avatar, Badge, Card, Col, Row, Spin } from 'antd';
import { EventSourcePolyfill } from 'event-source-polyfill';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import { getAccessToken } from '@/utils/authority';
import { wrapAPI } from '@/utils/utils';
import gateway from '@/pages/device/gateway/img/gateway.svg';
import AutoHide from '@/pages/device/location/info/autoHide';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  device: any
}

interface State {
  metadata: any;
  eventData: any[];
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  style: { paddingRight: 0, paddingBottom: 5 },
};

const Status: React.FC<Props> = (props) => {

  const initState: State = {
    metadata: {},
    eventData: [],
  };
  const [metadata, setMetadata] = useState(initState.metadata);
  const [eventData, setEventData] = useState(initState.eventData);
  const [propertyData, setPropertyData] = useState({});
  const [spinning, setSpinning] = useState(true);
  const [statusType, setStatusType] = useState('');

  useEffect(() => {
    setStatusType(props.device.state?.value);
    let subs: any;
    let deviceStatus: any;

    deviceStatus = getWebsocket(
      `location-info-status-${props.device.id}`,
      `/dashboard/device/status/change/realTime`,
      {
        deviceId: props.device.id,
      },
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        if (resp.requestId === `location-info-status-${props.device.id}`) {
          setStatusType(payload.value.type);
        }
      },
    );

    // 组装数据
    if (props.device && props.device.metadata) {
      const metadata = JSON.parse(props.device.metadata);
      const { properties, events } = metadata;
      // 设置properties的值
      if (properties) {
        metadata.properties = properties.map((item: any) => {
          propertyData[item.id] = {
            formatValue: '--',
          };
          return item;
        });
      }

      // 设置event数据
      if (events) {
        eventData.splice(0, eventData.length);
        events.map((event: any) => {
          // 加载数据
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

      setMetadata({ ...metadata });
      subs = getWebsocket(
        `location-info-property-${props.device.id}`,
        `/dashboard/device/${props.device.productId}/properties/realTime`,
        {
          deviceId: props.device.id,
          history: 1,
        },
      ).subscribe(
        (resp: any) => {
          const { payload } = resp;
          if (resp.requestId === `location-info-property-${props.device.id}`) {
            const dataValue = payload.value;

            if (!propertyData[dataValue.property]) return;

            propertyData[dataValue.property].formatValue = dataValue?.formatValue ? dataValue.formatValue : '/';

            setPropertyData({ ...propertyData });
          }
        },
      );

      setSpinning(false);
    }

    return () => {
      subs && subs.unsubscribe();
      deviceStatus && deviceStatus.unsubscribe();
    };
  }, [props.device]);

  const statusMap = new Map();
  statusMap.set('online', <Badge status='success' text={'在线'}/>);
  statusMap.set('offline', <Badge status='error' text={'离线'}/>);
  statusMap.set('notActive', <Badge status='processing' text={'未激活'}/>);

  const eventLevel = new Map();
  eventLevel.set('ordinary', <Badge status="processing"/>);
  eventLevel.set('warn', <Badge status="warning"/>);
  eventLevel.set('urgent', <Badge status="error"/>);

  return (
    <div id="deviceStatus" style={{
      maxHeight: 500, overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <Spin tip="加载中..." spinning={spinning}>
        <ChartCard bordered={false}
                   avatar={
                     <Avatar src={gateway} style={{ width: 48, height: 48 }}/>
                   }
                   title={<b style={{ fontSize: 16 }}><AutoHide title={props.device.name} style={{ width: 250 }}/></b>}
                   action={
                     <div>
                       {statusMap.get(statusType)}
                     </div>
                   }
                   total={
                     <Row>
                      <span style={{ fontSize: 14 }}>
                        <AutoHide title={`ID：${props.device.id}`} style={{ width: 140 }}/>
                        <AutoHide title={`产品：${props.device.productName}`} style={{ width: 140 }}/>
                      </span>
                     </Row>
                   }>
          {metadata && metadata.properties ? <Row gutter={24} style={{ paddingTop: 10 }}>
              {
                (metadata.properties).map((item: any) => {
                    if (!item) return false;
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Card style={{ backgroundColor: '#FBFBFB', height: 50 }}
                              bodyStyle={{ padding: 2, paddingLeft: 8, height: 50 }}>
                          <span style={{ fontSize: 12 }}>{item.name}</span>
                          <div>
                            <b>
                              <AutoHide title={...propertyData[item.id]?.formatValue || '/'}
                                        style={{ width: 100, height: 20 }}/>
                            </b>
                          </div>
                        </Card>
                      </Col>
                    );
                  },
                )
              }
              {
                (metadata.events).map((item: any) => {
                    const tempData = eventData.find(i => i.eventId === item.id);
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Card style={{ backgroundColor: '#FBFBFB', height: 50 }}
                              bodyStyle={{ padding: 2, paddingLeft: 8, height: 50 }}>
                          <span style={{ fontSize: 12 }}>{eventLevel.get(item.expands?.level)}{item.name}</span>
                          <div>
                            <b>
                              <AutoHide title={`${tempData?.data.total || 0}次`}
                                        style={{ width: 100, height: 20 }}/>
                            </b>
                          </div>
                        </Card>
                      </Col>
                    );
                  },
                )
              }
            </Row>
            :
            <Col {...topColResponsiveProps}>
              <span/>
            </Col>
          }
        </ChartCard>
      </Spin>
    </div>
  );
};

export default Status;
