import encodeQueryParam from "@/utils/encodeParam";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Button, Card, Col, Divider, Drawer, Icon, message, Modal, Popconfirm, Row, Table, Tooltip } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import ChoiceDevice from "../group/save/bind/ChoiceDevice";
import { GroupItem } from "./data";
import Save from "./save";
import Service from "./service";
import DeviceInfo from '@/pages/device/instance/editor/index';

interface Props { }
const DeviceTree: React.FC<Props> = (props) => {

    const [data, setData] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<any>({});
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [bindVisible, setBindVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>({});
    const [searchParam, setSearchParam] = useState<any>({});
    const [parentId, setParentId] = useState<string | null>(null);
    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [device, setDevice] = useState<any>({});
    const service = new Service('device');
    const search = () => {
        service.groupTree(encodeQueryParam(searchParam)).subscribe((resp) => {
            setData(resp);
        })
    }
    useEffect(() => {
        search();
    }, []);
    const saveGroup = (item: GroupItem) => {
        service.saveGroup({ ...item, parentId }).subscribe(
            () => message.success('添加成功'),
            () => { },
            () => {
                setSaveVisible(false);
                search();
                setParentId('');
            })
    }

    const searchDevice = (item: GroupItem | any) => {
        service.groupDevice(encodeQueryParam({
            terms: {
                'id$dev-group': item.id
            }
        })).subscribe((resp) => {
            setDeviceData(resp);
            setDeviceIds(resp.data.map((item: any) => item.id))
        })
    }
    const bindDevice = () => {
        service.bindDevice(parentId!, deviceIds).subscribe(
            () => message.success('绑定成功'),
            () => message.error('绑定失败'),
            () => {
                setBindVisible(false);
                searchDevice({ id: parentId });
            })
    }
    const unbindDevice = (deviceId: string[]) => {
        service.unbindDevice(parentId!, deviceId).subscribe(
            () => message.success('绑定成功'),
            () => message.error('绑定失败'),
            () => {
                setBindVisible(false);
                searchDevice({ id: parentId });
            })

    }
    return (
        <PageHeaderWrapper title="设备分组">
            <Card>
                <div style={{ marginBottom: 10 }}>
                    <Button type="primary" onClick={() => setSaveVisible(true)}>新增</Button>
                </div>
                <Row gutter={24}>
                    <Col span={8}>
                        <Table
                            title={() => '分组'}
                            onRowClick={(item) => {
                                searchDevice(item);
                                setParentId(item.id);
                            }}
                            bordered={false}
                            dataSource={data}
                            size="small"
                            rowKey={(item: any) => item.id}
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                {
                                    title: '操作', render: (_, record) => (
                                        <Fragment>
                                            <Icon
                                                type="edit"
                                                onClick={() => {
                                                    setCurrent(record);
                                                    setSaveVisible(true);
                                                }}
                                            />
                                            <Divider type="vertical" />
                                            <Icon
                                                type="plus"
                                                onClick={() => {
                                                    setParentId(record.id);
                                                    setSaveVisible(true);
                                                }} />
                                            <Divider type="vertical" />
                                            <Popconfirm
                                                title="确认删除分组？"
                                                onConfirm={() => {
                                                    service.removeGroup(record.id).subscribe(
                                                        () => message.success('删除成功!'),
                                                        () => message.error('删除失败'),
                                                        () => search()
                                                    )
                                                }} >
                                                <Icon type="close" />
                                            </Popconfirm>
                                            <Divider type="vertical" />
                                            <Icon type="apartment" onClick={() => {
                                                setBindVisible(true);
                                                setParentId(record.id);
                                            }} />
                                        </Fragment>
                                    )
                                }
                            ]} />
                    </Col>
                    <Col span={16}>
                        <Table
                            title={() => (
                                <Fragment>
                                    设备
                                    <Button
                                        style={{ marginLeft: 10 }}
                                        type="danger"
                                        size="small"
                                    >解绑全部</Button>
                                </Fragment>

                            )}
                            dataSource={deviceData.data}
                            size="small"
                            rowKey={(item: any) => item.id}
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                { title: '状态', dataIndex: 'state', render: (text) => text.text },
                                {
                                    title: '操作', render: (_, record) => (
                                        <Fragment>
                                            <Tooltip title="详情">
                                                <Icon type="info" onClick={
                                                    () => {
                                                        setDevice(record);
                                                        setDetailVisible(true)
                                                    }} />
                                            </Tooltip>
                                            <Divider type="vertical" />
                                            <Tooltip title="解绑">
                                                <Popconfirm
                                                    title="确认解绑?"
                                                    onConfirm={() => {
                                                        unbindDevice([record.id])
                                                    }} >
                                                    <Icon type="close" />
                                                </Popconfirm>
                                            </Tooltip>

                                        </Fragment>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </Card>
            {
                saveVisible && (
                    <Save
                        data={current}
                        close={() => { setSaveVisible(false); setCurrent({}) }}
                        save={(item: GroupItem) => saveGroup(item)}
                    />
                )
            }
            {bindVisible && (
                <Modal
                    title="绑定设备"
                    visible
                    width='80vw'
                    onCancel={() => {
                        setDeviceIds([]);
                        setBindVisible(false);
                        setParentId(null)
                    }}
                    onOk={() => { bindDevice() }}
                >
                    <ChoiceDevice deviceList={deviceIds} save={(item: any[]) => {
                        setDeviceIds(item);
                    }} />
                </Modal>
            )}
            {
                detailVisible && (
                    <Drawer
                        visible
                        width='80vw'
                        title='设备详情'
                        onClose={() => { setDetailVisible(false) }}
                    >
                        <DeviceInfo location={{
                            pathname: `/device/instance/save/${device.id}`,
                            search: '',
                            hash: "",
                            query: {},
                            state: undefined,
                        }} />
                    </Drawer>
                )
            }
        </PageHeaderWrapper>
    )
}
export default DeviceTree;