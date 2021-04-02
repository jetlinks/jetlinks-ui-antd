import { Modal, Tabs, Spin } from "antd";
import React, { useState } from "react";
import Basic from "./basic";
import Association from "./association";
import DataView from "./data-view";
import PubSub from 'pubsub-js';
import { PermissionItem, PermissionAction, AssociationPermissionItem, DataViewItem } from "../data";

interface Props {
    close: Function;
    save: Function;
    data: Partial<PermissionItem>;
    loading: boolean;
}

interface State {
    basicInfo: Partial<PermissionItem>;
    actions: PermissionAction[];
    association: AssociationPermissionItem[];
    dataView: DataViewItem[];
}
const Save: React.FC<Props> = (props) => {
    var defaultActionData: PermissionAction[] = [
        { "action": "query", "describe": "查询列表", defaultCheck: true, name: '查询列表' },
        { "action": "get", "describe": "查询明细", defaultCheck: true, name: '查询明细' },
        { "action": "add", "describe": "新增", defaultCheck: true, name: '新增' },
        { "action": "update", "describe": "修改", defaultCheck: true, name: '修改' },
        { "action": "delete", "describe": "删除", defaultCheck: false, name: '删除' },
        { "action": "import", "describe": "导入", defaultCheck: true, name: '导入' },
        { "action": "export", "describe": "导出", defaultCheck: true, name: '导出' }
    ];
    const currentItem = props.data;
    const initState: State = {
        basicInfo: currentItem,
        actions: currentItem.actions || defaultActionData,
        association: currentItem.parents || [],
        dataView: currentItem.optionalFields || [],
    }

    const [basicInfo, setBasicInfo] = useState(initState.basicInfo);
    const [actions, setActions] = useState(initState.actions);
    const [association, setAssociation] = useState(initState.association);
    const [dataView, setDataView] = useState(initState.dataView);

    const submitData = () => {
        PubSub.publish('permission-basic-save', {
            callback: (data: any) => {
                setBasicInfo(data);
                const permissionData = {
                    ...data,
                    actions,
                    parents: association.filter(i => i.actions.length > 0),
                    optionalFields: dataView
                }
                if(permissionData.id === undefined || permissionData.name === undefined || permissionData.status === undefined){
                    
                }else{
                    props.save(permissionData);
                }
            }
        });
    }


    return (
        <Modal
            title={currentItem.id ? "编辑权限" : "新建权限"}
            width={840}
            destroyOnClose
            visible
            onCancel={() => props.close()}
            onOk={() => submitData()}
        >

            <Spin spinning={props.loading}>
                <Tabs defaultActiveKey="basic">
                    <Tabs.TabPane tab="基本信息" key="basic">
                        <Basic data={basicInfo} save={(data: any) => setActions(data)} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="关联权限" key="association">
                        <Association data={association} save={(data: any) => setAssociation(data)} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="数据视图" key="dataView">
                        <DataView data={dataView} save={(data: any) => setDataView(data)} />
                    </Tabs.TabPane>
                </Tabs>
            </Spin>

        </Modal>
    );
}
export default Save;