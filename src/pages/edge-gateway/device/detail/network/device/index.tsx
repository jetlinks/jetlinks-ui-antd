import React, { Fragment, useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import { Badge, Button, Card, Divider, Icon, message, Popconfirm, Table } from 'antd';
import Save from './save';
import SearchForm from "@/components/SearchForm";
import Service from '../service';
import router from 'umi/router';
import moment from 'moment';
import { PaginationConfig } from 'antd/lib/pagination';

interface Props extends FormComponentProps {
    device: any
}

const Device: React.FC<Props> = props => {
    const service = new Service('device-network');
    const [result, setResult] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 10
    });
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<any>({});

    const handleSearch = (params: any) => {
        setSearchParam(params);
        setLoading(true);
        service.getDeviceList(props.device.id, params).subscribe(
            (res) => {
                setResult(res)
            },
            () => {
            },
            () => setLoading(false))
    };

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');
    statusMap.set('online', 'success');
    statusMap.set('offline', 'error');
    statusMap.set('notActive', 'processing');

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const saveData = (params?: any) => {
        if (currentItem.id) {
            service.saveDevice(props.device.id, params).subscribe(
                (res) => {
                    if (res.status === 200) {
                        message.success('操作成功！');
                        handleSearch(searchParam);
                    }
                },
                () => {
                },
                () => setLoading(false));
        } else {
            service.insertDevice(props.device.id, params).subscribe(
                (res) => {
                    if (res.status === 200) {
                        message.success('操作成功！');
                        handleSearch(searchParam);
                    }
                },
                () => {
                },
                () => setLoading(false));
        }
    };

    const deploy = (id: string) => {
        service.deployDevice(props.device.id, id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const undeploy = (id: string) => {
        service.undeployDevice(props.device.id, id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const removeItem = (params?: any) => {
        service.delIinstance(props.device.id, params.id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const onTableChange = (pagination: PaginationConfig) => {
        service.getDeviceList(props.device.id, {
            ...searchParam,
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize
        }).subscribe(
            (res) => {
                setResult(res)
            })
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            ellipsis: true,
        },
        {
            title: '注册时间',
            dataIndex: 'registryTime',
            width: '200px',
            render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
            // sorter: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: '90px',
            render: (record: any) => record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : ''
        },
        {
            title: '说明',
            dataIndex: 'describe',
            width: '15%',
            ellipsis: true
        },
        {
            title: '操作',
            width: '200px',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <a
                        onClick={() => {
                            router.push(`/edge-gateway/device/detail/${props.device.id}/save/${record.id}`);
                        }}
                    >
                        查看
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            setCurrentItem(record);
                            setSaveVisible(true);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    {record.state?.value === 'notActive' ? (
                        <span>
                            <Popconfirm
                                title="确认启用？"
                                onConfirm={() => {
                                    deploy(record.id);
                                }}
                            >
                                <a>启用</a>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确认删除？"
                                onConfirm={() => {
                                    removeItem(record);
                                }}
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <Popconfirm
                            title="确认禁用设备？"
                            onConfirm={() => {
                                undeploy(record.id);
                            }}
                        >
                            <a>禁用</a>
                        </Popconfirm>
                    )}
                </Fragment>
            ),
        },
    ];

    return (
        <Card>
            <div>
                <SearchForm
                    formItems={[
                        {
                            label: '名称',
                            key: 'name',
                            type: 'string',
                        }
                    ]}
                    search={(params: any) => {
                        if (params?.name) {
                            setSearchParam({
                                where: `name like '%${params?.name}%'`,
                                pageSize: 10
                            })
                            handleSearch({
                                where: `name like '%${params?.name}%'`,
                                pageSize: 10
                            });
                        } else {
                            setSearchParam({ pageSize: 10 })
                            handleSearch({ pageSize: 10 });
                        }
                    }}
                />
                <div style={{marginBottom: '20px'}}>
                    <Button type="primary" onClick={() => {
                        setSaveVisible(true);
                        setCurrentItem({});
                    }}><Icon type="plus" />新增设备</Button>
                </div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={result.data}
                    rowKey="id"
                    pagination={{
                        current: result.pageIndex + 1,
                        total: result.total,
                        pageSize: result.pageSize
                    }}
                    onChange={onTableChange}
                />
            </div>
            {saveVisible && <Save
                data={currentItem}
                deviceId={props.device.id}
                close={() => {
                    setSaveVisible(false);
                    setCurrentItem({});
                }}
                save={(item: any) => {
                    saveData(item);
                    setSaveVisible(false);
                    setCurrentItem({});
                }} />
            }
        </Card>

    )
};

export default Form.create<Props>()(Device);
