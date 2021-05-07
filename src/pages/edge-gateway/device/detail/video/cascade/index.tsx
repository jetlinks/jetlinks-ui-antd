import { Badge, Button, Card, Divider, Icon, message, Popconfirm } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import styles from '@/utils/table.less';
import Table, { ColumnProps } from "antd/lib/table";
import Service from "./service";
import encodeQueryParam from "@/utils/encodeParam";
import SaveCascade from "./save/index";
import ChoiceChannel from './channel/index';

interface Props {
    device: any
}

interface State {
    searchParam: any;
}

const initState: State = {
    searchParam: { pageSize: 10, sorts: { field: 'id', order: 'desc' } },
};
const MediaCascade: React.FC<Props> = props => {
    const service = new Service('media/gb-cascade');
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>([]);
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [choiceVisible, setChoiceVisible] = useState<boolean>(false);
    const [mediaCascade, setMediaCascade] = useState<any>({});
    const [cascadeId, setCascadeId] = useState<string>('');

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const statusMap = new Map();
    statusMap.set('enabled', 'success');
    statusMap.set('disabled', 'error');

    const onlineStatusMap = new Map();
    onlineStatusMap.set('online', 'success');
    onlineStatusMap.set('offline', 'error');

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        setLoading(true);
        service.getCascadeList(props.device.id, encodeQueryParam(params)).subscribe(
            (res) => { setResult(res) },
            () => {
            },
            () => setLoading(false))
    };
    
    const columns: ColumnProps<any>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '是否启用',
            dataIndex: 'status',
            width: 120,
            render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '/',
            filters: [
                {
                    text: '禁用',
                    value: 'disabled',
                },
                {
                    text: '启用',
                    value: 'enabled',
                },
            ],
            filterMultiple: false,
        },
        {
            title: '连接状态',
            dataIndex: 'onlineStatus',
            width: 120,
            render: record => record ? <Badge status={onlineStatusMap.get(record.value)} text={record.text} /> : '/',
            filters: [
                {
                    text: '在线',
                    value: 'online',
                },
                {
                    text: '离线',
                    value: 'offline',
                },
            ],
            filterMultiple: false,
        },
        {
            title: '集群节点ID',
            dataIndex: 'sipConfigs[0].clusterNodeId',
            ellipsis: true,
        },
        {
            title: 'SIP服务国标编号',
            dataIndex: 'sipConfigs[0].sipId',
            ellipsis: true,
        },
        {
            title: 'SIP服务IP',
            dataIndex: 'sipConfigs[0].remoteAddress',
            ellipsis: true,
        },
        {
            title: 'SIP服务域',
            dataIndex: 'sipConfigs[0].domain',
            ellipsis: true,
        },
        {
            title: 'SIP服务端口',
            dataIndex: 'sipConfigs[0].remotePort',
            ellipsis: true,
        },
        {
            title: '设备国标编号',
            dataIndex: 'sipConfigs[0].user',
            ellipsis: true,
        },
        {
            title: '注册周期(秒)',
            dataIndex: 'sipConfigs[0].registerInterval',
            ellipsis: true,
        },
        {
            title: '心跳周期(秒)',
            dataIndex: 'sipConfigs[0].keepaliveInterval',
            ellipsis: true,
        },
        {
            title: '传输信令',
            dataIndex: 'sipConfigs[0].transport',
            ellipsis: true,
        },
        {
            title: '字符集',
            dataIndex: 'sipConfigs[0].charset',
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'center',
            fixed: 'right',
            width: '10%',
            render: (record: any) => (
                <Fragment>
                    <a
                        onClick={() => {
                            setSaveVisible(true);
                            setMediaCascade(record);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            setChoiceVisible(true);
                            setCascadeId(record.id);
                        }}
                    >
                        选择通道
                    </a>
                    {record.status.value === 'disabled' ? (
                        <>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确认启用该级联吗？"
                                onConfirm={() => {
                                    setLoading(true);
                                    service._enabled(props.device.id, { id: record.id }).subscribe(() => {
                                        message.success('启用成功');
                                        handleSearch(searchParam);
                                    },
                                        () => {
                                            message.error('启用失败');
                                        },
                                        () => setLoading(false))
                                }}>
                                <a>启用</a>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确认删除该级联吗？"
                                onConfirm={() => {
                                    service.removeCascade(props.device.id, record.id).subscribe(() => {
                                        message.success("删除成功");
                                        handleSearch(searchParam);
                                    },
                                        () => {
                                            message.error("删除失败");
                                        },
                                        () => setLoading(false))
                                }}>
                                <a>删除</a>
                            </Popconfirm>
                        </>
                    ) : (
                        <>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确认禁用该级联吗？"
                                onConfirm={() => {
                                    setLoading(true);
                                    service._disabled(props.device.id, { id: record.id }).subscribe(() => {
                                        message.success('禁用成功');
                                        handleSearch(searchParam);
                                    },
                                        () => {
                                            message.error('禁用失败');
                                        },
                                        () => setLoading(false))
                                }}>
                                <a>禁用</a>
                            </Popconfirm>
                        </>
                    )}
                </Fragment>
            )
        },
    ];
    return (
        <div style={{ marginTop: '20px' }}>
            <Card>
                <div style={{marginBottom: '20px'}}>
                    <Button type="primary" onClick={() => {
                        setSaveVisible(true);
                        setMediaCascade({});
                    }}><Icon type="plus" />新增国标级联</Button>
                </div>
                <div className={styles.StandardTable}>
                    <Table
                        loading={loading}
                        dataSource={result}
                        columns={columns}
                        rowKey="id"
                        scroll={{ x: '150%' }}
                    />
                </div>
            </Card>
            {saveVisible &&
                <SaveCascade
                    data={mediaCascade}
                    id={props.device.id}
                    close={() => {
                        setSaveVisible(false);
                        setMediaCascade({});
                        handleSearch(searchParam);
                    }} />
            }

            {choiceVisible &&
                <ChoiceChannel
                    cascadeId={cascadeId}
                    id={props.device.id}
                    close={() => {
                        setChoiceVisible(false);
                        setCascadeId('');
                        handleSearch(searchParam);
                    }} />}
        </div>
    )
};
export default MediaCascade;
