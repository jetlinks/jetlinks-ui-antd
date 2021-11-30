import { InstanceModel, service } from '@/pages/device/Instance';
import { Badge, Card, Col, Row } from 'antd';
import type {
  DeviceMetadata,
  ObserverMetadata,
  PropertyMetadata,
} from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useCallback, useEffect, useState } from 'react';
import Property from '@/pages/device/Instance/Detail/Running/Property';
import Event from '@/pages/device/Instance/Detail/Running/Event';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';

const ColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Running = () => {
  const intl = useIntl();
  const metadata = JSON.parse(InstanceModel.detail.metadata as string) as DeviceMetadata;

  const device = InstanceModel.detail;
  const [subscribeTopic] = useSendWebsocketMessage();

  const addObserver = (item: Record<string, any>) => {
    item.listener = [];
    item.subscribe = (callback: () => void) => {
      item.listener.push(callback);
    };
    item.next = (data: any) => {
      item.listener.forEach((element: any) => {
        element(data);
      });
    };
    return item;
  };
  metadata.events = metadata.events.map(addObserver);
  metadata.properties = metadata.properties.map(addObserver);
  const [propertiesList, setPropertiesList] = useState<string[]>([]);
  // const eventWS = {
  //   id: `instance-info-event-${device.id}-${device.productId}`,
  //   topic: `/dashboard/device/${device.productId}/events/realTime`,
  // }
  useEffect(() => {
    const list = metadata.properties.map((item: any) => item.id);
    setPropertiesList(list);
  }, []);
  const propertyWs = {
    id: `instance-info-property-${device.id}-${device.productId}-${propertiesList.join('-')}`,
    topic: `/dashboard/device/${device.productId}/properties/realTime`,
  };

  /**
   * 获取ws下发属性数据
   */
  const subscribeProperty = () => {
    subscribeTopic!(propertyWs.id, propertyWs.topic, {
      deviceId: device.id,
      properties: propertiesList,
      history: 0,
    })
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        const property = metadata.properties.find(
          (i) => i.id === payload.value.property,
        ) as PropertyMetadata & ObserverMetadata;
        if (property) {
          property.next(payload);
        }
      });
  };

  const getDashboard = () => {
    const params = [
      {
        dashboard: 'device',
        object: device.productId,
        measurement: 'properties',
        dimension: 'history',
        params: {
          deviceId: device.id,
          history: 15,
          properties: propertiesList,
        },
      },
    ];

    service.propertyRealTime(params).subscribe({
      next: (data) => {
        const index = metadata.properties.findIndex((i) => i.id === data.property);
        if (index > -1) {
          const property = metadata.properties[index] as PropertyMetadata & ObserverMetadata;
          property.list = data.list as Record<string, unknown>[];
          property.next(data.list);
        }
      },
    });
  };
  useEffect(() => {
    subscribeProperty();
    getDashboard();
  }, []);

  const renderCard = useCallback(() => {
    return [
      ...metadata.properties.map((item) => (
        <Col {...ColResponsiveProps} key={item.id}>
          <Property data={item as Partial<PropertyMetadata> & ObserverMetadata} />
        </Col>
      )),
      ...metadata.events.map((item) => (
        <Col {...ColResponsiveProps} key={item.id}>
          <Event data={item} />
        </Col>
      )),
    ];
  }, [device]);

  return (
    <Row gutter={24}>
      <Col {...ColResponsiveProps}>
        <Card
          title={intl.formatMessage({
            id: 'pages.device.instanceDetail.running.status',
            defaultMessage: '设备状态',
          })}
        >
          <div style={{ height: 60 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Badge status="success" text={<span style={{ fontSize: 25 }}>在线</span>} />
              </Col>
              <Col span={24}>
                {intl.formatMessage({
                  id: 'pages.device.instanceDetail.running.onlineTime',
                  defaultMessage: '在线时间',
                })}
                : 2021-8-20 12:20:33
              </Col>
            </Row>
          </div>
        </Card>
      </Col>

      {renderCard()}
    </Row>
  );
};
export default Running;
