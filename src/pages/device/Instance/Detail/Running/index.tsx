import { InstanceModel } from '@/pages/device/Instance';
import { Card, Tabs } from 'antd';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
// import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect } from 'react';
import Property from '@/pages/device/Instance/Detail/Running/Property';
// import Event from '@/pages/device/Instance/Detail/Running/Event';
// import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
// import { map } from 'rxjs/operators';
// import moment from 'moment';
// import { deviceStatus } from '@/pages/device/Instance/Detail';

// const ColResponsiveProps = {
//   xs: 24,
//   sm: 12,
//   md: 12,
//   lg: 12,
//   xl: 6,
//   style: { marginBottom: 24 },
// };

const Running = () => {
  // const intl = useIntl();
  const metadata = JSON.parse(InstanceModel.detail.metadata as string) as DeviceMetadata;

  // const device = InstanceModel.detail;
  // const [subscribeTopic] = useSendWebsocketMessage();

  // const addObserver = (item: Record<string, any>) => {
  //   item.listener = [];
  //   item.subscribe = (callback: () => void) => {
  //     item.listener.push(callback);
  //   };
  //   item.next = (data: any) => {
  //     item.listener.forEach((element: any) => {
  //       element(data);
  //     });
  //   };
  //   return item;
  // };
  // metadata.events = metadata.events.map(addObserver);
  // metadata.properties = metadata.properties.map(addObserver);
  // const [propertiesList, setPropertiesList] = useState<string[]>(
  //   metadata.properties.map((item: any) => item.id),
  // );

  /**
   * 订阅属性数据
   */
  // const subscribeProperty = () => {
  //   const id = `instance-info-property-${device.id}-${device.productId}-${propertiesList.join(
  //     '-',
  //   )}`;
  //   const topic = `/dashboard/device/${device.productId}/properties/realTime`;
  //   subscribeTopic!(id, topic, {
  //     deviceId: device.id,
  //     properties: propertiesList,
  //     history: 0,
  //   })
  //     ?.pipe(map((res) => res.payload))
  //     .subscribe((payload: any) => {
  //       const property = metadata.properties.find(
  //         (i) => i.id === payload.value.property,
  //       ) as PropertyMetadata & ObserverMetadata;
  //       if (property) {
  //         property.next(payload);
  //       }
  //     });
  // };

  // const getDashboard = () => {
  //   const params = [
  //     {
  //       dashboard: 'device',
  //       object: device.productId,
  //       measurement: 'properties',
  //       dimension: 'history',
  //       params: {
  //         deviceId: device.id,
  //         history: 15,
  //         properties: propertiesList,
  //       },
  //     },
  //   ];

  //   service.propertyRealTime(params).subscribe({
  //     next: (data) => {
  //       const index = metadata.properties.findIndex((i) => i.id === data.property);
  //       if (index > -1) {
  //         const property = metadata.properties[index] as PropertyMetadata & ObserverMetadata;
  //         property.list = data.list as Record<string, unknown>[];
  //         property.next(data.list);
  //       }
  //     },
  //   });
  // };

  // /**
  //  * 订阅事件数据
  //  */
  // const subscribeEvent = () => {
  //   const id = `instance-info-event-${device.id}-${device.productId}`;
  //   const topic = `/dashboard/device/${device.productId}/events/realTime`;
  //   subscribeTopic!(id, topic, { deviceId: device.id })
  //     ?.pipe(map((res) => res.payload))
  //     .subscribe((payload: any) => {
  //       const event = metadata.events.find((i) => i.id === payload.value.event) as EventMetadata &
  //         ObserverMetadata;
  //       if (event) {
  //         event.next(payload);
  //       }
  //     });
  // };
  useEffect(() => {
    // subscribeProperty();
    // subscribeEvent();
    // getDashboard();
  }, []);

  // const [renderCount, setRenderCount] = useState<number>(15);
  // window.onscroll = () => {
  //   const a = document.documentElement.scrollTop;
  //   const c = document.documentElement.scrollHeight;
  //   const b = document.body.clientHeight;
  //   if (a + b >= c - 50) {
  //     const list: any = [];
  //     metadata.properties.slice(renderCount, renderCount + 15).map((item) => {
  //       list.push(item.id);
  //     });
  //     setPropertiesList([...list]);
  //     setRenderCount(renderCount + 15);
  //   }
  // };

  // const renderCard = useCallback(() => {
  //   return [
  //     ...metadata.properties.map((item) => (
  //       <Col {...ColResponsiveProps} key={item.id}>
  //         <Property data={item as Partial<PropertyMetadata> & ObserverMetadata} />
  //       </Col>
  //     )),
  //     ...metadata.events.map((item) => (
  //       <Col {...ColResponsiveProps} key={item.id}>
  //         <Event data={item as Partial<EventMetadata> & ObserverMetadata} />
  //       </Col>
  //     )),
  //   ].splice(0, renderCount);
  // }, [device, renderCount]);

  return (
    // <Row gutter={24}>
    //   <Col {...ColResponsiveProps}>
    //     <Card
    //       title={intl.formatMessage({
    //         id: 'pages.device.instanceDetail.running.status',
    //         defaultMessage: '设备状态',
    //       })}
    //     >
    //       <div style={{ height: 60 }}>
    //         <Row gutter={[16, 16]}>
    //           <Col span={24}>{deviceStatus.get(InstanceModel.detail.state?.value)}</Col>
    //           <Col span={24}>
    //             {device.state?.value === 'online' ? (
    //               <span>上线时间：{moment(device?.onlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
    //             ) : (
    //               <span>离线时间：{moment(device?.offlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
    //             )}
    //           </Col>
    //         </Row>
    //       </div>
    //     </Card>
    //   </Col>
    //   {renderCard()}
    // </Row>
    <Card>
      <Tabs defaultActiveKey="1" tabPosition="left">
        <Tabs.TabPane tab="属性" key="1">
          <Property data={metadata?.properties || {}} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="事件1" key="2">
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default Running;
