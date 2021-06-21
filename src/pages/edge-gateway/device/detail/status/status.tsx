import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Spin, Tooltip, Icon } from "antd";
import ChartCard from "@/pages/analysis/components/Charts/ChartCard";
import { map } from "rxjs/operators";
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import { Observable } from "rxjs";
import DeviceState from "./DeviceState";
import apis from "@/services";
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import { MiniArea } from "@/pages/analysis/components/Charts";

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
    const { device } = props;
    const metadata = JSON.parse(device.metadata);
    const [properties, setProperties] = useState<any[]>(metadata.properties);
    const [loading, setLoading] = useState<boolean>(true);

    const propertiesWs: Observable<any> = getWebsocket(
        `instance-info-property-${device.id}-${device.productId}`,
        `/edge-gateway-state/device/${device.productId}/properties/realTime`,
        {
            deviceId: device.id,
            history: 0,
        },
    ).pipe(
        map(result => result.payload)
    );

    useEffect(() => {
        let properties$ = propertiesWs.subscribe((resp) => {
            properties.map(item => {
                if (resp[item.id] !== undefined) {
                    item.formatValue = resp[item.id]
                }
            });
            setProperties([...properties])
        });
        return () => {
            properties$ && properties$.unsubscribe();
        };
    }, []);

    const refreshProperty = (item: any) => {
        setLoading(true);
        // 刷新数据
        apis.edgeDevice.getProperty(device.id, item.id).then(() => {
            setLoading(false);
        })
    };


    const renderProperties = useCallback(
        () => {
            const propertyCard = properties.map((item: any) => (
                <Col {...topColResponsiveProps} key={item.id}>
                    <ChartCard
                        title={item.name}
                        contentHeight={46}
                        action={
                            <div>
                                <Tooltip placement="top" title="从设备端获取属性值">
                                    <Icon
                                        title="刷新"
                                        style={{ marginLeft: '10px' }}
                                        type="sync"
                                        onClick={() => refreshProperty(item)}
                                    />
                                </Tooltip>
                            </div>
                        }
                        total={
                            <AutoHide title={item.formatValue || '/'} style={{ width: '100%', height: '100px' }} />
                        }
                    >
                        <MiniArea height={40} color="#975FE4" data={item.visitData} />
                    </ChartCard >
                </Col>
            ))
            return [...propertyCard]
        }, [properties]);

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


// import React, { useCallback, useEffect, useState } from "react";
// import { Row, Col, message, Spin } from "antd";
// import PropertiesCard from "./PropertiesCard";
// import Service from "@/pages/device/instance/editor/service";
// import { groupBy, flatMap, toArray, map } from "rxjs/operators";
// import { getWebsocket } from "@/layouts/GlobalWebSocket";
// import { Observable } from "rxjs";
// import DeviceState from "./DeviceState";

// interface Props {
//     refresh: Function;
//     device: any;
//     edgeTag: boolean;
// }
// const topColResponsiveProps = {
//     xs: 24,
//     sm: 12,
//     md: 12,
//     lg: 12,
//     xl: 6,
//     style: { marginBottom: 24 },
// };
// const Status: React.FC<Props> = props => {
//     const { device } = props;
//     const metadata = JSON.parse(device.metadata);

//     const [properties, setProperties] = useState<any[]>(metadata.properties
//         .map((item: any) => {
//             item.listener = [];
//             item.subscribe = (callback: Function) => {
//                 item.listener.push(callback)
//             }
//             item.next = (data: any) => {
//                 item.listener.forEach((element: any) => {
//                     element(data);
//                 });
//             }
//             return item;
//         }));
//     const [loading, setLoading] = useState<boolean>(false);

//     const propertiesWs: Observable<any> = getWebsocket(
//         `instance-info-property-${device.id}-${device.productId}`,
//         `/edge-gateway-state/device/${device.productId}/properties/realTime`,
//         {
//             deviceId: device.id,
//             history: 0,
//         },
//     ).pipe(
//         map(result => result.payload)
//     );

//     let propertiesMap = {};
//     properties.forEach(item => propertiesMap[item.id] = item);

//     const [index, setIndex] = useState<number>(20);

//     useEffect(() => {
//         let properties$ = propertiesWs.subscribe((resp) => {
//             const property = resp.value.property;
//             const item = propertiesMap[property];
//             if (item) {
//                 item.next(resp);
//             }
//         });
        
//         return () => {
//             properties$ && properties$.unsubscribe();
//         };
//     }, []);


//     const renderProperties = useCallback(
//         () => {
//             const propertyCard = properties.map((item: any) => (
//                 <Col {...topColResponsiveProps} key={item.id}>
//                     <PropertiesCard
//                         item={item}
//                         key={item.id}
//                         device={device}
//                     />
//                 </Col>
//             ))
//             return [...propertyCard].splice(0, index)
//         }, [device, index]);

//     const service = new Service();

//     useEffect(() => {
//         const list = [{
//             'dashboard': 'device',
//             'object': device.productId,
//             'measurement': 'properties',
//             'dimension': 'history',
//             'params': {
//                 'deviceId': device.id,
//                 'history': 15,
//             },
//         }];

//         service.propertiesRealTime(list).pipe(
//             groupBy((group$: any) => group$.property),
//             flatMap(group => group.pipe(toArray())),
//             map(arr => ({
//                 list: arr.sort((a, b) => a.timestamp - b.timestamp),
//                 property: arr[0].property
//             }))
//         ).subscribe((data) => {
//             const index = properties.findIndex(item => item.id === data.property);
//             if (index > -1) {
//                 properties[index].list = data.list;
//             }
//         }, () => {
//             message.error('错误处理');
//         }, () => {
//             setLoading(true);
//             setProperties(properties);
//         })
//     }, []);

//     return (
//         <Spin spinning={!loading}>
//             <Row gutter={24} id="device-edge-status" >
//                 <Col {...topColResponsiveProps}>
//                     <DeviceState
//                         refresh={() => { props.refresh() }}
//                         state={device.state}
//                         runInfo={device}
//                     />
//                 </Col>

//                 {loading && renderProperties()}
//             </Row>
//         </Spin>
//     )
// };

// export default Status;
