import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface CodeGeneratorProps {

}

interface CodeGeneratorState {

}

class CodeGenerator extends Component<CodeGeneratorProps, CodeGeneratorState>{

    render() {
        return (
            <PageHeaderWrapper title="代码生成器">
                <Card bordered={false}>
                    代码生成器
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default CodeGenerator;
