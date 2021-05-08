import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PaginationConfig } from 'antd/es/table';
import { Card, Table, Badge, Tree, Divider, Button, message, Popconfirm, Spin, Dropdown, Icon, Menu, Modal, Tooltip, List } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import style from './index.less';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import ChannelSave from './save/channel-save';
import BindSave from './save/bind-save';
import PointSave from './save/point-save';
import Import from './operation/import';
import Export from './operation/export';
import BindDevice from './operation/bind-device';
import SearchForm from '@/components/SearchForm';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
    certificate: any;
    location: Location;
    loading: boolean;
}

interface State {
    searchParam: any;
    searchPointParam: any;
    channelSaveVisible: boolean;
    bindSaveVisible: boolean;
    pointSaveVisible: boolean;
    pointVisible: boolean;
    bindDeviceVisible: boolean;
    currentChannel: any;
    currentBind: any;
    currentPoint: any;
    result: any;
    resultPoint: any;
    dataListNoPaing: any[];
    opcId: string;
    deviceId: string;
    propertyList: any[];
    selectedRowKeys: any[];
}

const OpcUaComponent: React.FC<Props> = props => {

    const initState: State = {
        searchParam: { pageSize: 10 },
        searchPointParam: { pageSize: 10 },
        pointVisible: false,
        bindSaveVisible: false,
        pointSaveVisible: false,
        channelSaveVisible: false,
        bindDeviceVisible: false,
        currentChannel: {},
        currentBind: {},
        currentPoint: {},
        result: {},
        resultPoint: {},
        dataListNoPaing: [],
        opcId: '',
        deviceId: '',
        propertyList: [],
        selectedRowKeys: []
    };

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [searchPointParam, setSearchPointParam] = useState(initState.searchPointParam);
    const [result, setResult] = useState(initState.result);
    const [resultPoint, setResultPoint] = useState(initState.resultPoint);
    const [pointVisible, setPointVisible] = useState(initState.pointVisible);
    const [channelSaveVisible, setChannelSaveVisible] = useState(initState.channelSaveVisible);
    const [bindSaveVisible, setBindSaveVisible] = useState(initState.bindSaveVisible);
    const [pointSaveVisible, setPointSaveVisible] = useState(initState.pointSaveVisible);
    const [bindDeviceVisible, setBindDeviceVisible] = useState(initState.bindDeviceVisible);
    const [currentChannel, setCurrentChannel] = useState(initState.currentChannel);
    const [currentBind, setCurrentBind] = useState(initState.currentBind);
    const [currentPoint, setCurrentPoint] = useState(initState.currentPoint);
    const [dataListNoPaing, setDataListNoPaing] = useState(initState.dataListNoPaing);
    const [opcId, setOpcId] = useState(initState.opcId);
    const [deviceId, setDeviceId] = useState(initState.deviceId);
    const [importVisible, setImportVisible] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const [treeNode, setTreeNode] = useState<any>({});
    const [spinning, setSpinning] = useState(true);
    const [properties$, setProperties$] = useState<any>();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const wsCallback = useRef();

    const getListNoPaging = () => {
        setSpinning(true);
        apis.opcUa.listNoPaging({}).then((res: any) => {
            if (res.status === 200) {
                let data: any[] = [];
                if(res.result.length > 0){
                    res.result.map((item: any) => {
                        data.push({
                            key: item.id,
                            title: rendertitle(item),
                            isLeaf: false,
                            children: [],
                            id: item.id
                        })
                    })
                    setDataListNoPaing([...data]);
                    setOpcId(data[0].key);
                    getDeviceBindList({
                        terms: {
                            opcUaId: data[0].key
                        },
                        pageSize: 10
                    });
                }
            }
            setSpinning(false);
        })
    }

    const getDeviceBindList = (params?: any) => {
        setSpinning(true);
        setSearchParam(params);
        apis.opcUa.getDeviceBindList(encodeQueryParam(params)).then(resp => {
            setResult(resp.result);
            setSpinning(false);
        })
    }

    const getDevicePointList = (params?: any) => {
        setSpinning(true);
        // let flag = false;
        // if (params.terms.deviceId === searchPointParam.terms?.deviceId) { //判断deviceId是否发生了变化了
        //     flag = true;
        // }
        setSearchPointParam(params);
        apis.opcUa.getDevicePointList(encodeQueryParam(params)).then(resp => {
            if (resp.status === 200) {
                setResultPoint(resp.result);
                propertiesWs(params.terms.deviceId, resp.result);
            }
            setSpinning(false);
        })
    }

    useEffect(() => {
        getListNoPaging();
    }, []);

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');
    statusMap.set('online', 'success');
    statusMap.set('offline', 'error');
    statusMap.set('notActive', 'processing');
    statusMap.set('enabled', 'success');
    statusMap.set('disabled', 'error');
    statusMap.set('disconnected', 'processing');

    const onTableChange = (
        pagination: PaginationConfig,
        filters: any,
    ) => {
        let { terms } = searchParam;
        if (filters.state) {
            if (terms) {
                terms.state = filters.state[0];
            } else {
                terms = {
                    state: filters.state[0],
                };
            }
        }
        getDeviceBindList({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms
        });
    };

    const onTablePointChange = (
        pagination: PaginationConfig,
        filters: any
    ) => {
        let { terms } = searchPointParam;
        if (filters.sate) {
            if (terms) {
                terms.sate = filters.sate[0];
            } else {
                terms = {
                    sate: filters.sate[0]
                };
            }
        }
        getDevicePointList({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchPointParam.terms
        });
    };

    const rendertitle = (item: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '130px', overflow: 'hidden', marginRight: '10px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Tooltip title={item.name}>
                    {item.name}
                </Tooltip>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginRight: '10px' }} onClick={() => {
                    setCurrentChannel(item);
                    setChannelSaveVisible(true);
                }}><a>编辑</a></div>
                <div style={{ marginRight: '10px' }} onClick={() => {
                    setBindDeviceVisible(true);
                }}><a>绑定设备</a></div>
                {item.state.value === 'disabled' ?
                    <div onClick={() => {
                        apis.opcUa.start(item.id).then(res => {
                            if (res.status === 200) {
                                getListNoPaging();
                                message.success('操作成功！');
                            }
                        })
                    }}><a>启用</a></div> :
                    <div onClick={() => {
                        apis.opcUa.stop(item.id).then(res => {
                            getListNoPaging();
                            message.success('操作成功！');
                        })
                    }}><a>禁用</a></div>}
            </div>
        </div>
    )
    //绑定设备
    const columns = [
        {
            title: '设备ID',
            align: 'center',
            dataIndex: 'deviceId'
        },
        {
            title: '设备名称',
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '产品名称',
            align: 'center',
            dataIndex: 'productName'
        },
        {
            title: '集群节点',
            align: 'center',
            dataIndex: 'serverId'
        },
        {
            title: '采集状态',
            align: 'center',
            dataIndex: 'state',
            render: (record: any) => record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '/',
            filters: [
                {
                    text: '禁用',
                    value: 'disabled',
                },
                {
                    text: '启用',
                    value: 'enabled',
                },
                {
                    text: '已断开',
                    value: 'disconnected',
                }
            ],
            filterMultiple: false,
        },
        {
            title: '操作',
            align: 'center',
            render: (text: string, record: any) => (
                <Fragment>
                    <a onClick={() => {
                        setBindSaveVisible(true);
                        setCurrentBind(record);
                    }}>编辑</a>
                    {record.state.value === 'disabled' ? <>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            apis.opcUa.startBind(record.id).then(res => {
                                if (res.status === 200) {
                                    getDeviceBindList(searchParam);
                                    message.success('操作成功！');
                                }
                            })
                        }}>开始采集</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确认删除？" onConfirm={() => {
                            apis.opcUa.removeBind(record.id).then(res => {
                                if (res.status === 200) {
                                    getDeviceBindList(searchParam);
                                    if (treeNode !== {}) {
                                        onLoadData(treeNode);
                                    }
                                    message.success('操作成功！');
                                }
                            })
                        }}>
                            <a>解绑</a>
                        </Popconfirm>
                    </> : <>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            apis.opcUa.stopBind(record.id).then(res => {
                                if (res.status === 200) {
                                    getDeviceBindList(searchParam);
                                    message.success('操作成功！');
                                }
                            })
                        }}>停止采集</a>
                    </>}
                    <Divider type="vertical" />
                    <a onClick={() => {
                        setDeviceId(record.deviceId);
                        getDevicePointList({
                            pageSize: 10,
                            terms: {
                                deviceId: record.deviceId
                            }
                        });
                        setPointVisible(true);
                    }}>查看点位</a>
                </Fragment>
            ),
        }
    ];

    const columnsPoint = [
        {
            title: '名称',
            align: 'center',
            width: '150px',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '设备ID',
            align: 'center',
            width: '100px',
            ellipsis: true,
            dataIndex: 'deviceId'
        },
        {
            title: 'OPC点位ID',
            align: 'center',
            width: '200px',
            ellipsis: true,
            dataIndex: 'opcPointId',
            render: (text: any) => <Tooltip title={text}>{text}</Tooltip>
        },
        {
            title: '数据模式',
            width: '100px',
            align: 'center',
            ellipsis: true,
            dataIndex: 'dataMode'
        },
        {
            title: '数据类型',
            align: 'center',
            width: '100px',
            ellipsis: true,
            dataIndex: 'dataType'
        },
        {
            title: '值',
            align: 'center',
            width: '100px',
            ellipsis: true,
            dataIndex: 'value',
            render: (text: any) => <Tooltip title={text}>{text}</Tooltip>
        },
        {
            title: '点位状态',
            align: 'center',
            width: '100px',
            dataIndex: 'sate',
            render: (text: any) => <Badge status={text === 'good' ? 'success' : 'error'}
                text={text === 'good' ? '正常' : '停止'} />,
            filters: [
                {
                    text: '正常',
                    value: 'good',
                },
                {
                    text: '停止',
                    value: 'failed',
                }
            ],
            filterMultiple: false,
        },
        {
            title: '说明',
            align: 'center',
            width: '100px',
            ellipsis: true,
            dataIndex: 'description'
        },
        {
            title: '操作',
            align: 'center',
            width: '200px',
            render: (text: string, record: any) => (
                <Fragment>
                    <a onClick={() => {
                        setPointSaveVisible(true);
                        setCurrentPoint(record);
                    }}>编辑</a>
                    {record.sate === 'good' ?
                        <>
                            <Divider type="vertical" />
                            <a onClick={() => {
                                stopPoint([record.id]);
                            }}>停止</a>
                        </> :
                        <>
                            <Divider type="vertical" />
                            <a onClick={() => {
                                startPoint([record.id])
                            }}>启动</a>
                            <Divider type="vertical" />
                            <Popconfirm
                                placement="topRight"
                                title="确定删除吗？"
                                onConfirm={() => {
                                    apis.opcUa.delPoint(record.id).then(res => {
                                        if (res.status === 200) {
                                            getDevicePointList(searchPointParam);
                                        }
                                    })
                                }}
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </>
                    }
                </Fragment>
            ),
        },
    ];

    const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
        return list.map((node: any) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            } else if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }
            return node;
        });
    };

    const onLoadData = (treeNode: any) => {
        const { eventKey, isLeaf } = treeNode.props;
        return new Promise<void>(resolve => {
            if (isLeaf) {
                resolve();
                return;
            }
            apis.opcUa.getDeviceBindListNoPaging(encodeQueryParam({
                terms: {
                    opcUaId: eventKey
                }
            })).then(resp => {
                let children1: any[] = [];
                resp.result.map((item: any) => {
                    children1.push({
                        key: item.id,
                        title: item.name,
                        isLeaf: true,
                        id: item.deviceId,
                        children: []
                    })
                })
                setDataListNoPaing(origin => updateTreeData(origin, eventKey, children1));
                resolve();
            })
        });
    }

    const propertiesWs = (deviceId: string, result: any) => {
        if (properties$) {
            properties$.unsubscribe();
        }
        let points: any[] = []
        result.data.map((item: any) => {
            points.push(item.property)
        })
        let str = points.join("-");
        let propertiesWs = getWebsocket(
            // `${deviceId}-opc-ua-device-point-value`,
            // `/device/*/${deviceId}/message/property/report`,
            // {},
            `${deviceId}-opc-ua-device-point-value-${str}`,
            `/opc-ua-point-value/${deviceId}`,
            {
                points: points
            }
        ).subscribe((resp: any) => {
            const { payload } = resp;
            let resultList = [...result.data];
            resultList.map((item: any) => {
                if (payload.properties[item.property] !== undefined) {
                    item.value = payload.properties[item.property].toString()
                }
            })
            setResultPoint({
                data: [...resultList],
                pageIndex: result.pageIndex,
                pageSize: result.pageSize,
                total: result.total
            })
        },
            () => { setResultPoint(result) },
            () => { setResultPoint(result) });
        setProperties$(propertiesWs);
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const stopPoint = (list: any[]) => {
        apis.opcUa.stopPoint(deviceId, [...list]).then(res => {
            if (res.status === 200) {
                getDevicePointList(searchPointParam);
            }
        })
    }

    const startPoint = (list: any[]) => {
        apis.opcUa.startPoint(deviceId, [...list]).then(res => {
            if (res.status === 200) {
                getDevicePointList(searchPointParam);
            }
        })
    }

    useEffect(() => {
        wsCallback.current = properties$;
    })

    useEffect(() => {
        return () => {
            let properties = wsCallback.current;
            properties && properties.unsubscribe();
        }
    }, []);

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button
                    icon="download"
                    type="default"
                    onClick={() => {
                        setExportVisible(true);
                    }}
                >
                    批量导出设备
            </Button>
            </Menu.Item>
            <Menu.Item key="2">
                <Button
                    icon="upload"
                    onClick={() => {
                        setImportVisible(true);
                    }}
                >
                    批量导入设备
            </Button>
            </Menu.Item>
            <Menu.Item key="5">
                <Button icon="check-circle" type="danger" onClick={() => {
                    Modal.confirm({
                        title: `确认全部开始采集`,
                        okText: '确定',
                        okType: 'primary',
                        cancelText: '取消',
                        onOk() {
                            apis.opcUa.startAllDevice(opcId).then(res => {
                                if (res.status === 200) {
                                    message.success('操作成功！');
                                    getDeviceBindList({
                                        terms: {
                                            opcUaId: opcId
                                        },
                                        pageSize: 10
                                    });
                                }
                            })
                        },
                    });
                }}>全部开始采集</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <Spin spinning={spinning}>
            <PageHeaderWrapper title="OPC UA">
                <Card bordered={false}>
                    <div className={style.box}>
                        <Card style={{ width: '350px' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', margin: '0px 10px 20px 0px' }}>
                                <Button style={{ width: '100%' }} icon="plus" type="dashed" onClick={() => {
                                    setChannelSaveVisible(true);
                                    setCurrentChannel({});
                                }}>新增</Button>
                            </div>
                            <div style={{ width: '320px', height: '650px', overflowY: 'scroll' }}>
                                <Tree
                                    showIcon
                                    defaultExpandAll
                                    treeData={dataListNoPaing}
                                    loadData={onLoadData}
                                    onSelect={(key, e) => {
                                        if (key.length > 0) {
                                            setTreeNode(e.node);
                                            const { isLeaf, id } = e.node.props;
                                            if (isLeaf) {
                                                setDeviceId(id);
                                                getDevicePointList({
                                                    pageSize: 10,
                                                    terms: {
                                                        deviceId: id
                                                    }
                                                });
                                                setPointVisible(true);
                                            } else {
                                                setOpcId(id);
                                                getDeviceBindList({
                                                    pageSize: 10,
                                                    terms: {
                                                        opcUaId: id
                                                    }
                                                });
                                                setPointVisible(false);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </Card>
                        <Card style={{ width: 'calc(100% - 360px)' }}>
                            <div className={styles.tableList}>
                                <div className={styles.StandardTable}>
                                    {pointVisible ?
                                        <>
                                            <div style={{ width: '100%' }}>
                                                <SearchForm
                                                    search={(params: any) => {
                                                        getDevicePointList({ terms: { ...params, deviceId: deviceId }, pageSize: 10 });
                                                    }}
                                                    formItems={[
                                                        {
                                                            label: 'OPC点位ID',
                                                            key: 'opcPointId$LIKE',
                                                            type: 'string'
                                                        },
                                                        {
                                                            label: '点位名称',
                                                            key: 'name$LIKE',
                                                            type: 'string'
                                                        }
                                                    ]}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
                                                <div style={{ marginRight: '10px' }}><Button icon="plus" type="primary" onClick={() => {
                                                    setPointSaveVisible(true);
                                                    setCurrentPoint({});
                                                }}>新增</Button></div>
                                                {selectedRowKeys.length > 0 &&
                                                    <>
                                                        <div style={{ marginRight: '10px' }}>
                                                            <Button
                                                                icon="check-circle"
                                                                type="default"
                                                                onClick={() => {
                                                                    startPoint(selectedRowKeys);
                                                                }}
                                                            >
                                                                批量启动点位
                                                            </Button>
                                                        </div>
                                                        <div style={{ marginRight: '10px' }}>
                                                            <Button
                                                                icon="stop"
                                                                type="danger"
                                                                ghost
                                                                onClick={() => {
                                                                    stopPoint(selectedRowKeys);
                                                                }}
                                                            >
                                                                批量停止点位
                                                             </Button>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            <Table
                                                loading={props.loading}
                                                dataSource={(resultPoint || {}).data}
                                                columns={columnsPoint}
                                                rowKey="id"
                                                onChange={onTablePointChange}
                                                rowSelection={{
                                                    type: 'checkbox',
                                                    ...rowSelection,
                                                }}
                                                pagination={{
                                                    current: resultPoint.pageIndex + 1,
                                                    total: resultPoint.total,
                                                    pageSize: resultPoint.pageSize
                                                }}
                                            />
                                        </> :
                                        <>
                                            <div style={{ display: 'flex', marginBottom: '20px', width: '100%', flexWrap: 'wrap' }}>
                                                <div style={{ width: '100%' }}>
                                                    <SearchForm
                                                        search={(params: any) => {
                                                            getDeviceBindList({ terms: { ...params, opcUaId: opcId }, pageSize: 10 });
                                                        }}
                                                        formItems={[
                                                            {
                                                                label: '设备ID',
                                                                key: 'deviceId$LIKE',
                                                                type: 'string'
                                                            },
                                                            // {
                                                            //     label: '设备名称',
                                                            //     key: 'name$LIKE',
                                                            //     type: 'string'
                                                            // }
                                                        ]}
                                                    />
                                                </div>
                                                <div style={{ marginRight: '20px' }}><Button type="primary" icon="plus" onClick={() => {
                                                    setBindSaveVisible(true);
                                                    setCurrentBind({});
                                                }}>新增设备</Button></div>
                                                <Dropdown overlay={menu}>
                                                    <Button icon="menu">
                                                        其他批量操作
                                                        <Icon type="down" />
                                                    </Button>
                                                </Dropdown>
                                            </div>
                                            <Table
                                                loading={props.loading}
                                                dataSource={(result || {}).data}
                                                columns={columns}
                                                rowKey="id"
                                                onChange={onTableChange}
                                                pagination={{
                                                    current: result.pageIndex + 1,
                                                    total: result.total,
                                                    pageSize: result.pageSize
                                                }}
                                            />
                                        </>}
                                </div>
                            </div>
                        </Card>
                    </div>
                </Card>
                {channelSaveVisible && <ChannelSave data={currentChannel} close={() => {
                    setChannelSaveVisible(false);
                }} save={(data: any) => {
                    if (currentChannel.id) {
                        apis.opcUa.updata(data).then(res => {
                            if (res.status === 200) {
                                message.success('保存成功！');
                                getListNoPaging();
                            }
                            setChannelSaveVisible(false);
                        })
                    } else {
                        apis.opcUa.save(data).then(res => {
                            if (res.status === 200) {
                                message.success('保存成功！');
                                getListNoPaging();
                            }
                            setChannelSaveVisible(false);
                        })
                    }
                }} />}
                {pointSaveVisible && <PointSave data={currentPoint}
                    deviceId={deviceId}
                    close={() => {
                        setPointSaveVisible(false);
                    }} save={(data: any) => {
                        setPointSaveVisible(false);
                        apis.opcUa.savePoint(data).then(res => {
                            if (res.status === 200) {
                                message.success('保存成功！');
                                getDevicePointList({
                                    pageSize: 10,
                                    terms: {
                                        deviceId: deviceId
                                    }
                                });
                            }
                        })
                    }} />}
                {bindSaveVisible && <BindSave data={currentBind} close={() => {
                    setBindSaveVisible(false);
                }} opcId={opcId} save={() => {
                    setBindSaveVisible(false);
                    if (treeNode !== {}) {
                        onLoadData(treeNode);
                    }
                    getDeviceBindList(searchParam);
                }} />}
                {importVisible && (
                    <Import
                        opcId={opcId}
                        close={() => {
                            setImportVisible(false);
                            if (treeNode !== {}) {
                                onLoadData(treeNode);
                            }
                            getDeviceBindList({
                                pageSize: 10,
                                terms: {
                                    opcUaId: opcId
                                }
                            });
                        }}
                    />
                )}
                {exportVisible && (
                    <Export
                        searchParam={searchParam}
                        close={() => {
                            setExportVisible(false);
                        }}
                    />
                )}
                {bindDeviceVisible && <BindDevice opcId={opcId}
                    close={() => {
                        setBindDeviceVisible(false);
                        if (treeNode !== {}) {
                            onLoadData(treeNode);
                        }
                        getDeviceBindList({
                            pageSize: 10,
                            terms: {
                                opcUaId: opcId
                            }
                        });
                    }} />}
            </PageHeaderWrapper>
        </Spin>
    );
};
export default OpcUaComponent;
