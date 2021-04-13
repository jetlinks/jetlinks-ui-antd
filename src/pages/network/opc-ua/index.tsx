import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Divider, Card, Table, Button, Popconfirm, message, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import apis from '@/services';
import { OpcUaItem } from './data.d';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import SearchForm from '@/components/SearchForm';

interface Props {
    certificate: any;
    location: Location;
    loading: boolean;
}

interface State {
    searchParam: any;
    saveVisible: boolean;
    current: Partial<OpcUaItem>;
    result: any;
}

const OpcUaComponent: React.FC<Props> = props => {

    const initState: State = {
        searchParam: { pageSize: 10 },
        saveVisible: false,
        current: {},
        result: {}
    };

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [result, setResult] = useState(initState.result);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [current, setCurrent] = useState(initState.current);

    const handleSearch = (params?: any) => {
        setSearchParam(searchParam);
        apis.opcUa.list(encodeQueryParam(params)).then((res: any) => {
            if (res.status === 200) {
                setResult(res.result);
            }
        })
    };

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const statusMap = new Map();
    statusMap.set('enabled', 'success');
    statusMap.set('disabled', 'error');

    const edit = (record: OpcUaItem) => {
        setCurrent(record);
        setSaveVisible(true);
    };

    const saveOrUpdate = (item: OpcUaItem) => {
        if (!!current.id) {
            apis.opcUa.updata(item).then(res => {
                if (res.status === 200) {
                    message.success('保存成功！');
                    setCurrent({});
                    handleSearch(searchParam);
                }
            })
        } else {
            apis.opcUa.save(item).then(res => {
                if (res.status === 200) {
                    message.success('保存成功！');
                    handleSearch(searchParam);
                }
            })
        }
    };
    const handleDelete = (params: OpcUaItem) => {
        apis.opcUa.remove(params.id).then(res => {
            if (res.status === 200) {
                message.success('操作成功！');
                handleSearch(searchParam);
            }
        })
    }

    const start = (params: any) => {
        apis.opcUa.start(params.id).then(res => {
            if (res.status === 200) {
                message.success('操作成功！');
                handleSearch(searchParam);
            }
        })
    }

    const stop = (params: any) => {
        apis.opcUa.stop(params.id).then(res => {
            if (res.status === 200) {
                message.success('操作成功！');
                handleSearch(searchParam);
            }
        })
    }

    const onTableChange = (
        pagination: PaginationConfig,
        filters: any,
        sorter: SorterResult<OpcUaItem>,
    ) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam,
            sorts: sorter,
        });
    };

    const columns: ColumnProps<OpcUaItem>[] = [
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '服务地址',
            align: 'center',
            dataIndex: 'clientConfigs[0].endpoint',
        },
        {
            title: '安全策略',
            align: 'center',
            dataIndex: 'clientConfigs[0].securityPolicy'
        },
        {
            title: '安全模式',
            align: 'center',
            dataIndex: 'clientConfigs[0].securityMode'
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'state',
            render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '/',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => edit(record)}>编辑</a>
                    {
                        record.state?.value === 'disabled' ? (
                            <>
                                <Divider type="vertical" />
                                <a onClick={() => start(record)}>启动</a>
                                <Divider type="vertical" />
                                <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </>
                        ) : (
                            <>
                                <Divider type="vertical" />
                                <a onClick={() => stop(record)}>停止</a>
                            </>
                        )
                    }
                </Fragment>
            ),
        }
    ];

    return (
        <PageHeaderWrapper title="OPC UA">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    {/* <SearchForm
                        search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 });
                        }}
                        formItems={[
                            {
                                label: '名称',
                                key: 'name$LIKE',
                                type: 'string'
                            },
                            {
                                label: '类型',
                                key: 'instance$IN',
                                type: 'list',
                                props: {
                                    mode: 'multiple',
                                    data: ['PFX', 'JKS', 'PEM']
                                }
                            },
                        ]}
                    />*/}
                    <div className={styles.tableListOperator}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                setCurrent({ clientConfigs: [{}] });
                                setSaveVisible(true);
                            }}
                        >
                            新建
                        </Button>
                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            loading={props.loading}
                            dataSource={(result || {}).data}
                            columns={columns}
                            rowKey="id"
                            onChange={onTableChange}
                            pagination={{
                                current: result.pageIndex + 1,
                                total: result.total,
                                pageSize: result.pageSize,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total: number) =>
                                    `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                                        result.total / result.pageSize,
                                    )}页`,
                            }}
                        />
                    </div>
                </div>
            </Card>
            {saveVisible && (
                <Save
                    data={current}
                    close={() => {
                        setSaveVisible(false);
                    }}
                    save={(data: OpcUaItem) => {
                        saveOrUpdate(data);
                        setSaveVisible(false);
                    }}
                />
            )}
        </PageHeaderWrapper>
    );
};
export default OpcUaComponent;
