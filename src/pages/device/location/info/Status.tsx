import React, {useEffect, useState} from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import {Avatar, Badge, Card, Col, Row, Spin} from 'antd';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import gateway from '@/pages/device/gateway/img/gateway.svg';
import AutoHide from '@/pages/device/location/info/autoHide';
import {getWebsocket} from '@/layouts/GlobalWebSocket';

interface Props {
  device: any
}

interface State {
  metadata: any;
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  style: {paddingRight: 0, paddingBottom: 5},
};

const Status: React.FC<Props> = (props) => {

  const initState: State = {
    metadata: {},
  };

  const [metadata, setMetadata] = useState(initState.metadata);
  const [propertyData, setPropertyData] = useState({});
  const [spinning, setSpinning] = useState(true);
  const [statusType, setStatusType] = useState('');
  const [eventDataCount, setEventDataCount] = useState({});

  let subsProperties: any;
  let deviceStatus: any;
  let eventSubs: any;

  useEffect(() => {

    // 组装数据
    if (props.device && props.device.metadata) {

      setStatusType(props.device.state?.value);

      deviceStatus && deviceStatus.unsubscribe();

      deviceStatus = getWebsocket(
        `location-info-status-${props.device.id}`,
        `/dashboard/device/status/change/realTime`,
        {
          deviceId: props.device.id,
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;
          if (resp.requestId === `location-info-status-${props.device.id}`) {
            setStatusType(payload.value.type);
          }
        },
      );

      const metadata = JSON.parse(props.device.metadata);
      const {properties, events} = metadata;
      // 设置properties的值
      if (properties) {
        metadata.properties = properties.map((item: any) => {
          propertyData[item.id] = {
            formatValue: '/',
          };
          return item;
        });
      }

      // 设置event数据
      if (events) {
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
              eventDataCount[event.id] = data.total;
              setEventDataCount({...eventDataCount});
            }
          }).catch(() => {

          });
        });
      }

      setMetadata({...metadata});

      subsProperties && subsProperties.unsubscribe();

      subsProperties = getWebsocket(
        `location-info-property-${props.device.id}`,
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
          } else if (dataValue?.formatValue) {
            propertyData[dataValue.property].formatValue = dataValue?.formatValue ? dataValue.formatValue : '/';
          } else {
            propertyData[dataValue.property].formatValue = '/';
          }
          setPropertyData({...propertyData});
        },
      );

      eventSubs && eventSubs.unsubscribe();

      eventSubs = getWebsocket(
        `location-info-event-${props.device.id}-${props.device.productId}`,
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

      setSpinning(false);
    }

    return () => {
      subsProperties && subsProperties.unsubscribe();
      deviceStatus && deviceStatus.unsubscribe();
      eventSubs && eventSubs.unsubscribe();
    };
  }, [props.device]);

  const statusMap = new Map();
  statusMap.set('online', <Badge status='success' text={'在线'}/>);
  statusMap.set('offline', <Badge status='error' text={'离线'}/>);
  statusMap.set('notActive', <Badge status='processing' text={'未启用'}/>);

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
                     <Avatar src={gateway} style={{width: 48, height: 48}}/>
                   }
                   title={<b style={{fontSize: 16}}><AutoHide title={props.device.name} style={{width: 245}}/></b>}
                   action={
                     <div>
                       {statusMap.get(statusType)}
                     </div>
                   }
                   total={
                     <Row>
                      <span style={{fontSize: 14}}>
                        <AutoHide title={`ID：${props.device.id}`} style={{width: 120}}/>
                        <AutoHide title={`产品：${props.device.productName}`} style={{width: 120}}/>
                      </span>
                     </Row>
                   }>
          {metadata && metadata.properties ? <Row gutter={24} style={{paddingTop: 10}}>
              {
                (metadata.properties).map((item: any) => {
                    if (!item) return false;
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Card style={{backgroundColor: '#FBFBFB', height: 50}}
                              bodyStyle={{padding: 2, paddingLeft: 8, height: 50}}>
                          <AutoHide title={item.name}
                                    style={{width: 100, height: 20,fontSize: 12}}/>
                          <div>
                            <b>
                              <AutoHide title={...propertyData[item.id]?.formatValue || '/'}
                                        style={{width: 100, height: 20}}/>
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
                    return (
                      <Col {...topColResponsiveProps} key={item.id}>
                        <Card style={{backgroundColor: '#FBFBFB', height: 50}}
                              bodyStyle={{padding: 2, paddingLeft: 8, height: 50}}>
                          <AutoHide title={
                            <span>
                              {eventLevel.get(item.expands?.level)}{item.name}
                            </span>
                          }
                                    style={{width: 100, height: 20,fontSize: 12}}/>
                          <div>
                            <b>
                              <AutoHide title={`${eventDataCount[item.id] || 0}次`}
                                        style={{width: 100, height: 20}}/>
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
