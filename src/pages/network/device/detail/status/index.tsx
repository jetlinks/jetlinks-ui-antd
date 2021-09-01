import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Table } from "antd";
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import DeviceState from './DeviceState';
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import _ from "lodash";
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import moment from "moment";
import { useCallback } from "react";

interface Props {
    refresh: Function;
    device: any;
    type: string;
    status: any
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

    const { device, type, status } = props;
    const [properties, setProperties] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [propertiesMap, setPropertiesMap] = useState<any>({});
    let properties$: any;



    useEffect(() => {
        if (props.device && props.device?.metadata) {
            let metadata = JSON.parse(props.device?.metadata || '{}');
            setProperties(metadata.properties || []);
            setLoading(true);

            if (metadata.properties) {
                let datalist: any[] = []
                metadata.properties = metadata.properties.map((item: any) => {
                    propertiesMap[item.id] = '/';
                    datalist.push({
                        id: item.id,
                        name: item.name,
                        time: '/',
                        value: '/'
                    })
                })
                setList([...datalist]);
            }
        }
    }, [props.device]);

    useEffect(() => {
        properties$ && properties$.unsubscribe();
        properties$ = getWebsocket(
            `instance-info-property-${device.id}-${device.productId}`,
            `/dashboard/device/${device.productId}/properties/realTime`,
            {
                deviceId: device.id,
                history: 1,
            },
        ).subscribe((resp) => {
            const { payload } = resp;
            const dataValue = payload.value;
            if (!propertiesMap[dataValue.property]) return;
            propertiesMap[dataValue.property] = dataValue.formatValue
            setPropertiesMap({ ...propertiesMap });
            list.map(item => {
                if (item.id === dataValue.property) {
                    item.time = payload.timestamp,
                        item.value = dataValue.formatValue
                }
            })
            setList([...list])
        },
        );
        return () => {
            properties$ && properties$.unsubscribe();
        };
    }, [list]);

    return (
        <Spin spinning={!loading}>
            <div style={{ height: 530 }}>

                {
                    type === 'card' ? (
                        <Row gutter={24} id="device-instance-status" >
                            <Col {...topColResponsiveProps}>
                                <DeviceState
                                    state={status?.state || {}}
                                    runInfo={
                                        {
                                            'onlineTime': status?.onlineTime,
                                            'offlineTime': status?.offlineTime
                                        }
                                    }
                                />
                            </Col>
                            {
                                properties.map(item => (
                                    <Col {...topColResponsiveProps} key={item.id}>
                                        <ChartCard
                                            title={item.name}
                                            contentHeight={46}
                                            hoverable
                                            total={
                                                <AutoHide
                                                    title={propertiesMap[item.id] || '/'}
                                                    style={{ width: '100%' }}
                                                />
                                            }
                                        >
                                            <span></span>
                                        </ChartCard>
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
                                            render: (text) => text !== '/' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'
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
