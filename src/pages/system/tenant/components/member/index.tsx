import React, { Fragment, useState, useEffect } from "react";
import ProTable from "@/pages/system/permission/component/ProTable";
import { ColumnProps } from "antd/lib/table";
import { Button, Tag, message, Popconfirm, Divider } from "antd";
import SearchForm from "@/components/SearchForm";
import encodeQueryParam from "@/utils/encodeParam";
import { ListData } from "@/services/response";
import Save from "./save";
import { TenantItem } from "../../data";
import Service from "../../service";

interface Props {
    data: Partial<TenantItem>;
    openAssets: Function;
}
const Member = (props: Props) => {
    const service = new Service('tenant');

    const [visible, setVisible] = useState(false);
    const [userList, setUserList] = useState<ListData<any>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<any>({
        pageIndex: 0,
        pageSize: 10,
    });
    const id = props.data?.id;

    const handleSearch = (params: any) => {
        setSearchParam(params);
        if (id) {
            service.member.query(id, encodeQueryParam(params)).subscribe(resp => {
                setUserList(resp);
                setLoading(false);
            })
        }
    }

    useEffect(() => {
        handleSearch(searchParam)
    }, []);


    const unBind = (data: any) => {
        if (id) {
            service.member.unBind(id, [data.id]).subscribe(() => {
                message.success('解绑成功');
                handleSearch(searchParam);
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
                    <a
                        onClick={() => {
                            props.openAssets(record);
                        }}
                    >
                        查看资产
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm title="确认解绑吗？" onConfirm={() => unBind(record)}>
                        <a >解绑</a>
                    </Popconfirm>
                </Fragment>)
        }]
    return (
        <div>
            <SearchForm
                search={(params: any) => {
                    searchParam.terms = params;
                    handleSearch(searchParam);
                }}
                formItems={[{
                    label: '姓名',
                    key: 'name$LIKE',
                    type: 'string',
                },
                {
                    label: '状态',
                    key: 'state',
                    type: 'list',
                    props: {
                        mode: 'default',
                        data: [
                            { id: 'enabled', name: '启用' },
                            { id: 'disenabled', name: '禁用' }
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
                onSearch={(data: any) => { handleSearch(data) }}
                paginationConfig={userList || {}}
            />

            {visible && (
                <Save
                    data={props.data}
                    close={() => {
                        setVisible(false);
                        handleSearch(searchParam)
                    }}
                />
            )}
        </div>
    )
}
export default Member;