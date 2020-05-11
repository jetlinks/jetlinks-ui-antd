import React, { useState } from "react";
import Form, { FormComponentProps } from "antd/lib/form";
import { FormItemConfig } from "@/utils/common";
import { Input, Select, Row, Col, Button, Icon, message } from "antd";

interface Props extends FormComponentProps {
    search: Function;

}

const Search: React.FC<Props> = props => {

    const { form, form: { getFieldDecorator } } = props;

    const simpleItems: FormItemConfig[] = [
        {
            label: "姓名",
            key: "name$LIKE",
            component: <Input placeholder="请输入" />,
        },
        {
            label: "用户名",
            key: "username$LIKE",
            component:
                < Input placeholder="请输入" />,
        },
    ];


    const search = () => {
        const data = form.getFieldsValue();
        // TODO 查询数据
        props.search(data);
    }

    return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                {
                    simpleItems.map(item => (
                        <Col md={8} sm={24} key={item.key}>
                            <Form.Item label={item.label}>
                                {getFieldDecorator<string>(item.key)(item.component)}
                            </Form.Item>
                        </Col>
                    ))
                }
                <div
                    style={{
                        float: 'right',
                        marginBottom: 24,
                        marginRight: 30,
                        marginTop: 0
                    }}

                >
                    <Button
                        type="primary"
                        onClick={() => {
                            search();
                        }}
                    >
                        查询
                    </Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            form.resetFields();
                            props.search();
                        }}
                    >
                        重置
                    </Button>
                </div>
            </Row >
        </Form >
    );
}

export default Form.create<Props>()(Search);