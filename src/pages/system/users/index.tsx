import React, { Fragment, useEffect, useState } from "react"
import { ColumnProps, PaginationConfig, SorterResult } from "antd/es/table";
import { UserItem } from "./data";
import { Divider, Card, Table, Modal, message, Button } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from '@/utils/table.less';
import Search from "./search";
import { Dispatch, Loading, ConnectState } from "@/models/connect";
import { connect } from "dva";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./save";
import Authorization from "@/components/Authorization";
interface Props {
    users: any;
    dispatch: Dispatch;
    location: Location;
    loading: boolean;
}

interface State {
    data: any;
    searchParam: any;
    saveVisible: boolean;
    currentItem: Partial<UserItem>;
    autzVisible: boolean;
}

const UserList: React.FC<Props> = (props) => {

    const { dispatch } = props;
    const result = props.users.result;

    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        saveVisible: false,
        currentItem: {},
        autzVisible: false
    }

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);
    const [autzVisible, setAutzVisible] = useState(initState.autzVisible);

    const columns: ColumnProps<UserItem>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '是否启用',
            dataIndex: 'status',
            render: text => (text === 1 ? '是' : '否'),
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
            type: 'users/query',
            payload: encodeQueryParam(params)
        });
    }

    const edit = (record: UserItem) => {
        setCurrentItem(record);
        setSaveVisible(true);
    }
    const setting = (record: UserItem) => {
        setAutzVisible(true);
        setCurrentItem(record);
    }

    const saveOrUpdate = (user: UserItem) => {
        dispatch({
            type: 'users/insert',
            payload: encodeQueryParam(user),
            callback: (response: any) => {
                if (response.status === 200) {
                    message.success("添加成功");
                    setSaveVisible(false);
                    handleSearch(searchParam);
                    setCurrentItem({})
                }
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


    const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }

    return (
        <PageHeaderWrapper
            title="用户管理"
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
                        <Button icon="plus" type="primary" onClick={() => { setSaveVisible(true) }}>
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
                    data={currentItem}
                    close={() => { setSaveVisible(false); setCurrentItem({}) }}
                    save={(user: UserItem) => { saveOrUpdate(user) }}
                />
            }
            {
                autzVisible &&
                <Authorization
                    close={() => { setAutzVisible(false); setCurrentItem({}) }}
                    target={currentItem}
                    targetType='user'
                />
            }
        </PageHeaderWrapper>
    )
}
export default connect(({ users, loading }: ConnectState) => ({
    users,
    loading: loading.models.users
}))(UserList)