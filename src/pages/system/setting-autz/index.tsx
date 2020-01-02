import React from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Tabs, Card } from "antd";
import UserDimensions from "./user-dimensions";

interface Props {

}

const SettingAutz: React.FC<Props> = (props) => {
    return (

        <PageHeaderWrapper
            title="功能权限管理"
        >
            <Card>
                <Tabs defaultActiveKey="1" onChange={() => { }}>
                    <Tabs.TabPane tab="用户维度分配" key="user-dimensions">
                        <UserDimensions type="user" />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="权限维度设置" key="setting-dimensions">
                        <UserDimensions type="setting" />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </PageHeaderWrapper>

    );
}
export default SettingAutz;