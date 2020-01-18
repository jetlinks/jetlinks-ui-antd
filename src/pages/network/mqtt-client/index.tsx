import React, { Fragment, useEffect, useState } from "react"
import { ColumnProps, PaginationConfig, SorterResult } from "antd/es/table";
import { Divider, Card, Table, Modal, message, Button } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from '@/utils/table.less';
import Search from "./search";
import { MqttItem } from "./data";
import ConnectState, { Dispatch, Loading } from "@/models/connect";
import { connect } from "dva";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./save";
import Debugger from "./debugger";
interface Props {
    mqttClient: any;
    dispatch: Dispatch;
    location: Location;
    loading: boolean;
}

interface State {
    data: any;
    searchParam: any;
    saveVisible: boolean;
    current: Partial<MqttItem>;
    debuggerVisible: boolean;
}

const MqttClientList: React.FC<Props> = (props) => {

    const { dispatch } = props;

    const result = props.mqttClient.result;

    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        saveVisible: false,
        current: {},
        debuggerVisible: false,
    }

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [current, setCurrent] = useState(initState.current);
    const [debuggerVisible, setDebuggerVisible] = useState(initState.debuggerVisible);

    const columns: ColumnProps<MqttItem>[] = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: 'clientId',
            dataIndex: 'clientId',
        },
        {
            title: 'HOST',
            dataIndex: 'host',
        },
        {
            title: '端口',
            dataIndex: 'port',
        },
        {
            title: '用户名',
            dataIndex: 'secureConfiguration.username',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text) => text === 1 ? '启用' : '禁用'
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => edit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => handleDelete(record)}>禁用</a>
                    <Divider type="vertical" />
                    <a onClick={() => setDebuggerVisible(true)}>调试</a>
                </Fragment>
            ),
        },
    ];

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        dispatch({
            type: 'mqttClient/query',
            payload: encodeQueryParam(params)
        });
    }

    const edit = (record: MqttItem) => {
        setCurrent(record);
        setSaveVisible(true);
    }
    const setting = (record: MqttItem) => {

    }

    const saveOrUpdate = (item: MqttItem) => {
        dispatch({
            type: 'mqttClient/insert',
            payload: encodeQueryParam(item),
            callback: (response) => {
                setSaveVisible(false);
                handleSearch(searchParam);
            }
        })
    }
    const handleDelete = (params: any) => {
        Modal.confirm({
            title: '确定删除此配置吗？删除后无法恢复！',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'mqttClient/remove',
                    payload: params.id,
                    callback: (response) => {
                        message.success("删除成功");
                        handleSearch();
                    }
                });
            },
            onCancel() {
                handleSearch();
            }
        })
    }


    const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<MqttItem>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }

    return (
        <PageHeaderWrapper
            title="MQTT客户端管理"
        >
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div >
                        <Search search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 })
                        }} />
                    </div>
                    <div className={styles.tableListOperator}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => { setCurrent({}); setSaveVisible(true) }}>
                            新建
                        </Button>
                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            loading={props.loading}
                            dataSource={(result || {}).data}
                            columns={columns}
                            rowKey={'id'}
                            onChange={onTableChange}
                            pagination={{
                                current: result.pageIndex + 1,
                                total: result.total,
                                pageSize: result.pageSize,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total: number) => {
                                    return `共 ${total} 条记录 第  ` + (result.pageIndex + 1) + '/' + Math.ceil(result.total / result.pageSize) + '页';
                                }
                            }}
                        />
                    </div>
                </div>
            </Card>
            {
                saveVisible &&
                <Save
                    data={current}
                    close={() => { setSaveVisible(false) }}
                    save={(data: MqttItem) => { saveOrUpdate(data) }}
                />
            }
            {
                debuggerVisible &&
                <Debugger close={() => setDebuggerVisible(false)} />
            }
        </PageHeaderWrapper>
    )
}
export default connect(({ mqttClient, loading }: ConnectState) => ({
    mqttClient, loading: loading.models.mqttClient
}))(MqttClientList)