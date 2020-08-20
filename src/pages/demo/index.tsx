import React, { useEffect } from "react";
import { Table } from "antd";
import Service from "../system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";
import { map, flatMap, toArray, groupBy, mergeMap, reduce, filter } from "rxjs/operators";
import { from } from "rxjs";
import apis from "@/services";

const Demo = () => {

    const service = new Service('');
    useEffect(() => {
        // todo 查询租户
        service.member.queryNoPaging('83fb056bdf5515704852a60ae4f7cd3d', {})
            .pipe(// 
                flatMap(from),
                flatMap((i: any) => service.assets.productNopaging(encodeQueryParam({
                    terms: {
                        id$assets: JSON.stringify({
                            tenantId: '83fb056bdf5515704852a60ae4f7cd3d',
                            assetType: 'product',
                            memberId: i.userId,
                        }),
                    }
                })).pipe(
                    flatMap(from),
                    flatMap((t: any) => {
                        return service.assets.instanceNopaging(
                            encodeQueryParam({
                                terms: {
                                    productId: t.id,
                                    id$assets: JSON.stringify({
                                        tenantId: '83fb056bdf5515704852a60ae4f7cd3d',
                                        assetType: 'device',
                                        memberId: i.userId,
                                    }),
                                }
                            })).pipe(
                                filter(item => item.length > 0),
                                flatMap(from),
                                groupBy(item => item.state),
                                mergeMap(val$ => {
                                    console.log(val$, 'vals');
                                    return val$.pipe(reduce((acc, cur) => [...acc, cur], [`${val$.key?.value}`]))

                                }),
                                // map(p => ({ t: t, list: p }))
                            )
                    }),
                    toArray(),
                    map(a => ({ i: i, data: a })),
                )
                ),
                toArray(),
            ).subscribe((result) => {
                console.log(JSON.stringify(result), 'result');
            });

        apis.deviceInstance.count({})

    }, []);
    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            props: {
                // colSpan: 0,
            },
        };
        if (index === 4) {
            obj.props.colSpan = 0;
        }
        return obj;
    };

    const columns = [
        {
            title: '成员',
            dataIndex: 'member',
            render: (text, row, index) => {
                if (index < 4) {
                    return <a>{text}</a>;
                }
                return {
                    children: <a>{text}</a>,
                    props: {
                        colSpan: 5,
                    },
                };
            },
        },
        {
            title: '产品',
            dataIndex: 'product',
            render: renderContent,
        },
        {
            title: '设备在线',
            colSpan: 2,
            dataIndex: 'online',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {
                        // rowSpan: 0,
                    },
                };
                if (index === 2) {
                    obj.props.rowSpan = 2;
                }
                // These two are merged into above cell
                if (index === 3) {
                    obj.props.rowSpan = 0;
                }
                if (index === 4) {
                    obj.props.colSpan = 0;
                }
                return obj;
            },
        },
        {
            title: '设备离线',
            colSpan: 0,
            dataIndex: 'offline',
            render: renderContent,
        },
        {
            dataIndex: 'log',
            title: '告警记录',
            render: renderContent,
        },
    ];

    const data = [
        {
            key: '1',
            member: '测试555',
            product: '演示设备',
            online: 324,
            phone: 18889898989,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            member: 'pro',
            product: '演示UDP',
            online: 188,
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            member: 'hhh',
            product: 'NB-IOT-v1',
            online: 243,
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            member: '测试租户1',
            product: 'TCP test',
            online: 421,
            phone: 18900010002,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '5',
            member: '"特使通55"',
            product: '测试网关',
            online: 134,
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park',
        },
    ];
    return (
        <div>
            <Table columns={columns} dataSource={data} bordered />
        </div>
    )
}
export default Demo;