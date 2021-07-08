import React, {  useEffect, useState } from "react";
import { Row, Col, Spin, Table } from "antd";
import PropertiesCard from './PropertiesCard';
import DeviceState from './DeviceState';
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import _ from "lodash";

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
    const [list, setList] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const propertiesWs: Observable<any> = getWebsocket(
        `instance-info-property-${device.id}-${device.productId}`,
        `/dashboard/device/${device.productId}/properties/realTime`,
        // `/edge-gateway-state/device/${device.productId}/properties/realTime`,
        {
            deviceId: device.id,
            history: 1,
        },
    ).pipe(
        map(result => result.payload)
    );

    useEffect(() => {
        let metadata = JSON.parse(props.device?.metadata || '{}');
        setProperties(metadata.properties || []);
        setLoading(true);
        setList(_.map(metadata.properties, (item) => {
            return {
                id: item.id,
                name: item.name,
                time: '/',
                value: '/'
            }
        }))
    }, [props.device]);

    let propertiesMap = {};
    properties.forEach(item => propertiesMap[item.id] = item);

    useEffect(() => {

        const properties$ = propertiesWs.subscribe((resp) => {
            console.log(resp)
            //组合数据
        });
        return () => {
            properties$.unsubscribe();
        };
    }, []);

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
                                            title: '基准时间',
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
                                dataSource={list} />
                        )
                }
            </div>
        </Spin>
    )
};

export default Status;
