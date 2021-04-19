import React, { useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import styles from './index.less';
import { Badge, Button, Card, Divider, message, Popconfirm, Spin, Table, Tooltip } from 'antd';
import AddDevice from './addDevice';
import ChannelEdit from './channelEdit';
import Play from '../play/play';
import apis from '@/services';
import { PaginationConfig } from 'antd/lib/table';

interface Props extends FormComponentProps {
    device: any;
    edgeTag: boolean;
}

const Add: React.FC<Props> = (props) => {
    const [spin, setSpin] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [channelVisible, setChannelVisible] = useState(false);
    const [playVisible, setPlaylVisible] = useState(false);
    const [leftData, setLeftData] = useState<any>({});
    const [deviceLength, setDeviceLength] = useState(0);
    const [rightData, setRightData] = useState<any>({});
    const [deviceParams, setDeviceParams] = useState({
        pageSize: 8
    });
    const [channelParams, setChannelParams] = useState({
        pageSize: 8
    });
    const [device, setDevice] = useState({});
    const [deviceId, setDeviceId] = useState('');
    const [channel, setChannel] = useState({});

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');

    const columnsLeft = [
        {
            title: '序号',
            align: 'center',
            width: 60,
            render: (text: string, record: any, index: number) => `${index + 1}`,
        },
        {
            title: '视频设备',
            key: 'device',
            width: 300,
            align: 'center',
            render: (text: string, record: any) => (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '100%', fontWeight: 600, textAlign: 'center' }}>{record.name}</div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'rgba(0, 0, 0, 0.4)' }}>
                        <div style={{ fontSize: '10px', marginRight: '5px' }}>IP： {record.host}</div>
                        <div style={{ fontSize: '10px' }}>通道：{record.channelNumber || 0}个</div>
                    </div>
                </div>
            ),
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            align: 'center',
            width: '80px',
            render: (record: any) =>
                record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
        },
        {
            title: '协议',
            dataIndex: 'provider',
            key: 'provider',
            align: 'center',
            with: 180
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text: string, record: any) => (
                <>
                    <a onClick={() => {
                        setAddVisible(true);
                        setDevice(record);
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认删除吗？"
                        onConfirm={() => {
                            setSpin(true);
                            apis.edgeDevice.delDevice(props.device.id, { deviceId: record.id }).then(res => {
                                if (res.status === 200) {
                                    message.success('删除成功！');
                                    setSpin(false);
                                    getDevice(props.device.id, deviceParams);
                                }
                            })
                        }}>
                        <a>删除</a>
                    </Popconfirm>
                </>
            ),
        },
    ];
    const columnsRight = [
        {
            title: '序号',
            align: 'center',
            width: 60,
            render: (text: string, record: any, index: number) => `${index + 1}`,
        },
        {
            title: '通道名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 140,
            ellipsis: true,
            render: (name: string) => {
                return (
                    <Tooltip arrowPointAtCenter title={name}>{name}</Tooltip>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 100,
            render: (record: any) =>
                record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
        },
        {
            title: '通道ID',
            dataIndex: 'channelId',
            key: 'channelId',
            width: 120,
            align: 'center',
            ellipsis: true,
            render: (channelId: string) => {
                return (
                    <Tooltip arrowPointAtCenter title={channelId}>{channelId}</Tooltip>
                )
            }
        },
        {
            title: '协议',
            dataIndex: 'provider',
            key: 'provider',
            width: 100,
            align: 'center',
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (text: string, record: any) => (
                <>
                    <a onClick={() => {
                        setChannel(record);
                        setChannelVisible(true);
                    }}>编辑</a>
                    {props.edgeTag && (<>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            setChannel(record);
                            setPlaylVisible(true);
                        }}>播放</a>
                    </>)}
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认删除吗？"
                        onConfirm={() => {
                            apis.edgeDevice.delChannel(props.device.id, { channelDataId: record.id }).then(res => {
                                if (res.status === 200) {
                                    message.success('删除成功！');
                                    getChannel(props.device.id, channelParams);
                                }
                            })
                        }}>
                        <a>删除</a>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const getDevice = (id: string, params: any) => {
        setSpin(true);
        setDeviceParams(params);
        apis.edgeDevice.getDeviceList(id, params).then(res => {
            if (res.status === 200) {
                setLeftData(res.result[0]);
                setSpin(false);
                setDeviceLength(res.result[0].total)
            }
        })
    }

    const getChannel = (id: string, params: any) => {
        setChannelParams(params);
        apis.edgeDevice.getChannelList(id, params).then(res => {
            if (res.status === 200) {
                setRightData(res.result[0]);
            }
        })
    }

    const backgroundStyle = (record: any) => {
        return record.id === deviceId ? styles.clickRowStyl : '';
    }

    const saveOnvif = (fileValue: any) => {
        if (!!fileValue.id) {
            apis.edgeDevice.addOnvif(props.device.id, fileValue).then(response => {
                if (response.status === 200) {
                    message.success('保存成功！');
                }
                setSpin(false);
                getDevice(props.device.id, deviceParams);
            })
        } else {
            let param = {
                url: fileValue.url,
                username: fileValue.username,
                password: fileValue.password,
            }
            apis.edgeDevice.getOnvif(props.device.id, param).then(res => {
                if (res.status === 200) {
                    if (res.result.length > 0) {
                        let data = res.result[0];
                        let mediaProfiles = (res.result[0]?.mediaProfiles || []).map((item: any, index: number) => {
                            let ra = Math.round(Math.random() * 10000000000);
                            return {
                                name: item.name,
                                token: item.token,
                                id: `channel${index}${ra}`
                            }
                        })
                        let params = {
                            id: `device${Math.round(Math.random() * 10000000000)}`,
                            firmwareVersion: data.firmwareVersion,
                            hardwareId: data.hardwareId,
                            description: fileValue.description,
                            manufacturer: data.manufacturer,
                            mediaProfiles: mediaProfiles,
                            model: data.model,
                            name: fileValue.name || data.name,
                            password: data.password,
                            serialNumber: data.serialNumber,
                            url: data.url,
                            username: data.username
                        }
                        apis.edgeDevice.addOnvif(props.device.id, params).then(response => {
                            if (response.status === 200) {
                                message.success('保存成功！');
                            }
                            setSpin(false);
                            getDevice(props.device.id, deviceParams);
                        })
                    }
                }else{
                    setSpin(false);
                }
            })
        }
    }

    const onTableChange = (
        pagination: PaginationConfig
    ) => {
        getDevice(props.device.id, {
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize
        });
    };
    
    const onRightTableChange = (
        pagination: PaginationConfig
    ) => {
        getChannel(props.device.id, {
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize
        });
    };

    useEffect(() => {
        getDevice(props.device.id, deviceParams);
        getChannel(props.device.id, channelParams);
    }, []);

    return (
        <Spin spinning={spin}>
            <div className={styles.box}>
                <div className={styles.left}>
                    <Card title="视频设备" bordered={false} extra={
                        <div className={styles.leftTop}>
                            <div><span>已接入设备： {deviceLength}</span></div>
                            <div><Button type="primary" onClick={() => {
                                setAddVisible(true);
                                setDevice({});
                            }}>添加设备</Button></div>
                            <div>
                                <Button type="primary" onClick={() => {
                                    getDevice(props.device.id, deviceParams);
                                    setDeviceId('');
                                    getChannel(props.device.id, {
                                        pageSize: 8
                                    })
                                }}>刷新</Button>
                            </div>
                        </div>
                    }>
                        <div className={styles.leftTable}>
                            <Table rowKey="id"
                                rowClassName={backgroundStyle}
                                onRow={record => {
                                    return {
                                        onClick: () => {
                                            setDeviceId(record.id);
                                            let params = {
                                                where: `deviceId = ${record.id}`,
                                                pageSize: 8,
                                            }
                                            getChannel(props.device.id, params);
                                        }
                                    }
                                }}
                                onChange={onTableChange}
                                columns={columnsLeft}
                                dataSource={leftData?.data || []}
                                pagination={{
                                    current: leftData.pageIndex + 1,
                                    total: leftData.total,
                                    pageSize: leftData.pageSize
                                }}
                            />
                        </div>
                    </Card>

                </div>
                <div className={styles.right}>
                    <Card title="视频通道" bordered={false} extra={
                        <Button type="primary" onClick={() => {
                            getChannel(props.device.id, {
                                where: `deviceId = ${deviceId}`,
                                pageSize: 8
                            })
                        }}>刷新</Button>
                    }>
                        <div className={styles.rightTable}>
                            <Table rowKey="id" onChange={onRightTableChange} columns={columnsRight} dataSource={rightData?.data || []}
                                pagination={{
                                    current: rightData.pageIndex + 1,
                                    total: rightData.total,
                                    pageSize: rightData.pageSize
                                }}
                            />
                        </div>
                    </Card>
                </div>
                {addVisible && <AddDevice
                    deviceId={props.device.id}
                    close={() => { setAddVisible(false) }}
                    data={{ ...device }}
                    save={(data: any) => {
                        setSpin(true);
                        saveOnvif(data);
                        setAddVisible(false);
                    }} />}
                {channelVisible && <ChannelEdit id={props.device.id}
                    close={() => { setChannelVisible(false) }}
                    data={{ ...channel }}
                    save={() => {
                        setChannelVisible(false);
                        getChannel(props.device.id, channelParams);
                    }}
                />}
                {playVisible && <Play
                    close={() => { setPlaylVisible(false) }}
                    data={{ ...channel }}
                    deviceId={props.device.id}
                    save={() => { setPlaylVisible(false); }} />}
            </div>
        </Spin>
    )
};

export default Form.create<Props>()(Add);
