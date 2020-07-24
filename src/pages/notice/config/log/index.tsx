import { Modal, Tag, Input } from "antd";
import React, { useState, useEffect, Fragment } from "react";
import ProTable from "@/pages/system/permission/component/ProTable";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";
import moment from "moment";
import SearchForm from "@/components/SearchForm";

interface Props {
    close: Function;
    data: any;
}
const Logger = (props: Props) => {

    const [context, setContext] = useState(false);
    const [error, setError] = useState(false);
    const [item, setItem] = useState<any>({});
    const columns: any[] = [{
        dataIndex: 'id',
        title: 'ID',
    },
    {
        dataIndex: 'notifyTime',
        title: '时间',
        sorter: true,
        defaultSortOrder: 'descend',
        render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
    },
    {
        dataIndex: 'state',
        title: '状态',
        render: (text: any, record: any) => {
            const colorMap = new Map();
            colorMap.set('error', '#f50');
            colorMap.set('success', '#108ee9');
            return (
                <>
                    <Tag color={colorMap.get(text.value)}>
                        {text.text}
                    </Tag>
                    {text.value === 'error' &&
                        <a onClick={() => {
                            setError(true);
                            setItem(record);
                        }}>查看</a>
                    }
                </>
            );
        },
    },
    {
        dataIndex: 'option',
        title: '操作',
        render: (_, record: any) => (
            <Fragment>
                <a
                    onClick={() => {
                        setContext(true);
                        setItem(record);
                    }}
                >
                    查看数据
            </a>
            </Fragment>
        )
    }];

    const { data } = props
    const initParam = {
        pageIndex: 0,
        pageSize: 10,
        terms: { notifierId: data.id },
        sorts: {
            field: 'notifyTime',
            order: 'desc'
        }
    };
    const [result, setResult] = useState<any>({});
    const [searchParam, setSearchParam] = useState<any>(initParam);

    const handleSearch = async (params?: any) => {
        const temp = { ...searchParam, ...params };
        temp.terms = { ...initParam.terms, ...params.terms, };
        setSearchParam(temp);

        await apis.notifier.history.list(encodeQueryParam(temp)).then(response => {
            if (response.status === 200) {
                setResult(response.result)
            }
        });
    };

    useEffect(() => {
        handleSearch(searchParam);
    }, []);


    return (
        <Modal
            width={960}
            visible
            title="通知记录"
            onCancel={() => props.close()}
            onOk={() => props.close()}
        >
            <SearchForm
                search={(params: any) => {
                    setSearchParam({ pageSize: 10, terms: { ...params, ...searchParam.terms } });
                    handleSearch({ terms: { ...params }, pageSize: 10 });
                }}
                formItems={[
                    {
                        label: '状态',
                        key: 'state',
                        type: 'list',
                        props: {
                            data: [{ id: 'error', name: '失败' }, { id: 'success', name: '成功' }]
                        }
                    },
                    {
                        label: '通知时间',
                        key: 'notifyTime$btw',
                        type: 'dateTimeRange',
                        props: {
                            showTime: { format: 'HH:mm' },
                            format: "YYYY-MM-DD HH:mm",
                            placeholder: ['开始时间', '结束时间'],
                        }
                    },
                ]}
            />
            <ProTable
                size="small"
                dataSource={result.data}
                columns={columns}
                rowKey="id"
                onSearch={(params: any) => {
                    handleSearch(params);
                }}
                paginationConfig={result}
            />
            {context &&
                <Modal
                    title="详情"
                    visible={context}
                    onOk={() => setContext(false)}
                    onCancel={() => setContext(false)}
                >
                    <Input.TextArea
                        value={JSON.stringify(item.context || "{}")}
                        rows={4} />
                </Modal>
            }
            {error &&
                <Modal
                    width={600}
                    title="错误信息"
                    visible={error}
                    onOk={() => setError(false)}
                    onCancel={() => setError(false)}
                >
                    <Input.TextArea
                        value={JSON.stringify(item.errorStack || "{}")}
                        rows={10} />
                </Modal>
            }
        </Modal>
    )
}
export default Logger;
