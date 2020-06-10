import React, { Fragment, useState, useEffect } from "react";
import ProTable from "@/pages/system/permission/component/ProTable";
import { ColumnProps } from "antd/lib/table";
import { Divider, Button, Tag, message, Popconfirm } from "antd";
import SearchForm from "@/components/SearchForm";
import Save from "./save";
import { TenantItem } from "../../data";
import { ListData } from "@/services/response";
import Service from "../../service";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    data: Partial<TenantItem>
}
const Member = (props: Props) => {
    const service = new Service('tenant');

    const [visible, setVisible] = useState(false);
    const [userList, setUserList] = useState<ListData<any>>();
    const [loading, setLoading] = useState<boolean>(false);
    const id = props.data?.id;

    useEffect(() => {
        if (id) {
            service.member.query(id, encodeQueryParam({
                pageIndex: 0,
                pageSize: 10,
            })).subscribe(resp => {
                setUserList(resp);
                setLoading(false);
            })
        }
    }, []);

    const unBind = (data: any) => {
        if (id) {
            service.member.unBind(id, [data.id]).subscribe(() => {
                message.success('解绑成功');
            })
        }
    }
    const columns: ColumnProps<any>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '管理员',
            dataIndex: 'adminMember',
            render: (text: boolean) => <Tag>{text ? '是' : '否'}</Tag>
        }, {
            title: '状态',
            dataIndex: 'state',
            render: (text: any) => <Tag>{text?.text}</Tag>
        }, {
            title: '操作',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    {/* <a
                        onClick={() => {
                        }}
                    >
                        查看资产
                    </a>
                    <Divider type="vertical" />
                    <a>禁用</a>
                    <Divider type="vertical" /> */}
                    <Popconfirm title="确认解绑吗？" onConfirm={() => unBind(record)}>
                        <a >解绑</a>
                    </Popconfirm>
                </Fragment>)
        }]
    return (
        <div>
            <SearchForm
                search={(params: any) => {
                    // handleSearch()
                }}
                formItems={[{
                    label: '型号名称',
                    key: 'name$LIKE',
                    type: 'string',
                },
                {
                    label: '设备类型',
                    key: 'deviceType',
                    type: 'list',
                    props: {
                        data: [
                            { id: 'gateway', name: '网关' },
                            { id: 'device', name: '设备' }
                        ]
                    }
                }]}
            />
            <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => setVisible(true)}
            > 新增</Button>

            <ProTable
                loading={loading}
                columns={columns}
                dataSource={userList?.data || []}
                rowKey="id"
                onSearch={(data: any) => { console.log(data) }}
                paginationConfig={userList || {}}
            />

            {visible && (
                <Save
                    data={props.data}
                    close={() => setVisible(false)}
                />
            )}
        </div>
    )
}
export default Member;