import React, { useState, useEffect } from "react";
import { ColumnProps } from "antd/es/table";
import SearchForm from "@/components/SearchForm";
import { Table, Button } from "antd";
import Service from "../service";
import Save from "./save";
import encodeQueryParam from "@/utils/encodeParam";


const NotificationView = () => {
    const service = new Service('notifications/subscriptions/');
    const [result, setResult] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 10,
        sorts: {
            field: 'createTime',
            order: 'desc',
        },
    });

    const [saveVisible, setSaveVisible] = useState<boolean>(false);

    const [current, setCurrent] = useState<any>();
    const handleSearch = (params: any) => {
        setSearchParam(params);
        service.query(encodeQueryParam(params)).subscribe(resp => {
            setResult(resp);
            setLoading(false)
        });
    }

    useEffect(() => {
        handleSearch(searchParam);
    }, []);
    const columns: ColumnProps<Notification>[] = [
        {
            title: '订阅类型',
            dataIndex: 'subscriberType'
        }, {
            title: '订阅主题',
            dataIndex: 'topicProvider'
        }, {
            title: '订阅名称',
            dataIndex: 'subscribeName'
        }, {
            title: '状态',
            dataIndex: 'state'
        }, {
            title: '操作',
            render: (_, record) => {
                return (
                    <>
                        <a onClick={() => {
                            setSaveVisible(true);
                            setCurrent(record);
                        }}>配置</a>
                    </>
                )
            }
        }
    ];

    const onTableChange = (
        pagination: any,
        filters: any,
        sorter: any,
    ) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam.terms,
            sorts: sorter.field ? sorter : searchParam.sorter,
        });
    };


    return (
        <div>
            <SearchForm
                search={(params: any) => {
                }}
                formItems={[{
                    label: '订阅名称',
                    key: 'subscribeName$LIKE',
                    type: 'string',
                }]}
            />
            <div style={{ margin: 10 }}>
                <Button
                    type="primary"
                    onClick={() => setSaveVisible(true)}
                >
                    添加订阅
                </Button>
            </div>
            <Table
                loading={loading}
                dataSource={result.data}
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
            {
                saveVisible && (
                    <Save
                        data={current}
                        close={() => {
                            setSaveVisible(false);
                            handleSearch(searchParam);
                        }} />
                )
            }
        </div>
    )
}
export default NotificationView;