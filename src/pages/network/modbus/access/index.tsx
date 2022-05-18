import SearchForm from "@/components/SearchForm";
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { Badge, Button, Card, Divider, Empty, Icon, message, Popconfirm, Spin, Table, Tabs } from "antd"
import { PaginationConfig } from "antd/lib/pagination";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react"
import AddPoint from '../add-point'
import ChoiceDevice from '../bind-device'
import styles from './index.less'

interface Props {
    location: Location;
}

const Access = (props: Props) => {
    const {
        location: { pathname },
    } = props;
    const id = (pathname.split('/') || []).pop() || '';
    const [spinning, setSpinning] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [bindVisible, setBindVisible] = useState<boolean>(false);
    const [deviceList, setDeviceList] = useState<any[]>([]);
    const [device, setDevice] = useState<any>({});
    const [current, setCurrent] = useState<any>({});
    const [properties$, setProperties$] = useState<any>();
    const [searchParams, setSearchParams] = useState<any>({ pageSize: 10, pageIndex: 0 })
    const [dataSource, setDataSource] = useState<any>({
        data: []
    })
    const wsCallback = useRef();
    const [propertiesMap, setPropertiesMap] = useState<any>({});

    const propertiesWs = (device: any, result: any) => {
        if (properties$) {
            properties$.unsubscribe();
        }
        const points: any[] = _.map(result.data, 'metadataId')
        const propertiesWs = getWebsocket(
            `instance-info-property-${device.id}-${device.productId}-${points.join("-")}`,
            `/dashboard/device/${device.productId}/properties/realTime`,
            {
                deviceId: device.id,
                properties: points,
                history: 1,
            },
        ).subscribe((resp: any) => {
            const { payload } = resp;
            propertiesMap[payload.value.property] = payload.value.formatValue
            setPropertiesMap({ ...propertiesMap })
        },
            () => { // setDataSource(result) 
            },
            () => { // setDataSource(result) 
            });
        setProperties$(propertiesWs);
    };

    const queryMetadataList = (device: any, params: any) => {
        apis.modbus.queryMetadataConfig(id, device.id, params).then(resp => {
            if (resp.status === 200) {
                setDataSource(resp.result);
                (resp?.result?.data || []).forEach((item: any) => {
                    propertiesMap[item.metadataId] = '/'
                })
                setPropertiesMap({ ...propertiesMap })
                propertiesWs(device, resp.result);
            }
        })
    }

    const queryDeviceList = (masterId: string) => {
        setSpinning(true)
        apis.deviceInstance.queryNoPagin(encodeQueryParam({
            terms: {
                'id$modbus-master': masterId
            }
        })).then(resp => {
            setSpinning(false)
            if (resp.status === 200) {
                setDeviceList(resp.result)
                if (resp.result[0]?.id) {
                    setDevice(resp?.result[0])
                    queryMetadataList(resp?.result[0], searchParams)
                }
            }
        })
    }

    useEffect(() => {
        if (pathname.indexOf('modbus') > 0) {
            queryDeviceList(id)
        }
    }, [])

    useEffect(() => {
        wsCallback.current = properties$;
    })

    useEffect(() => {
        return () => {
            const properties = wsCallback.current;
            properties && properties?.unsubscribe();
        }
    }, []);

    const statusMap = new Map();
    statusMap.set('enabled', 'success');
    statusMap.set('disabled', 'error');

    const columns = [
        {
            title: '属性ID',
            dataIndex: 'metadataId',
            key: 'metadataId',
        },
        {
            title: '功能码',
            dataIndex: 'function.text',
            key: 'function.text',
        },
        {
            title: '读取起始位置',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '读取长度',
            dataIndex: 'codecConfig.readLength',
            key: 'codecConfig.readLength',
        },
        {
            title: '值',
            dataIndex: 'value',
            key: 'value',
            render: (text: any, record: any) => <span>{
                propertiesMap[record?.metadataId] || '/'}</span>
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (record: any) =>
                record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <span>
                    <a onClick={() => {
                        setCurrent(record)
                        setVisible(true)
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title={`确认${record.state.value === 'enabled' ? '禁用' : '启用'}`}
                        onConfirm={() => {
                            const data = {
                                ...record,
                                state: record.state.value === 'enabled' ? 'disabled' : 'enabled'
                            }
                            apis.modbus.saveMetadataConfig(id, device.id, data).then(resp => {
                                if (resp.status === 200) {
                                    message.success('操作成功！')
                                    queryMetadataList(device, searchParams)
                                }
                            })
                        }}
                    >
                        <a>{record.state.value === 'enabled' ? '禁用' : '启用'}</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除" onConfirm={() => {
                        apis.modbus.removeMetadataConfig(record.id).then(resp => {
                            if (resp.status === 200) {
                                message.success('操作成功！')
                                queryMetadataList(device, searchParams)
                            }
                        })
                    }}>
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }
    ];

    const onTableChange = (
        pagination: PaginationConfig
    ) => {
        queryMetadataList(device, {
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParams?.terms
        });
    };

    return (
        <Spin spinning={spinning}>
            <PageHeaderWrapper title="设备接入">
                <Card bordered={false}>
                    <div style={{ marginBottom: '10px' }}>
                        <Button type="primary" onClick={() => {
                            setBindVisible(true)
                        }}>绑定设备</Button>
                    </div>
                    {
                        deviceList.length > 0 ? <Tabs defaultActiveKey={device.id} tabPosition={'left'} style={{ height: 700 }} onChange={(e) => {
                            setSearchParams({ pageSize: 10, pageIndex: 0 })
                            const data = deviceList.find(item => item.id === e)
                            if (data) {
                                queryMetadataList(data, { pageSize: 10, pageIndex: 0 })
                                setDevice(data)
                            }
                        }}>
                            {
                                deviceList.map(item => (
                                    <Tabs.TabPane key={item.id} tab={
                                        <div className={styles.left}>
                                            <div style={{ width: '100px', textAlign: 'left' }}><AutoHide title={item.name} style={{ width: '95%' }} /></div>
                                            <Popconfirm title='确认解绑？' onConfirm={() => {
                                                apis.modbus.unbindDevice(id, [item.id]).then(resp => {
                                                    if (resp.status === 200) {
                                                        message.success('操作成功！')
                                                        queryDeviceList(id)
                                                    }
                                                })
                                            }}>
                                                <Icon className={styles.icon} type="disconnect" />
                                            </Popconfirm>
                                        </div>
                                    }>
                                        <SearchForm
                                            search={(params: any) => {
                                                if (params) {
                                                    const terms: any[] = []
                                                    Object.keys(params).forEach(key => {
                                                        if (params[key]) {
                                                            terms.push(
                                                                {
                                                                    "terms": [
                                                                        {
                                                                            "column": key,
                                                                            "value": `%${params[key]}%`,
                                                                            "termType": "like"
                                                                        }
                                                                    ]
                                                                }
                                                            )
                                                        }
                                                    })
                                                    setSearchParams({ pageSize: 10, pageIndex: 0, terms })
                                                    queryMetadataList(device, { pageSize: 10, pageIndex: 0, terms })
                                                } else {
                                                    setSearchParams({ pageSize: 10, pageIndex: 0 })
                                                    queryMetadataList(device, { pageSize: 10, pageIndex: 0 })
                                                }
                                            }}
                                            formItems={[{
                                                label: '属性ID',
                                                key: 'metadataId',
                                                type: 'string',
                                            }]}
                                        />
                                        <div style={{ margin: '10px 0' }}><Button type="primary" onClick={() => {
                                            setVisible(true)
                                            setCurrent({})
                                        }}>新增数据点</Button></div>
                                        <Table dataSource={dataSource?.data || []} columns={columns} rowKey="id"
                                            onChange={onTableChange}
                                            pagination={{
                                                current: dataSource.pageIndex + 1,
                                                total: dataSource.total,
                                                pageSize: dataSource.pageSize || 10,
                                                showQuickJumper: true,
                                                showSizeChanger: true,
                                                pageSizeOptions: ['10', '20', '50', '100'],
                                                showTotal: (total: number) =>
                                                    `共 ${total} 条记录 第  ${dataSource.pageIndex + 1}/${Math.ceil(
                                                        dataSource.total / dataSource.pageSize,
                                                    )}页`,
                                            }} />
                                    </Tabs.TabPane>
                                ))
                            }
                        </Tabs> : <Empty />
                    }
                </Card>
                {
                    visible && <AddPoint masterId={id} deviceId={device.id} close={() => {
                        setVisible(false)
                        queryMetadataList(device, searchParams)
                    }} data={current} />
                }
                {
                    bindVisible && <ChoiceDevice masterId={id} save={(data: string[]) => {
                        setBindVisible(false)
                        if (Array.isArray(data) && data.length > 0) {
                            apis.modbus.bindDevice(id, data).then(resp => {
                                if (resp.status === 200) {
                                    message.success('操作成功！')
                                    queryDeviceList(id)
                                }
                            })
                        }
                    }} />
                }
            </PageHeaderWrapper>
        </Spin>
    )
}

export default Access