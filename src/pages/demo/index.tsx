import React, { useEffect } from "react";
import { Table } from "antd";
import Service from "../system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";
import { map, flatMap } from "rxjs/operators";
import { of, from } from "rxjs";
import { pipeFromArray } from "rxjs/internal/util/pipe";
import apis from "@/services";

const Demo = () => {

    const column: any[] = [
        {
            dataIndex: 'member',
            title: '成员',
        },
        {
            dataIndex: 'product',
            title: '产品'
        },
        {
            dataIndex: 'online',
            title: '设备在线'
        },
        {
            dataIndex: 'offline',
            title: '设备离线'
        },
        {
            dataIndex: 'log',
            title: '告警记录'
        }
    ];
    const service = new Service('');
    useEffect(() => {
        // todo 查询租户
        service.member.queryNoPaging('83fb056bdf5515704852a60ae4f7cd3d', {})
            .pipe(// 
                flatMap(from),
                flatMap((i: any) => {
                    // [1, 2, 3]
                    console.log(i);
                    return service.assets.productNopaging(encodeQueryParam({
                        terms: {
                            id$assets: JSON.stringify({
                                tenantId: '83fb056bdf5515704852a60ae4f7cd3d',
                                assetType: 'product',
                                memberId: i.userId,
                            }),
                        }
                    })).pipe(
                        map(t => ({ i: i, data: t }))
                    )
                }),
            ).subscribe((result) => {
                console.log(result, 'result');
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
            title: 'Name',
            dataIndex: 'name',
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
            title: 'Age',
            dataIndex: 'age',
            render: renderContent,
        },
        {
            title: 'Home phone',
            colSpan: 2,
            dataIndex: 'tel',
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
            title: 'Phone',
            colSpan: 0,
            dataIndex: 'phone',
            render: renderContent,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: renderContent,
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
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