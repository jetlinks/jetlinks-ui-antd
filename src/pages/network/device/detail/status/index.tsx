import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Table } from "antd";
import PropertiesCard from './PropertiesCard';
import DeviceState from './DeviceState';
interface Props {
    refresh: Function;
    device: any;
    type: string;
}
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
};
const Status: React.FC<Props> = props => {
    const { device, type } = props;
    const [properties, setProperties] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    // const propertiesWs: Observable<any> = getWebsocket(
    //     `instance-info-property-${device.id}-${device.productId}`,
    //     `/dashboard/device/${device.productId}/properties/realTime`,
    //     {
    //         deviceId: device.id,
    //         history: 0,
    //     },
    // ).pipe(
    //     map(result => result.payload)
    // );

    // const eventsWs: Observable<any> = getWebsocket(
    //     `instance-info-event-${device.id}-${device.productId}`,
    //     `/dashboard/device/${device.productId}/events/realTime`,
    //     {
    //         deviceId: device.id,
    //     },
    // ).pipe(
    //     map(result => result.payload)
    // );

    // let propertiesMap = {};
    // properties.forEach(item => propertiesMap[item.id] = item);
    // let eventsMap = {};
    // events.forEach((item: any) => eventsMap[item.id] = item);

    // const [index, setIndex] = useState<number>(20);
    useEffect(() => {
        let data = JSON.parse(device?.metadata || "{}");
        setProperties(data.properties || []);
        setLoading(true);
        // const properties$ = propertiesWs.subscribe((resp) => {
        //     const property = resp.value.property;
        //     const item = propertiesMap[property];
        //     if (item) {
        //         item.next(resp);
        //     }
        // });

        // const events$ = eventsWs.subscribe((resp) => {
        //     const event = resp.value.event;
        //     const item = eventsMap[event];
        //     if (item) {
        //         item.next(resp);
        //     }
        // });

        // return () => {
        //     properties$.unsubscribe();
        //     events$.unsubscribe()
        // };

    }, [device]);

    return (
        <Spin spinning={!loading}>
            <div>
                {
                    type === 'card' ? (
                        <Row gutter={24} id="device-instance-status" >
                            <Col {...topColResponsiveProps}>
                                <DeviceState
                                    state={device?.state || {}}
                                    runInfo={
                                        {
                                            'onlineTime': device?.onlineTime,
                                            'offlineTime': device?.offlineTime
                                        }
                                    }
                                />
                            </Col>
                            {
                                properties.map(item => (
                                    <Col {...topColResponsiveProps} key={item.id}>
                                        <PropertiesCard
                                            item={item}
                                            key={item.id}
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                    ) :
                        (
                            <Table
                                rowKey="id"
                                columns={
                                    [
                                        {
                                            dataIndex: 'time',
                                            title: '权限名称',
                                        },
                                        {
                                            dataIndex: 'name',
                                            title: '属性名称',
                                        },
                                        {
                                            dataIndex: 'value',
                                            title: '实时工况值'
                                        },
                                    ]
                                }
                                dataSource={properties} />
                        )
                }
            </div>
        </Spin>
    )
};

export default Status;
