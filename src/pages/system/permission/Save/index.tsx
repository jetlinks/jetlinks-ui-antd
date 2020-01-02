import { Modal, Tabs, Icon, Spin } from "antd";
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

    const currentItem = props.data;
    const initState: State = {
        basicInfo: currentItem,
        actions: currentItem.actions || [],
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
                    parents: association,
                    optionalFields: dataView
                }
                props.save(permissionData);
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