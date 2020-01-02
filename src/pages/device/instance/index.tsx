import React, { Fragment, useEffect, useState } from "react";
import styles from "@/utils/table.less";
import { DeviceInstance } from "./data";
import { Divider, Card, Table, Alert, Badge, Button, message, Modal, Popconfirm } from "antd";
import { router } from "umi";
import { ColumnProps, PaginationConfig, SorterResult } from "antd/lib/table";
import { FormComponentProps } from "antd/es/form";
import ConnectState, { Dispatch, Loading } from "@/models/connect";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import Search from "./Search";
import { connect } from "dva";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./Save";
import apis from "@/services";
import { getAccessToken } from "@/utils/authority";

interface Props extends FormComponentProps {
    loading: Loading;
    dispatch: Dispatch;
    deviceInstance: any;
}
interface State {
    data: any;
    searchParam: any;
    selectRows: string[] | number[];
    addVisible: boolean;
    currentItem: Partial<DeviceInstance>;
    activeCount: number;
    processVisible: boolean;
}

const DeviceInstancePage: React.FC<Props> = (props) => {

    const result = props.deviceInstance.result;
    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        selectRows: [],
        addVisible: false,
        currentItem: {},
        activeCount: 0,
        processVisible: false
    }

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [selectRows, setSelectRows] = useState(initState.selectRows);
    const [addVisible, setAddvisible] = useState(initState.addVisible);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);
    const { dispatch } = props;
    // const statusMap = ['default', 'processing', 'success', 'error'];
    // const status = ['未激活', '离线', '在线'];

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');

    const columns: ColumnProps<DeviceInstance>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '设备名称',
            dataIndex: 'name',
        },
        {
            title: '设备型号',
            dataIndex: 'productName',
        },
        {
            title: '状态',
            dataIndex: 'state',
            render: (record) => {
                return record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : ""
            }
        },
        {
            title: '备注',
            dataIndex: 'describe',
        },
        {
            title: '操作',
            render: (record: any) => {
                return (
                    <Fragment>
                        <a onClick={() => { router.push(`/device/instance/save/${record.id}`) }}>
                            查看
                        </a>
                        <Divider type="vertical" />
                        <a onClick={() => { setCurrentItem(record); setAddvisible(true) }}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        {
                            record.state?.value === 'notActive' ?
                                <span>
                                    <Popconfirm title="确认激活？" onConfirm={() => { changeDeploy('deploy', record) }}>
                                        <a >激活</a>
                                    </Popconfirm>
                                    <Divider type="vertical" />
                                    <Popconfirm title="确认删除？" onConfirm={() => { delelteInstance(record) }}>
                                        <a>删除</a>
                                    </Popconfirm>
                                </span>
                                :
                                <Popconfirm title="确认取消激活？" onConfirm={() => { changeDeploy('cancelDeploy', record) }}>
                                    <a>取消激活</a>
                                </Popconfirm>
                        }
                    </Fragment>
                )
            },
        },
    ]

    const delelteInstance = (record: any) => {
        apis.deviceInstance.remove(record.id).then(response => {
            if (response.status === 200) {
                message.success('操作成功');
                handleSearch(searchParam);
            }
        });
    }

    const changeDeploy = (type: string, record: any) => {
        apis.deviceInstance.changeDeploy({ type, id: record.id }).then(response => {
            if (response.status === 200) {
                message.success('操作成功');
                handleSearch(searchParam);
            }
        });
    }

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        dispatch({
            type: 'deviceInstance/query',
            payload: encodeQueryParam(params),
        });
    }

    const saveDeviceInstance = (item: any) => {
        dispatch({
            type: 'deviceInstance/update',
            payload: encodeQueryParam(item),
            callback: (response) => {
                message.success("添加成功");
                setAddvisible(false);
                handleSearch(searchParam);
            }
        })
    }

    const rowSelection = {
        selectedRowKeys: selectRows,
        onChange: (selectedRowKeys: string[] | number[], selectedRows: DeviceInstance[]) => {
            setSelectRows(selectedRowKeys);
        },
    }

    const onTableChange = (pagination: PaginationConfig, filters: Record<keyof DeviceInstance, string[]>, sorter: SorterResult<DeviceInstance>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }

    const [processVisible, setProcessVisible] = useState(false);
    const [flag, setFlag] = useState(false);
    const [count, setCount] = useState(initState.activeCount);
    const activeDevice = () => {
        Modal.confirm({
            title: `确认激活全部设备`,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                startImport();
            }
        });
    }


    const [eventSource, setSource] = useState();
    const startImport = () => {
        const source = new EventSource(`${origin}/device-instance/deploy?:X_Access_Token=${getAccessToken()}`);
        let dt = 0;
        // const source = new EventSource(`http://2.jetlinks.org:9010/device-instance/deploy?:X_Access_Token=b3a06868e4b702b56eafaae4d3c02aaa`);
        source.onmessage = (e) => {
            const temp = JSON.parse(e.data).total;
            dt = dt += temp;
            setCount(dt);
        }
        source.onerror = (e) => {
            setFlag(false);
            source.close();
        }
        source.onopen = (e) => {
            setFlag(true);
            setProcessVisible(true);
        }
        setSource(source);
    }

    return (
        <PageHeaderWrapper title="设备实例">

            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        <Search
                            search={(params: any) => { setSearchParam(params); handleSearch({ terms: params, pageSize: 10 }) }}
                        />
                    </div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => setAddvisible(true)}>
                            新建
                        </Button>
                        <Divider type="vertical" />
                        <Button icon="plus" type="danger" onClick={() => activeDevice()}>
                            激活全部设备
                        </Button>
                        {
                            selectRows.length > 0 && <Button>
                                同步状态
                        </Button>
                        }
                        {
                            selectRows.length > 0 &&
                            <Alert
                                style={{ marginTop: 15 }}
                                message={
                                    <Fragment>
                                        已选择 <a style={{ fontWeight: 600 }}>{selectRows.length}</a> 项&nbsp;&nbsp;
                                        {/* 总计1000次 */}
                                        <a style={{ marginLeft: 24 }} onClick={() => setSelectRows([])}>
                                            清空
                                        </a>
                                    </Fragment>
                                }
                                type="info"
                                showIcon
                            />
                        }

                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            loading={props.loading.global}
                            columns={columns}
                            dataSource={(result || {}).data}
                            rowKey='id'
                            // rowSelection={rowSelection}
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
                addVisible &&
                <Save
                    data={currentItem}
                    close={() => { setAddvisible(false); setCurrentItem({}) }}
                    save={(item: any) => { saveDeviceInstance(item) }}
                />
            }
            {
                processVisible &&
                <Modal
                    title='当前进度'
                    visible
                    confirmLoading={flag}
                    onCancel={() => {
                        setProcessVisible(false);
                        eventSource.close();
                    }}
                >
                    {flag ? '激活中' : '激活完成'}
                    总数量:{count}
                </Modal>
            }
        </PageHeaderWrapper>
    );
}

export default connect(({ deviceInstance, loading }: ConnectState) => ({
    deviceInstance,
    loading,
}))(DeviceInstancePage);
