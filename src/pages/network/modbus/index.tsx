import SearchForm from "@/components/SearchForm";
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { Badge, Button, Card, Divider, message, Popconfirm, Spin, Table } from "antd"
import React, { useEffect, useState } from "react"
import { router } from "umi";
import Save from './save'
import apis from '@/services';
import { PaginationConfig } from "antd/lib/pagination";

const Modbus = () => {

    const [spinning, setSpinning] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>({});
    const [searchParams, setSearchParams] = useState<any>({ pageSize: 10, pageIndex: 0 })
    const [dataSource, setDataSource] = useState<any>({
        data: []
    })

    const handleSearch = (params: any) => {
        setSearchParams(params)
        setSpinning(true)
        apis.modbus.getChanelList(params).then(resp => {
            if (resp.status === 200) {
                setDataSource(resp.result)
            }
            setSpinning(false)
        })
    }

    useEffect(() => {
        handleSearch(searchParams)
    }, [])

    const statusMap = new Map();
    statusMap.set('enabled', 'success');
    statusMap.set('disabled', 'error');

    const columns = [
        {
            title: '通道名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'IP',
            dataIndex: 'host',
            key: 'host',
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
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
            align: 'center',
            render: (text: any, record: any) => (
                <span>
                    <a onClick={() => {
                        setCurrent(record)
                        setVisible(true)
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => {
                        router.push(`/network/modbus/${record.id}`)
                    }}>设备接入</a>
                    <Divider type="vertical" />
                    <Popconfirm title={`确认${record.state.value === 'enabled' ? '禁用' : '启用'}`}
                        onConfirm={() => {
                            const data = {
                                ...record,
                                state: record.state.value === 'enabled' ? 'disabled' : 'enabled'
                            }
                            apis.modbus.updataChanel(data).then(resp => {
                                if (resp.status === 200) {
                                    message.success('操作成功！')
                                    handleSearch(searchParams)
                                }
                            })
                        }}
                    >
                        <a>{record.state.value === 'enabled' ? '禁用' : '启用'}</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除" onConfirm={() => {
                        apis.modbus.removeChanel(record.id).then(resp => {
                            if (resp.status === 200) {
                                message.success('操作成功！')
                                handleSearch(searchParams)
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
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParams?.terms
        });
    };

    return (
        <Spin spinning={spinning}>
            <PageHeaderWrapper title="Modbus">
                <Card bordered={false} style={{ marginBottom: 20 }}>
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
                                                        "column": "name",
                                                        "value": `%${params[key]}%`,
                                                        "termType": "like"
                                                    }
                                                ]
                                            }
                                        )
                                    }
                                })
                                setSearchParams({ pageSize: 10, pageIndex: 0, terms })
                                handleSearch({ pageSize: 10, pageIndex: 0, terms })
                            } else {
                                setSearchParams({ pageSize: 10, pageIndex: 0 })
                                handleSearch({ pageSize: 10, pageIndex: 0 })
                            }
                        }}
                        formItems={[{
                            label: '通道名称',
                            key: 'name',
                            type: 'string',
                        }]}
                    />
                </Card>
                <Card bordered={false}>
                    <div style={{ margin: '10px 0' }}><Button type="primary" onClick={() => {
                        setVisible(true)
                        setCurrent({})
                    }}>新增</Button></div>
                    <Table dataSource={dataSource?.data || []} rowKey='id' columns={columns}
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
                </Card>
            </PageHeaderWrapper>
            {
                visible && <Save close={() => {
                    setVisible(false)
                    handleSearch(searchParams)
                }} data={current} />
            }
        </Spin>
    )
}

export default Modbus