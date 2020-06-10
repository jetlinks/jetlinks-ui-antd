import { Drawer, Button, Table, Switch, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import Service from "../../../service";
import { TenantItem } from "../../../data";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    close: Function;
    data: Partial<TenantItem>
}
const Save = (props: Props) => {
    const service = new Service('tenant');

    const adminMap = new Map();

    const [loading, setLoading] = useState<boolean>(true);
    const [userList, setUserList] = useState<any[]>();

    const handleSearch = (params: any) => {
        service.member.userlist(encodeQueryParam(params)).subscribe(resp => {
            setLoading(false);
            setUserList(resp);
        });
    }

    useEffect(() => {
        handleSearch({});
    }, [])
    const [selectedRow, setSelectedRow] = useState<any[]>([]);
    const rowSelection = {
        selectedRowKeys: selectedRow.map(item => item.id),
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };

    const saveData = () => {
        setLoading(true);
        const tempData = selectedRow.map(item => ({ name: item.name, userId: item.id, admin: adminMap.get(item.id) || false }))
        const id = props.data?.id;
        if (id) {
            service.member.bind(id, tempData).subscribe(() => {
                setLoading(false);
                message.success('保存成功');
                setSelectedRow([]);
            })
        }
    }

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '是否管理员',
            dataIndex: 'id',
            render: (text: string) =>
                <Switch
                    onChange={(e: boolean) => {
                        adminMap.set(text, e)
                    }} />
        },
    ];


    return (
        <Drawer
            visible
            width="40VW"
            title="添加用户"
            onClose={() => props.close()}
        >
            <Input.Search style={{ marginBottom: 10 }} />

            <Table
                size="small"
                loading={loading}
                rowKey="id"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={userList}
            />,
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={() => {
                        props.close();
                    }}
                    style={{ marginRight: 8 }}
                >
                    关闭
                </Button>
                <Button
                    onClick={() => {
                        saveData()
                    }}
                    type="primary"
                >
                    保存
                </Button>
            </div>
        </Drawer>
    )
}
export default Save;