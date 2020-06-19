import { Form, Drawer, Select, Divider, Button, Table, message } from "antd";
import React, { useState, useEffect, Fragment } from "react";
import { ListData } from "@/services/response";
import Service from "@/pages/system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    close: Function
    data: any
    user: any
}
const Add = (props: Props) => {
    const service = new Service('tenant');

    const [list, setList] = useState<ListData<any>>();
    const [loading, setLoading] = useState<boolean>(true);
    const [userList, setUserList] = useState();
    const { data } = props;
    const [checkedUserList, setCheckedUserList] = useState<string[]>(props.user ? [props.user] : []);
    const [selectedAssetsId, setSelectedAssetsId] = useState<string[]>([]);

    useEffect(() => {
        service.assets.product(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'product',
                    not: true,
                })
            }
        })).subscribe(resp => {
            setList(resp);
            setLoading(false);
        });

        service.member.query(data.id, {}).subscribe(resp => {
            setUserList(resp.data);
        });
    }, []);

    const bind = () => {
        setLoading(true);
        const bindData: any[] = []

        checkedUserList.forEach(id => bindData.push({
            userId: id,
            assetType: 'product',
            assetIdList: selectedAssetsId,
            allPermission: true,
        }));
        if (checkedUserList.length === 0) {
            message.error('请选择成员');
            setLoading(false);
        } else {
            service.assets.bind(data.id, bindData).subscribe(resp => {
                setLoading(false);
                message.success('添加成功')
                props.close();
            });
        }
    }
    const rowSelection = {
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            // selectedAssetsId = selectedRowKeys;
            setSelectedAssetsId(selectedRowKeys);
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        }, {
            title: '名称',
            dataIndex: 'name'
        }, {
            title: '操作',
            render: () => (
                <Fragment>
                    <a>查看</a>
                </Fragment>
            )
        }]
    return (
        <Drawer
            title="添加产品资产"
            visible
            width='60VW'
            onClose={() => props.close()}
        >
            <Form.Item label="选择成员">
                <Select
                    value={checkedUserList}
                    mode="tags"
                    placeholder="选择成员"
                    onChange={(value: string[]) => { setCheckedUserList(value) }}
                    style={{ width: '100%', marginBottom: 10 }}
                >
                    {(userList || []).map((item: any) => <Select.Option key={item.id} value={item.userId}>{item.name}</Select.Option>)}
                </Select>
            </Form.Item>
            <Divider />
            <Table
                loading={loading}
                rowKey="id"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list?.data} />,
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
                        bind()
                    }}
                    type="primary"
                >
                    保存
                </Button>
            </div>
        </Drawer>
    )
}
export default Add;