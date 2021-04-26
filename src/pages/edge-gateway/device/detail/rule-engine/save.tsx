import { Form, Input, Modal } from "antd";
import { FormComponentProps } from "antd/es/form";
import React from "react";
interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}

const Save1: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
        data
    } = props;

    return (
        <Modal
            title={'新增规则实例'}
            visible
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;
                    let params = {}
                    if (data.id) {
                        params = {
                            id: fileValue.id,
                            name: fileValue.name,
                            modelMeta: data.modelMeta,
                            modelType: data.modelType
                        }
                    }else{
                        params = {...fileValue}
                    }
                    props.save(params);
                });
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="ID">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item key="description" label="说明">
                    {getFieldDecorator('description', {
                    })(<Input.TextArea rows={4} placeholder="请输入" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save1);