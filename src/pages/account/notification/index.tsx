import React, { useState, useEffect } from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from '@/utils/table.less';
import { Card, Divider, message, Tag, Modal } from "antd";
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import Service from "./service";
import moment from 'moment';
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
}
const Notification: React.FC<Props> = (props) => {

    const [searchParam, setSearchParam] = useState({
        pageSize: 10,
        sorts: {
            order: "desc",
            field: "notifyTime"
        }
    });
    const [loading, setLoading] = useState<any>(false);
    const [result, setResult] = useState<any>({});
    const service = new Service('notifications');
    const handleSearch = (params: any) => {
        setLoading(true);
        const temp = { ...searchParam, ...params };
        setSearchParam(temp);
        service.query(encodeQueryParam(temp)).subscribe(resp => {
            setResult(resp);
            setLoading(false);
        });
    }

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const setUnread = (ids: string[]) => {
        setLoading(true);
        service.unReadNotices(ids).subscribe(() => {
            message.success('操作成功');
            handleSearch(searchParam);
        })
    }

    const setRead = (ids: string[]) => {
        setLoading(true);
        service.readNotices(ids).subscribe(() => {
            message.success('操作成功');
            handleSearch(searchParam);
        })
    }

    const columns: any[] = [
        {
            title: '主题',
            dataIndex: 'topicName',
            align: 'center'
        },
        {
            title: '消息',
            dataIndex: 'message',
            align: 'center'
        },
        {
          title: '通知时间',
          dataIndex: 'notifyTime',
          align: 'center',
          sorter: true,
          defaultSortOrder: 'descend',
          render:(text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '状态',
            dataIndex: 'state',
            align: 'center',
            render: (text: any) => <Tag color={text.value === 'read' ? '#87d068' : '#f50'}>{text.text}</Tag>
        },

        {
            title: '操作',
            align: 'center',
            // dataIndex: 'state',
            render: (_, record: any) => {
                const state = record.state;
                return (
                    <>
                        <a onClick={() => {
                            state.value === 'read' ? setUnread([record.id]) : setRead([record.id])
                        }}>{state.value === 'read' ? '标为未读' : '标为已读'}</a>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            Modal.warning({
                                title: record.topicName,
                                content: record.message,
                                okText: '关闭',
                                onOk: () => {
                                    if (state.value !== 'read') {
                                        setRead([record.id]);
                                    }
                                }
                            });
                        }}>查看</a>
                    </>
                )
            }
        }
    ];
    return (
        <PageHeaderWrapper title="通知记录">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <SearchForm
                        formItems={[
                            {
                                label: '消息',
                                key: 'message$LIKE',
                                type: 'string',
                            }
                        ]}
                    />
                </div>
                <div className={styles.StandardTable}>
                    <ProTable
                        loading={loading}
                        dataSource={result?.data}
                        columns={columns}
                        rowKey="id"
                        onSearch={(params: any) => {
                            handleSearch(params);
                        }}
                        paginationConfig={result}
                    />
                </div>
            </Card>

        </PageHeaderWrapper>
    )
}
export default Notification;
