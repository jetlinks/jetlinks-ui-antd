import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface DynamicFormProps {

}

interface DynamicFormState {

}

class DynamicForm extends Component<DynamicFormProps, DynamicFormState>{

    render() {
        return (
            <PageHeaderWrapper title="动态表单">
                <Card bordered={false}>
                    动态表单
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default DynamicForm;
