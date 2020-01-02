import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import EditableTable from "./EditableTable";

interface OrganizationalProps {

}

interface OrganizationalState {

}

class Organizational extends Component<OrganizationalProps, OrganizationalState>{

    render() {
        return (
            <PageHeaderWrapper title="机构管理">
                <Card bordered={false}>
                    机构管理
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Organizational;
