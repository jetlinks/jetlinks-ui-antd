import React, { Fragment, useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import { Badge, Button, Card, Divider, Icon, message, Popconfirm, Table } from 'antd';
import Save from './save';
import Service from '../service';

interface Props extends FormComponentProps {
    device: any
}

const CompositeGateway: React.FC<Props> = props => {
    const service = new Service('device-network');
    const [result, setResult] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<any>({});

    const handleSearch = () => {
        setLoading(true);
        service.getDeviceGatewayList(props.device.id, { paging: false }).subscribe(
            (res) => {
                setResult(res)
            },
            () => {
            },
            () => setLoading(false))
    };

    const modelType = new Map();
    modelType.set('device_alarm', '设备告警');
    modelType.set('sql_rule', '数据转发');
    modelType.set('node-red', '规则编排');
    modelType.set('rule-scene', '场景联动');

    useEffect(() => {
        handleSearch();
    }, []);

    const saveData = (params?: any) => {
        service.saveDeviceGateway(props.device.id, params).subscribe(
            (res) => {
                if (res.status === 200) {
                    message.success('操作成功！');
                    handleSearch();
                }
            },
            () => {
            },
            () => setLoading(false));
    };

    const startUp = (params?: any) => {
        service.start(props.device.id, params.id).subscribe(
            () => {
                handleSearch();
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const stop = (params?: any) => {
        service.stop(props.device.id, params.id).subscribe(
            () => {
                handleSearch();
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const removeItem = (params?: any) => {
        service.del(props.device.id, params.id).subscribe(
            () => {
                handleSearch();
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const statusMap = new Map();
    statusMap.set("enabled", 'success');
    statusMap.set("disabled", 'error');

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            ellipsis: true,
        },
        {
            title: '网关类型',
            dataIndex: 'gatewayProvider',
            width: '200px'
        },
        {
            title: '状态',
            dataIndex: 'state',
            render: (record: any) => record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : ''
        },
        {
            title: '说明',
            dataIndex: 'description',
            width: '15%',
            align: 'center',
            ellipsis: true
        },
        {
            title: '操作',
            width: '250px',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <a
                        onClick={() => {
                            setCurrentItem(record);
                            setSaveVisible(true);
                        }}
                    >
                        编辑
                </a>
                    <Divider type="vertical" />
                    {record.state && record.state.value === 'disabled' && (
                        <>
                            <a
                                onClick={() => {
                                    startUp(record);
                                }}
                            >
                                启动
                    </a>
                            <Divider type="vertical" />
                            <Popconfirm title="确认删除？" onConfirm={() => {
                                removeItem(record)
                            }
                            }>
                                <a>删除</a>
                            </Popconfirm>
                        </>
                    )}
                    {record.state && record.state.value === 'enabled' && (
                        <a
                            onClick={() => {
                                stop(record);
                            }}
                        >
                            禁用
                        </a>
                    )}
                </Fragment>
            ),
        },
    ];

    return (
        <Card>
            <div style={{marginBottom: '20px'}}>
                <Button type="primary" onClick={() => {
                    setSaveVisible(true);
                    setCurrentItem({});
                }}><Icon type="plus" />创建复合网关</Button>
            </div>
            <div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={result}
                    rowKey="id"
                    pagination={false}
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

export default Form.create<Props>()(CompositeGateway);
