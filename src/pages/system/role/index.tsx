import { connect } from "dva"
import ConnectState, { Dispatch, Loading } from "@/models/connect"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React, { useState, Fragment, useEffect } from "react"
import { ColumnProps, PaginationConfig, SorterResult } from "antd/es/table"
import { RoleItem } from "./data"
import { Divider, message, Modal, Card, Button, Table } from "antd"
import encodeQueryParam from "@/utils/encodeParam"
import styles from '@/utils/table.less';
import Search from "./Search"
import Save from "./Save"

interface Props {
    role: any;
    dispatch: Dispatch;
    location: Location;
    loading: Loading;
}


interface State {
    data: any;
    searchParam: any;
    saveVisible: boolean;
}

const RoleList: React.FC<Props> = (props) => {


    const { dispatch } = props;
    const result = props.role.result;

    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        saveVisible: false,
    }


    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);



    const columns: ColumnProps<RoleItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '是否启用',
            dataIndex: 'status',
        },
        {
            title: '备注',
            dataIndex: 'describe',
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => edit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => setting(record)}>赋权</a>
                </Fragment>
            ),
        },
    ];
    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        dispatch({
            type: 'role/query',
            payload: encodeQueryParam(params)
        });
    }

    const edit = (record: RoleItem) => {

    }
    const setting = (record: RoleItem) => {

    }

    const saveOrUpdate = (user: RoleItem) => {
        dispatch({
            type: 'users/insert',
            payload: encodeQueryParam(user),
            callback: (response) => {
                message.success("添加成功");
                setSaveVisible(false);
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
                    type: 'users/remove',
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


    const onTableChange = (pagination: PaginationConfig, filters: Record<keyof RoleItem, string[]>, sorter: SorterResult<RoleItem>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }
    return (
        <PageHeaderWrapper
            title="角色管理"
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
                    close={() => setSaveVisible(false)}
                    save={(role: RoleItem) => { saveOrUpdate(role) }}
                />
            }
        </PageHeaderWrapper>
    )
}

export default connect(({ role, loading }: ConnectState) => ({
    role, loading
}))(RoleList);