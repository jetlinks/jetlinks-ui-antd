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
                let param = {productId: props.data.productId, ...formData}
                apis.edgeDevice.update(param).then(res => {
                    if(res.status === 200){
                        props.save();
                        message.success('更新成功');
                    }
                })
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
                <Form.Item label="产品名称">
                    {getFieldDecorator('productName', {
                        rules: [{ required: true }],
                        initialValue: data?.productName,
                    })(
                        <Input readOnly={!!data.id}/>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);