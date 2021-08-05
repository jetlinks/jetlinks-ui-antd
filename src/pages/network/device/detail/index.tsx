import { Badge, Button, Descriptions, Icon, message, Popconfirm, Radio, Spin, Tabs, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Save from '../save';
import Service from '../service';
import moment from 'moment';
import Functions from './functions';
import Status from './status';
import Configuration from './configuration';
import { getWebsocket } from "@/layouts/GlobalWebSocket";

interface DetailProps {
    data: object;
    reBack: Function;
}

function Detail(props: DetailProps) {

    const service = new Service('/network/material');
    let deviceStatus: any;
    const [editVisible, setEditVisible] = useState(false);
    const [info, setInfo] = useState<any>(props.data);
    const [status, setStatus] = useState<any>(props.data);
    const [spinning, setSpinning] = useState<boolean>(true);
    const [type, setType] = useState<string>('card');
    const [tabKey, setTabKey] = useState<string>('1');
    const [config, setConfig] = useState<any[]>([]);
    const [updateVisible, setUpdateVisible] = useState(false);

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');
    statusMap.set('online', 'success');
    statusMap.set('offline', 'error');
    statusMap.set('notActive', 'processing');

    const initData = () => {
        setSpinning(true);
        service.getInstanceDetail(props.data.id).subscribe(resp => {
            setInfo(resp);
            setSpinning(false);
            service.getIinstanceConfigMetadata(props.data.id).subscribe(
                (resp) => {
                    setConfig(resp);
                }
            )
        })
    }

    const subscribeDeviceState = (deviceId: string) => {
        const deviceData={
            state:{},
            onlineTime:'',
            offlineTime:'',
        }
        deviceStatus && deviceStatus.unsubscribe();
        deviceStatus = getWebsocket(
          `instance-editor-info-status-${deviceId}`,
          `/dashboard/device/status/change/realTime`,
          {
            deviceId: deviceId,
          },
        ).subscribe(
          (resp: any) => {
            const { payload } = resp;
            deviceData.state = payload.value.type === 'online' ? { value: 'online', text: '在线' } : {
              value: 'offline',
              text: '离线'
            };
            if (payload.value.type === 'online') {
              deviceData.onlineTime = payload.timestamp;
            } else {
              deviceData.offlineTime = payload.timestamp;
            }
            setStatus({ ...deviceData });
          },
        );
      };

    useEffect(() => {
        initData();
        subscribeDeviceState(props.data.id);
    }, [props.data]);

    const changeDeploy = (id: string) => {
        service.deployDevice(id).subscribe(() => {
            initData();
            message.success('操作成功！');
        });
    };

    const updateData = (item?: any) => {
        setUpdateVisible(false);
        let params = {
          ...item,
          id: info.id,
          name: info.name,
          productId: info.productId,
          productName: info.productName,
        };
        service.saveDevice(params).subscribe(res => {
          if (res.status === 200) {
            message.success('配置信息修改成功');
            initData();
          }
        });
      };

    return (
        <div>
            <Spin spinning={spinning}>
                <Button style={{ marginBottom: "16px" }} onClick={() => {
                    props.reBack();
                }}>返回</Button>
                <div style={{ backgroundColor: 'white', marginBottom: '24px', padding: '14px 0px 0px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '24px', fontWeight: 600, margin: '5px 10px 19px 0px' }}>{info.name}</div>
                        <Icon type="edit" onClick={() => {
                            setEditVisible(true);
                        }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <p style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '12px' }}>ID</p>
                            <p style={{ fontSize: '24px', fontWeight: 600 }}>{info.id}</p>
                        </div>
                        <div style={{ marginLeft: '45px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>状态</p>
                            <p style={{ fontSize: '24px', fontWeight: 600 }}><Badge status={statusMap.get(status?.state?.value)} />{status?.state?.text}</p>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', marginBottom: '24px', padding: '24px' }}>
                    <Descriptions title="基本信息">
                        <Descriptions.Item label="产品名称">{info.productName}</Descriptions.Item>
                        <Descriptions.Item label="设备类型">{info.deviceType?.text}</Descriptions.Item>
                        <Descriptions.Item label="链接协议">{info.transport}</Descriptions.Item>
                        <Descriptions.Item label="消息协议">{info.protocolName}</Descriptions.Item>
                        <Descriptions.Item label="IP地址">{info.address}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="注册时间">
                            {/* {info.state?.value !== 'notActive'
                                ? moment(info.registerTime).format('YYYY-MM-DD HH:mm:ss')
                                : '/'} */}
                                {moment(info.registerTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="最后上线时间">
                            {info.state?.value !== 'notActive' && !!info.onlineTime
                                ? moment(info.onlineTime).format('YYYY-MM-DD HH:mm:ss')
                                : '/'}
                                {/* {moment(info.onlineTime).format('YYYY-MM-DD HH:mm:ss')} */}
                        </Descriptions.Item>
                        <Descriptions.Item label="说明">{info.description}</Descriptions.Item>
                    </Descriptions>
                </div>
                {config && config.length > 0 && (
                    <div style={{ width: '100%', backgroundColor: 'white', marginBottom: '24px', padding: '24px' }}>
                        <Descriptions
                            title={
                                <span>配置
                                    <Icon type="edit" style={{ marginLeft: 20 }} onClick={() => {
                                        setUpdateVisible(true);
                                        console.log(config)
                                        console.log(props.data)
                                    }} />
                                    {info.state?.value != 'notActive' && (
                                        <Popconfirm
                                            title="确认重新应用该配置？"
                                            onConfirm={() => {
                                                changeDeploy(info.id);
                                            }}
                                        >
                                            <Button
                                                icon="file-done"
                                                style={{ marginLeft: 10 }}
                                                type="link"
                                                onClick={() => { }}
                                            >
                                                应用配置
                                            </Button>
                                            <Tooltip title="修改配置后需重新应用后才能生效。">
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </Popconfirm>
                                    )}

                                </span>
                            }
                        ></Descriptions>
                        {
                            config.map((i: any) => (
                                <div style={{ marginBottom: "20px" }} key={i.name}>
                                    <h3>{i.name}</h3>
                                    <Descriptions column={2} title="">
                                        {
                                            i.properties && i.properties.map((item: any) => (
                                                <Descriptions.Item
                                                    label={item.description ? (
                                                        <>
                                                            <span style={{ marginRight: '10px' }}>{item.name}</span>
                                                            <Tooltip title={item.description}>
                                                                <Icon type="question-circle-o" />
                                                            </Tooltip>
                                                        </>
                                                    ) : item.name}
                                                    span={1}
                                                    key={item.property}>
                                                    {info.configuration ? (
                                                        item.type.type === 'password' ? (
                                                            info.configuration[item.property]?.length > 0 ? '••••••' : null
                                                        ) :
                                                            info.configuration[item.property]
                                                    ) : null}
                                                </Descriptions.Item>
                                            ))
                                        }
                                    </Descriptions>
                                </div>
                            ))
                        }
                    </div>
                )}
                <div style={{ backgroundColor: 'white', marginBottom: '24px', padding: '24px' }}>
                    <Tabs tabBarExtraContent={
                        tabKey === '1' ? (
                            <div>
                                <Icon type="sync" style={{ marginRight: '20px' }} onClick={() => {
                                    message.error('此功能还在开发中');
                                }} />
                                <Radio.Group value={type} onChange={e => {
                                    setType(e.target.value);
                                }}>
                                    <Radio.Button value='table'>
                                        <Icon type="unordered-list" />
                                    </Radio.Button>
                                    <Radio.Button value='card'>
                                        <Icon type="appstore" />
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                        ) : null
                    }
                        activeKey={tabKey}
                        onChange={(value: string) => {
                            setTabKey(value);
                        }}
                    >
                        <Tabs.TabPane tab="运行状态" key="1">
                            <Status device={info} type={type} status={status} refresh={() => {
                                
                            }} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="设备功能" key="2">
                            <Functions device={info} />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Spin>
            {editVisible && <Save
                data={props.data}
                close={() => {
                    setEditVisible(false);
                }}
                save={(item: any) => {
                    service.saveDevice(item).subscribe(
                        (res) => {
                            if (res.status === 200) {
                                message.success('操作成功！');
                                initData();
                            }
                            setEditVisible(false);
                        });
                }} />
            }
            {updateVisible && (
                <Configuration
                    data={info}
                    configuration={config}
                    close={() => {
                        setUpdateVisible(false);
                    }}
                    save={(item: any) => {
                        updateData(item);
                    }}
                />
            )}
        </div>
    );
}

export default Detail;