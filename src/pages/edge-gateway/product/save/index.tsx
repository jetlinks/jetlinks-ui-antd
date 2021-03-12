import { Form, Input, message, Modal } from "antd";
import { FormComponentProps } from "antd/es/form";
import apis from '@/services';
import React from "react";

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}
const Save: React.FC<Props> = props => {
    const { form: { getFieldsValue, getFieldDecorator }, data } = props;
    return (
        <Modal 
            title={data.id ? `编辑` : '新增' }
            visible
            onCancel={() => {props.close()}}
            onOk={() => { 
                const formData = getFieldsValue();
                if(props.data.id){
                    apis.edgeProduct.update(formData, props.data.id).then(res => {
                        if(res.status === 200){
                            props.save();
                            message.success('更新成功');
                        }
                    })
                }else{
                    apis.edgeProduct.save(formData).then(res => {
                        if(res.status === 200){
                            props.save();
                            message.success('新增成功');
                        }
                    })
                }
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="ID">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: data?.id,
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: data?.name,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="厂家">
                    {getFieldDecorator('manufacturer', {
                        rules: [{ required: true }],
                        initialValue: data?.manufacturer,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="型号">
                    {getFieldDecorator('model', {
                        rules: [{ required: true }],
                        initialValue: data?.model,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="版本">
                    {getFieldDecorator('version', {
                        rules: [{ required: true }],
                        initialValue: data?.version,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);