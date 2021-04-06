import React, { useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import DeviceAlarm from "@/pages/rule-engine/instance/img/DeviceAlarm.png";
import NodeRed from "@/pages/rule-engine/instance/img/NodeRed.png";
import SqlServer from "@/pages/rule-engine/instance/img/SqlServer.png";
import SceneImg from '@/pages/rule-engine/scene/img/scene.svg';
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from 'antd';
import Service from "../service";
import Save from './save';
import SceneSave from "../scene/save";
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
    device: any
}

const RuleInstance: React.FC<Props> = props => {
    const service = new Service('rule-engine');
    const [result, setResult] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [sceneSaveVisible, setSceneSaveVisible] = useState<boolean>(false);
    // const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [sceneData, setSceneData] = useState<any>({});
    const [ruleData, setRuleData] = useState<any>({});
    const [searchParam, setSearchParam] = useState({ pageSize: 8, sorts: { field: 'id', order: 'desc' } });

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
    modelType.set('sql_rule', '数据转发');
    modelType.set('node-red', '规则编排');
    modelType.set('rule-scene', '场景联动');

    const logoMap = {
        'device_alarm': <Avatar size={40} src={DeviceAlarm} />,
        'sql_rule': <Avatar size={40} src={SqlServer} />,
        'node-red': <Avatar size={40} src={NodeRed} />,
        'rule-scene': <Avatar size={40} src={SceneImg} />
    }

    useEffect(() => {
        setLoading(true);
        handleSearch(searchParam);
    }, []);

    const saveData = (params?: any) => {
        service.saveRuleInstance(props.device.id, params).subscribe(
            () => {
                handleSearch(searchParam);
            },
            () => {
            },
            () => setLoading(false))
    };

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
        <Card title="规则实例" extra={
            <Button type="primary" onClick={() => {
                setSaveVisible(true);
                setRuleData({});
            }}><Icon type="plus" />创建规则实例</Button>
        }>
            {result.data && (
                <List<any>
                    rowKey="id"
                    loading={loading}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={(result || {}).data}
                    pagination={{
                        current: result?.pageIndex + 1,
                        total: result?.total,
                        pageSize: result?.pageSize,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        hideOnSinglePage: true,
                        pageSizeOptions: ['8', '16', '40', '80'],
                        style: { marginTop: -20 },
                        showTotal: (total: number) =>
                            `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                                result.total / result.pageSize,
                            )}页`,
                        // onChange,
                        // onShowSizeChange,
                    }}
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
                                                        }
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="seeProduct" title="复制">
                                                <Icon
                                                    type="copy"
                                                    onClick={() => {
                                                        setRuleData(item);
                                                        setSaveVisible(true);
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
                                                        <Menu.Item key="4">
                                                            <Button icon="copy" type="link"
                                                                onClick={() => {
                                                                    startInstance(item);
                                                                }}>
                                                                重启
                                                            </Button>
                                                        </Menu.Item>
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
                    setRuleData({});
                }}
                save={(item: any) => {
                    saveData(item);
                    setSaveVisible(false);
                    setRuleData({});
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
        </Card>

    )
};

export default Form.create<Props>()(RuleInstance);
