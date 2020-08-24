import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Service from "../system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";
import { map, flatMap, toArray, groupBy, mergeMap, reduce, filter, count, defaultIfEmpty } from "rxjs/operators";
import { from } from "rxjs";
import apis from "@/services";
import { randomString } from "@/utils/utils";

const Demo = () => {

    const service = new Service('');
    const [data, setData] = useState<any[]>([]);
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
                                // filter(item => item.length > 0),
                                flatMap(from),
                                groupBy(item => item.state.value),
                                mergeMap(val$ => val$.pipe(
                                    count(),
                                    map(count => {
                                        let v = { productId: t.id, productName: t.name };
                                        v[val$.key] = count;
                                        return v;
                                    })
                                )),
                                defaultIfEmpty({ productId: t.id, productName: t.name }),
                                groupBy(j => j.productId),
                                flatMap(group => group.pipe(
                                    reduce((a, b) => ({ ...a, ...b }))
                                ))
                            )
                    }),
                    //product 为list
                    // toArray(),
                    // map(a => ({ userId: i.userId, name: i.name, product: a })),
                    // 平铺product
                    map(a => ({ userId: i.userId, name: i.name, ...a, key: `${i.userId}-${randomString(7)}` })),
                    defaultIfEmpty({ userId: i.userId, name: i.name, key: `${i.userId}` })
                )),
                toArray(),
                map(list => list.sort((a, b) => a.userId - b.userId))
            ).subscribe((result) => {
                setData(result);
                // console.log(JSON.stringify(result), 'result');
            });

        apis.deviceInstance.count({})

    }, []);

    const test: string[] = [];

    const columns = [
        {
            title: '成员',
            dataIndex: 'name',
            render: (text, row, index) => {
                test.push(text);
                return {
                    children: text,
                    props: {
                        rowSpan: test.filter(i => i === text).length > 1 ? 0 : data.filter(i => i.name === text).length,
                    },
                };
            },
        },
        {
            title: '产品',
            dataIndex: 'productName',
            // render: renderContent,
        },
        {
            title: '设备在线',
            // colSpan: 2,
            dataIndex: 'online',
            render: (text: any) => text || 0,
            // render: (value, row, index) => {
            //     const obj = {
            //         children: value,
            //         props: {
            //             // rowSpan: 0,
            //         },
            //     };
            //     if (index === 2) {
            //         obj.props.rowSpan = 2;
            //     }
            //     // These two are merged into above cell
            //     if (index === 3) {
            //         obj.props.rowSpan = 0;
            //     }
            //     if (index === 4) {
            //         obj.props.colSpan = 0;
            //     }
            //     return obj;
            // },
        },
        {
            title: '设备离线',
            // colSpan: 0,
            dataIndex: 'offline',
            render: (text: any) => text || 0,
        },
        {
            dataIndex: 'log',
            title: '告警记录',
            render: (text: any) => text || 0,
        },
    ];


    return (
        <div>
            <Table
                style={{ width: 1000 }}
                size="small"
                pagination={false}
                columns={columns}
                dataSource={data}
                bordered />
        </div>
    )
}
export default Demo;