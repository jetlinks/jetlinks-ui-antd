import { connect } from "dva"
import ConnectState, { Dispatch, Loading } from "@/models/connect"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React, { useState, Fragment, useEffect } from "react"
import { ColumnProps, PaginationConfig, SorterResult } from "antd/es/table"
import { OpenApiItem } from "./data"
import { Divider, message, Modal, Card, Button, Table, Tag } from "antd"
import encodeQueryParam from "@/utils/encodeParam"
import styles from '@/utils/table.less';
import Search from "./Search"
import Save from "./Save"

interface Props {
    openApi: any;
    dispatch: Dispatch;
    location: Location;
    loading: Loading;
}


interface State {
    data: any;
    searchParam: any;
    saveVisible: boolean;
    currentItem: Partial<OpenApiItem>;
}

const OpenApiList: React.FC<Props> = (props) => {


    const { dispatch } = props;
    //result Undefined解决方案：
    //此处遇到一个坑，model中namespace写open-api;connect中写的openApi导致props.openApi 为undefined。
    const result = props.openApi.result;

    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        saveVisible: false,
        currentItem: {}
    }


    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);



    const columns: ColumnProps<OpenApiItem>[] = [
        {
            title: 'clientId',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'clientName',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text) => <Tag color={text ? '#108ee9' : '#f50'}>{text ? text.text : '禁用'}</Tag>,
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '操作',
            width: '250px',
            align: 'center',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => edit(record)}>编辑</a>
                    {/* <Divider type="vertical" />
                    <a onClick={() => setting(record)}>赋权</a> */}
                </Fragment>
            ),
        },
    ];
    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        dispatch({
            type: 'openApi/query',
            payload: encodeQueryParam(params)
        });
    }

    const edit = (record: OpenApiItem) => {
        setCurrentItem(record);
        setSaveVisible(true);
    }
    const setting = (record: OpenApiItem) => {

    }

    const saveOrUpdate = (user: OpenApiItem) => {
        dispatch({
            type: 'openApi/insert',
            payload: encodeQueryParam(user),
            callback: (response) => {
                message.success("保存成功");
                setSaveVisible(false);
                setCurrentItem({});
                handleSearch(searchParam);
            }
        })
    }
    const handleDelete = (params: any) => {
        Modal.confirm({
            title: '确定删除此用户吗？',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'openApi/remove',
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


    const onTableChange = (pagination: PaginationConfig, filters: Record<keyof OpenApiItem, string[]>, sorter: SorterResult<OpenApiItem>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }
    return (
        <PageHeaderWrapper
            title="OpenApi客户端"
        >
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        <Search search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 })
                        }} />
                    </div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => { setSaveVisible(true) }}>
                            新建
                        </Button>
                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            loading={props.loading.global}
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
                    data={currentItem}
                    close={() => { setSaveVisible(false); setCurrentItem({}) }}
                    save={(openApi: OpenApiItem) => { saveOrUpdate(openApi) }}
                />
            }
        </PageHeaderWrapper>
    )
}

export default connect(({ openApi, loading }: ConnectState) => ({
    openApi, loading
}))(OpenApiList);
