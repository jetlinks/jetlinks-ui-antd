import TagSelect from '@/pages/notice/components/tag-select';
import React, { useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import DeviceAlarm from "@/pages/rule-engine/instance/img/DeviceAlarm.png";
import NodeRed from "@/pages/rule-engine/instance/img/NodeRed.png";
import SceneImg from '@/pages/rule-engine/scene/img/scene.svg';
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from 'antd';
import Service from "./service";
import Save from './save/index';
import SceneSave from "./scene-save";
import AlarmSave from '../alarm/save';
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
    device: any
}

const RuleEngine: React.FC<Props> = props => {
    const service = new Service('rule-engine');
    const [result, setResult] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [sceneSaveVisible, setSceneSaveVisible] = useState<boolean>(false);
    const [alarmSaveVisible, setAlarmSaveVisible] = useState<boolean>(false);
    const [sceneData, setSceneData] = useState<any>({});
    const [alarmData, setAlarmData] = useState<any>({});
    const [ruleData, setRuleData] = useState<any>({});
    const [searchParam, setSearchParam] = useState({ paging: false });

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        setLoading(true);
        service.getRuleInstanceList(props.device.id, encodeQueryParam(params)).subscribe(
            (res) => { setResult(res) },
            () => {
            },
            () => setLoading(false))
    };

    const modelType = new Map();
    modelType.set('device_alarm', '设备告警');
    modelType.set('node-red', '规则编排');
    modelType.set('rule-scene', '场景联动');

    const logoMap = {
        'device_alarm': <Avatar size={40} src={DeviceAlarm} />,
        'node-red': <Avatar size={40} src={NodeRed} />,
        'rule-scene': <Avatar size={40} src={SceneImg} />
    }

    useEffect(() => {
        setLoading(true);
        handleSearch(searchParam);
    }, []);

    const startInstance = (params?: any) => {
        service.startRuleInstance(props.device.id, params.id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const stopInstance = (params?: any) => {
        service.stopRuleInstance(props.device.id, params.id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const handleDelete = (params?: any) => {
        service.delRuleInstance(props.device.id, params.id).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    return (
        <div>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '20px' }}>类型:</div>
                        <TagSelect
                            onChange={(value: any[]) => {
                                if (value.length === 0) {
                                    handleSearch({ paging: false });
                                } else {
                                    handleSearch({
                                        paging: false,
                                        'where': `modelType in ${value}`
                                    })
                                };
                            }}
                        >
                            <TagSelect.Option key="node-red" value="node-red">规则实例</TagSelect.Option>
                            <TagSelect.Option key="device_alarm" value="device_alarm">设备告警</TagSelect.Option>
                            <TagSelect.Option key="rule-scene" value="rule-scene">场景联动</TagSelect.Option>
                        </TagSelect>
                    </div>
                }
                extra={
                    <Button type="primary" onClick={() => {
                        setSaveVisible(true);
                    }}><Icon type="plus" />创建规则实例</Button>
                }
            >
                {result.data && (
                    <List<any>
                        rowKey="id"
                        loading={loading}
                        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                        dataSource={(result || {}).data}
                        pagination={false}
                        renderItem={item => {
                            if (item && item.id) {
                                return (
                                    <List.Item key={item.id}>
                                        <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                            actions={[
                                                <Tooltip key="update" title='编辑'>
                                                    <Icon
                                                        type="edit"
                                                        onClick={() => {
                                                            if (item.modelType === 'node-red') {
                                                                window.open(`/jetlinks/rule-editor/index.html?edgeDeviceId=${props.device.id}#flow/${item.id}`)
                                                            } else if (item.modelType === 'rule-scene') {
                                                                setSceneData(item);
                                                                setSceneSaveVisible(true);
                                                            } else if (item.modelType === 'device_alarm') {
                                                                setAlarmData(item);
                                                                setAlarmSaveVisible(true);
                                                            }
                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip key="reload" title="重启">
                                                    <Icon
                                                        type="reload"
                                                        onClick={() => {
                                                            startInstance(item);
                                                        }} />
                                                </Tooltip>,
                                                <Tooltip key="more_actions" title=''>
                                                    <Dropdown overlay={
                                                        <Menu>
                                                            <Menu.Item key="1">
                                                                <Popconfirm
                                                                    placement="topRight"
                                                                    title={item.state?.value === 'stopped' ? '确认启动？' : '确认停止？'}
                                                                    onConfirm={() => {
                                                                        if (item.state?.value === 'stopped') {
                                                                            startInstance(item);
                                                                        } else {
                                                                            stopInstance(item);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Button icon={item.state?.value === 'stopped' ? 'check' : 'close'} type="link">
                                                                        {item.state?.value === 'stopped' ? '启动' : '停止'}
                                                                    </Button>
                                                                </Popconfirm>
                                                            </Menu.Item>
                                                            {item.modelType === 'node-red' && (
                                                                <Menu.Item key="4">
                                                                    <Button icon="copy" type="link"
                                                                        onClick={() => {
                                                                            setRuleData(item);
                                                                            setSaveVisible(true);
                                                                        }}>
                                                                        复制
                                                                    </Button>
                                                                </Menu.Item>
                                                            )}
                                                            {item.state?.value === 'stopped' && (
                                                                <Menu.Item key="2">
                                                                    <Popconfirm
                                                                        placement="topRight"
                                                                        title="确定删除此组件吗？"
                                                                        onConfirm={() => {
                                                                            handleDelete(item);
                                                                        }}
                                                                    >
                                                                        <Button icon="delete" type="link">
                                                                            删除
                                                                    </Button>
                                                                    </Popconfirm>
                                                                </Menu.Item>
                                                            )}
                                                        </Menu>
                                                    }>
                                                        <Icon type="ellipsis" />
                                                    </Dropdown>
                                                </Tooltip>,
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={logoMap[item.modelType]}
                                                title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                                                description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                                            />
                                            <div>
                                                <div style={{ display: 'flex', marginTop: '10px' }}>
                                                    <div style={{ textAlign: 'center', width: '50%' }}>
                                                        <p>规则类型</p>
                                                        <p style={{ fontSize: 14 }}>
                                                            {modelType.get(item.modelType)}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '50%' }}>
                                                        <p>状态</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                                                            <Badge color={item.state?.value === 'stopped' ? 'red' : 'green'}
                                                                text={item.state?.value === 'stopped' ? '已停止' : '已启动'} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }
                            return '';
                        }}
                    />
                )}
                {saveVisible && <Save
                    data={ruleData}
                    close={() => {
                        setSaveVisible(false);
                    }}
                    deviceId={props.device.id}
                    save={(item: any) => {
                        setSaveVisible(false);
                        if (item.instanceType === 'device_alarm') {
                            let param: any = {...item};
                            param.instanceType = undefined;
                            service.saveAlarms(props.device.id, param).subscribe(
                                (resp) => {
                                    if (resp.status === 200) {
                                        message.success('保存成功！');
                                        handleSearch(searchParam);
                                    }
                                },
                                () => {
                                },
                                () => setLoading(false));
                        } else if (item.instanceType === 'node-red') {
                            service.saveRuleInstance(props.device.id, {
                                name: item.name,
                                description: item.description
                            }).subscribe(
                                () => {
                                    message.success('保存成功！');
                                    handleSearch(searchParam);
                                },
                                () => {
                                },
                                () => setLoading(false));
                        } else if (item.instanceType === 'rule-scene') {
                            let param: any = {...item};
                            param.instanceType = undefined;
                            service.saveScene(props.device.id, param).subscribe(
                                (resp) => {
                                    if (resp.status === 200) {
                                        message.success('保存成功！');
                                        handleSearch(searchParam);
                                    }
                                },
                                () => {
                                },
                                () => setLoading(false))
                        }
                    }} />
                }
                {sceneSaveVisible && <SceneSave
                    deviceId={props.device.id}
                    data={sceneData}
                    close={() => {
                        setSceneSaveVisible(false);
                    }}
                    save={(item: any) => {
                        service.saveScene(props.device.id, item).subscribe(
                            (resp) => {
                                if (resp.status === 200) {
                                    message.success('保存成功！');
                                    handleSearch(searchParam);
                                }
                            },
                            () => {
                            },
                            () => setLoading(false))
                        setSceneSaveVisible(false);
                        setSceneData({});
                    }} />
                }
                {alarmSaveVisible && <AlarmSave
                    deviceId={props.device.id}
                    data={{ ...JSON.parse(alarmData.modelMeta || '[]') }}
                    close={() => {
                        setAlarmSaveVisible(false);
                    }}
                    save={(item: any) => {
                        service.saveAlarms(props.device.id, item).subscribe(
                            (resp) => {
                                if (resp.status === 200) {
                                    message.success('保存成功！');
                                    handleSearch(searchParam);
                                }
                            },
                            () => {
                            },
                            () => setLoading(false));
                        setAlarmSaveVisible(false);
                        setAlarmData({});
                    }}
                />
                }
            </Card>
        </div>

    )
};

export default Form.create<Props>()(RuleEngine);

