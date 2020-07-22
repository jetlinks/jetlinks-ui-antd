import { Drawer, Table, message } from "antd";
import React, { useEffect, useContext, useState } from "react";
import Service from "@/pages/system/tenant/service";
import { TenantContext } from "@/pages/system/tenant/detail";
import { ListData } from "@/services/response";

interface Props {
    close: Function
    asset: any
}

const User = (props: Props) => {
    const service = new Service('tenant');
    const data = useContext(TenantContext);
    const { asset } = props;
    const [list, setList] = useState();
    const [selected, setSelected] = useState<string[]>([]);
    useEffect(() => {
        service.assets.members(data.id, 'product', asset.id).subscribe(resp => {
            const bindId = resp.filter((item: any) => item.binding === true).map((i: any) => i.userId);
            setSelected(bindId);
            setList(resp);
        });
    }, []);

    const bind = (userId: string) => {
        service.assets.bind(data.id, [{
            userId,
            assetType: 'product',
            assetIdList: [asset.id],
            allPermission: true,
        }]).subscribe()
    }
    const unbind = (userId: string) => {
        service.assets.unbind(data.id, [{
            userId,
            assetType: 'product',
            assetIdList: [asset.id],
        }]).subscribe()
    }

    const rowSelection = {
        selectedRowKeys: selected,
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            setSelected(selectedRowKeys);
            if (selectedRowKeys.length > selected.length) {
                const ids = selectedRowKeys.filter(item => !selected.includes(item));
                ids.forEach(i => bind(i));
                // bind(id[0])

            } else {
                const ids = selected.filter(item => !selectedRowKeys.includes(item));
                ids.forEach(i => unbind(i));
                // unbind(id[0]);
            }
            // console.log(selectedRowKeys, selected, 'kkkk');

            setSelected(selectedRowKeys);

            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    return (
        <Drawer
            title="查看资产"
            visible
            width='30VW'
            onClose={() => props.close()}
        >
            <Table
                rowSelection={rowSelection}
                rowKey="userId"
                pagination={false}
                dataSource={list}
                columns={[
                    {
                        dataIndex: 'userName',
                        title: '用户名'
                    },
                ]}
            />
        </Drawer>
    );
}

export default User;