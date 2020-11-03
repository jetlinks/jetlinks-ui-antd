import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Divider, message, Modal, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { AlarmLog } from "../alarm/data";

interface Props { }
const Alarmlog: React.FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>({});
    const productList = useRef<any[]>([]);
    const [searchParam, setSearchParam] = useState({
        pageSize: 10,
        sorts: {
            order: "descend",
            field: "alarmTime"
        }
    });
    useEffect(() => {
        handleSearch(searchParam);
        apis.deviceProdcut.queryNoPagin(
            encodeQueryParam({ paging: false }))
            .then((resp) => {
                if (resp.status === 200) {
                    productList.current = resp.result;
                }
            });
    }, []);
    const handleSearch = (params?: any) => {
        setSearchParam(params);
        setLoading(true);
        apis.deviceAlarm.findAlarmLog(encodeQueryParam(params))
            .then((response: any) => {
                if (response.status === 200) {
                    setResult(response.result);
                }
            }).finally(() => { setLoading(false) });

    };
    const alarmLogColumns: ColumnProps<AlarmLog>[] = [
        {
            title: '设备ID',
            dataIndex: 'deviceId',
        },
        {
            title: '设备名称',
            dataIndex: 'deviceName',
        },
        {
            title: '告警名称',
            dataIndex: 'alarmName',
        },
        {
            title: '告警时间',
            dataIndex: 'alarmTime',
            width: '300px',
            render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
            sorter: true,
            defaultSortOrder: 'descend'
        },
        {
            title: '处理状态',
            dataIndex: 'state',
            align: 'center',
            width: '100px',
            render: text => text === 'solve' ? <Tag color="#87d068">已处理</Tag> : <Tag color="#f50">未处理</Tag>,
        },
        {
            title: '操作',
            width: '120px',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <a onClick={() => {
                        let content: string;
                        try {
                            content = JSON.stringify(record.alarmData, null, 2);
                        } catch (error) {
                            content = record.alarmData;
                        }
                        Modal.confirm({
                            width: '40VW',
                            title: '告警数据',
                            content: <pre>{content}
                                {record.state === 'solve' && (
                                    <>
                                        <br /><br />
                                        <span style={{ fontSize: 16 }}>处理结果：</span>
                                        <br />
                                        <p>{record.description}</p>
                                    </>
                                )}
                            </pre>,
                            okText: '确定',
                            cancelText: '关闭',
                        })
                    }}>详情</a>
                    <Divider type="vertical" />
                    {
                        record.state !== 'solve' && (
                            <a onClick={() => {
                                // setSolveAlarmLogId(record.id);
                                // setSolveVisible(true);
                            }}>处理</a>
                        )
                    }
                </Fragment>
            )
        },
    ];
    return (
        <PageHeaderWrapper title="告警记录">
            <Card bordered={false} style={{ marginBottom: 16 }}>
                <div>
                    <div>

                        <SearchForm
                            search={(params: any) => {
                                handleSearch({
                                    terms: { ...params },
                                    pageSize: 10,
                                    sorts: searchParam.sorts
                                });
                            }}
                            formItems={[{
                                label: '设备ID',
                                key: 'deviceId$like',
                                type: 'string',
                            },
                            {
                                label: '产品',
                                key: 'productId$IN',
                                type: 'list',
                                props: {
                                    data: productList.current,
                                    mode: 'tags',
                                }
                            },
                            {
                                label: '告警时间',
                                key: 'alarmTime$btw',
                                type: 'time',
                            },
                            ]}
                        />
                    </div>
                </div>
            </Card>
            <Card>
                <ProTable
                    loading={loading}
                    dataSource={result?.data}
                    columns={alarmLogColumns}
                    rowKey="id"
                    onSearch={(params: any) => {
                        handleSearch(params);
                    }}
                    paginationConfig={result}
                />
            </Card>
        </PageHeaderWrapper>
    )
}
export default Alarmlog;