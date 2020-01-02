import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface TemplateProps {

}

interface TemplateState {

}

class Template extends Component<TemplateProps, TemplateState>{

    render() {
        return (
            <PageHeaderWrapper title="模版管理">
                <Card bordered={false}>
                    模版管理
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Template;
