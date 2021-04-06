import React, { useEffect, useState } from 'react';
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import SceneImg from '@/pages/rule-engine/scene/img/scene.svg';
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from 'antd';
import Service from "../service";
import SceneSave from './save';
// import Detail from './detail';
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
    device: any
}

const Scene: React.FC<Props> = props => {
    const service = new Service('rule-engine');
    const [result, setResult] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    // const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [sceneData, setSceneData] = useState<any>({});
    const [searchParam, setSearchParam] = useState({ pageSize: 8, sorts: { field: 'id', order: 'desc' } });

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        setLoading(true);
        service.getScenePageList(props.device.id, encodeQueryParam(params)).subscribe(
            (res) => { setResult(res) },
            () => {
            },
            () => setLoading(false))
    };

    const triggerType = new Map();
    triggerType.set("manual", '手动触发')
    triggerType.set("timer", '定时触发')
    triggerType.set("device", '设备触发')
    triggerType.set("scene", '场景触发')

    useEffect(() => {
        setLoading(true);
        handleSearch(searchParam);
    }, []);

    const saveData = (params?: any) => {
        service.saveScene(props.device.id, params).subscribe(
            (resp) => {
                if (resp.status === 200) {
                    message.success('保存成功！')
                    handleSearch(searchParam);
                }
            },
            () => {
            },
            () => setLoading(false))
    };

    const start = (params?: any) => {
        service.startScene(props.device.id, { id: params.id }).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const stop = (params?: any) => {
        service.stopScene(props.device.id, { id: params.id }).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    const handleDelete = (params?: any) => {
        service.delScene(props.device.id, { id: params.id }).subscribe(
            () => {
                handleSearch(searchParam);
                message.success('操作成功！');
            },
            () => {
            },
            () => setLoading(false))
    };

    return (
        <Card title="场景联动" extra={
            <Button type="primary" onClick={() => {
                setSaveVisible(true);
                setSceneData({});
            }}><Icon type="plus" />创建场景联动</Button>
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
                                                        setSaveVisible(true);
                                                        setSceneData(item);
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="seeProduct" title="重启">
                                                <Icon
                                                    type="reload"
                                                    onClick={() => {
                                                        start(item);
                                                    }}
                                                />
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
                                                                        start(item);
                                                                    } else {
                                                                        stop(item);
                                                                    }
                                                                }}
                                                            >
                                                                <Button icon={item.state?.value === 'stopped' ? 'check' : 'close'} type="link">
                                                                    {item.state?.value === 'stopped' ? '启动' : '停止'}
                                                                </Button>
                                                            </Popconfirm>
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
                                            avatar={<Avatar size={40} src={SceneImg} />}
                                            title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                                            description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                                        />
                                        <div>
                                            <div style={{ display: 'flex', marginTop: '10px' }}>
                                                <div style={{ textAlign: 'center', width: '50%', height: '60px' }}>
                                                    <p>触发方式</p>
                                                    <p style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                                                        {
                                                            item.triggers?.map((i: any) => {
                                                                return triggerType.get(i.trigger) + ' '
                                                            })
                                                        }
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'center', width: '50%' }}>
                                                    <p>场景状态</p>
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
            {saveVisible && <SceneSave
                deviceId={props.device.id}
                data={sceneData}
                close={() => {
                    setSaveVisible(false);
                    setSceneData({});
                }}
                save={(item: any) => {
                    saveData(item);
                    setSaveVisible(false);
                    setSceneData({});
                }} />
            }
        </Card>

    )
};

export default Form.create<Props>()(Scene);
