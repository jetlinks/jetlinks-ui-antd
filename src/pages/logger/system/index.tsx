import React, { Fragment, useEffect, useState } from "react"
import { ColumnProps, PaginationConfig, SorterResult } from "antd/es/table";
import { Divider, Card, Table, Modal, message, Button, Tag } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from '@/utils/table.less';
import Search from "./search";
import { SystemLoggerItem } from "./data";
import ConnectState, { Dispatch, Loading } from "@/models/connect";
import { connect } from "dva";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./save";
import moment from "moment";
interface Props {
    systemLogger: any;
    dispatch: Dispatch;
    location: Location;
    loading: boolean;
}

interface State {
    data: any;
    searchParam: any;
    saveVisible: boolean;
    current: Partial<SystemLoggerItem>;
}

const SystemLoggerList: React.FC<Props> = (props) => {

    const { dispatch } = props;

    const result = props.systemLogger.result;

    const initState: State = {
        data: result,
        searchParam: { pageSize: 10 },
        saveVisible: false,
        current: {},
    }

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [current, setCurrent] = useState(initState.current);

    const columns: ColumnProps<SystemLoggerItem>[] = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 60,
            render: (text, record, index) => index + 1
        },

        {
            title: '线程',
            dataIndex: 'threadName',
        },
        {
            title: '名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '级别',
            dataIndex: 'level',
            width: 80,
            render: (text) => <Tag color={text === 'ERROR' ? 'red' : 'orange'}>{text}</Tag>
        },
        {
            title: '日志内容',
            dataIndex: 'exceptionStack',
            ellipsis: true,
        },
        {
            title: '服务名',
            dataIndex: 'context.server',
            width: 150
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 200,
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => edit(record)}>详情</a>
                </Fragment>
            ),
        },
    ];

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const handleSearch = (params?: any) => {
        dispatch({
            type: 'systemLogger/query',
            payload: encodeQueryParam(params)
        });
    }

    const edit = (record: SystemLoggerItem) => {
        setCurrent(record);
        setSaveVisible(true);
    }
    const setting = (record: SystemLoggerItem) => {

    }

    const saveOrUpdate = (item: SystemLoggerItem) => {
        dispatch({
            type: 'systemLogger/insert',
            payload: encodeQueryParam(item),
            callback: (response) => {
                setSaveVisible(false);
                handleSearch(searchParam);
            }
        })
    }


    const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<SystemLoggerItem>, extra: any) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    }

    return (
        <PageHeaderWrapper
            title="系统日志"
        >
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div >
                        <Search search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 })
                        }} />
                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            loading={props.loading}
                            dataSource={(result || {}).data}
                            columns={columns}
                            rowKey={'createTime'}
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
                    save={(data: SystemLoggerItem) => { saveOrUpdate(data) }}
                />
            }
        </PageHeaderWrapper>
    )
}
export default connect(({ systemLogger, loading }: ConnectState) => ({
    systemLogger, loading: loading.models.systemLogger
}))(SystemLoggerList)