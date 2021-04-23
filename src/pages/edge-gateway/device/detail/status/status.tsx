import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, message, Spin } from "antd";
import PropertiesCard from "./PropertiesCard";
import Service from "@/pages/device/instance/editor/service";
import { groupBy, flatMap, toArray, map } from "rxjs/operators";
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import { getWebSocket } from './websocket';
import { Observable, Subscription } from "rxjs";
import DeviceState from "./DeviceState";

interface Props {
    refresh: Function;
    device: any;
    edgeTag: boolean;
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
    const { device, edgeTag } = props;
    const metadata = JSON.parse(device.metadata);
    
    const [properties, setProperties] = useState<any[]>(metadata.properties
        .map((item: any) => {
            item.listener = [];
            item.subscribe = (callback: Function) => {
                item.listener.push(callback)
            }
            item.next = (data: any) => {
                item.listener.forEach((element: any) => {
                    element(data);
                });
            }
            return item;
        }));
    const [loading, setLoading] = useState<boolean>(false);

    const propertiesWs: Observable<any> = getWebsocket(
        `instance-info-property-${device.id}-${device.productId}`,
        `/dashboard/device/${device.productId}/properties/realTime`,
        {
            deviceId: device.id,
            history: 0,
        },
    ).pipe(
        map(result => result.payload)
    );

    const propertiesEdge: Observable<any> = getWebSocket(
        `instance-info-property-${device.id}-${device.productId}`,
        `/edge-gateway-state/device/${device.productId}/properties/realTime`,
        {
            deviceId: device.id,
            history: 0,
        },
    ).pipe(
        map(result => result.payload)
    );

    let propertiesMap = {};
    properties.forEach(item => propertiesMap[item.id] = item);

    const [index, setIndex] = useState<number>(20);

    useEffect(() => {
        let properties$: Subscription | null = null;

        if (edgeTag) {
            properties$ = propertiesEdge.subscribe((resp) => {
                const property = resp.value.property;
                const item = propertiesMap[property];
                if (item) {
                    item.next(resp);
                }
            });
        } else {
            properties$ = propertiesWs.subscribe((resp) => {
                const property = resp.value.property;
                const item = propertiesMap[property];
                if (item) {
                    item.next(resp);
                }
            });
        }
        return () => {
            properties$ && properties$.unsubscribe();
        };
    }, []);


    const renderProperties = useCallback(
        () => {
            const propertyCard = properties.map((item: any) => (
                <Col {...topColResponsiveProps} key={item.id}>
                    <PropertiesCard
                        item={item}
                        key={item.id}
                        device={device}
                    />
                </Col>
            ))
            return [...propertyCard].splice(0, index)
        }, [device, index]);

    const service = new Service();

    useEffect(() => {
        const list = [{
            'dashboard': 'device',
            'object': device.productId,
            'measurement': 'properties',
            'dimension': 'history',
            'params': {
                'deviceId': device.id,
                'history': 15,
            },
        }];

        service.propertiesRealTime(list).pipe(
            groupBy((group$: any) => group$.property),
            flatMap(group => group.pipe(toArray())),
            map(arr => ({
                list: arr.sort((a, b) => a.timestamp - b.timestamp),
                property: arr[0].property
            }))
        ).subscribe((data) => {
            const index = properties.findIndex(item => item.id === data.property);
            if (index > -1) {
                properties[index].list = data.list;
            }
        }, () => {
            message.error('错误处理');
        }, () => {
            setLoading(true);
            setProperties(properties);
        })
    }, []);

    // window.onscroll = () => {
    //     var a = document.documentElement.scrollTop;
    //     var c = document.documentElement.scrollHeight;

    //     var b = document.body.clientHeight;
    //     if (a + b >= c - 50) {
    //         setIndex(index + 10);
    //     }
    // }

    return (
        <Spin spinning={!loading}>
            <Row gutter={24} id="device-edge-status" >
                <Col {...topColResponsiveProps}>
                    <DeviceState
                        refresh={() => { props.refresh() }}
                        state={device.state}
                        runInfo={device}
                    />
                </Col>

                {loading && renderProperties()}
            </Row>
        </Spin>
    )
};

export default Status;
