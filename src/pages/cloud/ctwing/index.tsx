import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Button, Card, Divider, message, Popconfirm, Spin } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import { ColumnProps } from "antd/es/table";
import Save from './save'
import apis from '@/services'
import encodeQueryParam from '@/utils/encodeParam';

interface State {
    searchParam: any;
    saveVisible: boolean;
    resultList: any;
    productData: any;
    spinning: Boolean
}
const Ctwing: React.FC<{}> = () => {
    const initState: State = {
        searchParam: {
            pageSize: 10,
            sorts: {
                field: 'id',
                order: 'desc'
            }
        },
        saveVisible: false,
        resultList: {},
        productData: {},
        spinning: true
    };

    const [resultList, setResultList] = useState(initState.resultList);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [productData, setProductData] = useState(initState.productData);
    const [spinning, setSpinning] = useState(initState.spinning);

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        apis.ctwing.list(encodeQueryParam(params))
            .then((response: any) => {
                if (response.status === 200) {
                    setResultList(response.result)
                    setSpinning(false)
                }
            }).catch(() => {
            });
    };

    const deleteCtwing = (id: string) => {
        apis.ctwing.remove(id).then(res => {
            if (res.status === 200) {
                message.success('删除成功');
                handleSearch(searchParam);
            }
        })
    };

    const setEnabled = (id: string) => {
        apis.ctwing.setEnabled(id).then(res => {
            if (res.status === 200) {
                message.success('启用成功');
                handleSearch(searchParam);
            }
        })
    }

    const setDisabled = (id: string) => {
        apis.ctwing.setDisabled(id).then(res => {
            if (res.status === 200) {
                message.success('禁用成功');
                handleSearch(searchParam);
            }
        })
    }

    useEffect(() => {
        handleSearch(searchParam);
    }, [])

    const columns: ColumnProps<any>[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'id'
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'state.text',
        },
        {
            title: '说明',
            align: 'center',
            dataIndex: 'description',
        },
        {
            title: '操作',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <a onClick={() => { setSaveVisible(true); setProductData(record) }}>编辑</a>
                    {
                        record.state.value === 'disabled' && (
                            <>
                                <Divider type="vertical" />
                                <a onClick={() => { setEnabled(record.id); }}>启用</a>
                                <Divider type="vertical" />
                                <Popconfirm title="确认删除此执行动作？"
                                    onConfirm={() => { deleteCtwing(record.id); }}
                                >
                                    <a>删除</a>
                                </Popconfirm>
                            </>
                        )
                    }
                    {
                        record.state.value === 'enabled' && (
                            <>
                                <Divider type="vertical" />
                                <a onClick={() => { setDisabled(record.id); }}>禁用</a>
                            </>
                        )
                    }
                </Fragment>
            )
        }
    ]
    return (
        <PageHeaderWrapper title="电信CTWing">
            <Card bordered={false} style={{ marginBottom: 16 }}>
                <div className={styles.tableList}>
                    <div>
                        <SearchForm
                            search={(params: any) => {
                                setSearchParam(params);
                                handleSearch({ terms: params, pageSize: 10 });
                            }}
                            formItems={[
                                {
                                    label: 'ID',
                                    key: 'id$LIKE',
                                    type: 'string'
                                },
                                {
                                    label: '名称',
                                    key: 'name$LIKE',
                                    type: 'string'
                                }
                            ]}
                        />
                        <div>
                            <Button icon="plus" type="primary" onClick={() => { setSaveVisible(true); setProductData({}) }}>新增</Button>
                        </div>
                    </div>
                </div>
            </Card>
            <Spin tip="加载中..." spinning={spinning}>
                <Card>
                    <div className={styles.StandardTable}>
                        <ProTable
                            dataSource={resultList?.data}
                            columns={columns}
                            rowKey="id"
                            onSearch={(params: any) => {
                                handleSearch(params);
                            }}
                            paginationConfig={resultList}
                        />
                    </div>
                </Card>
            </Spin>
            {saveVisible && (
                <Save
                    data={productData}
                    close={() => {
                        setSaveVisible(false);
                        handleSearch(searchParam);
                    }}
                    save={() => {
                        setSaveVisible(false);
                        handleSearch(searchParam);
                    }}
                />
            )}
        </PageHeaderWrapper>
    )

}

export default Ctwing;