import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { FormComponentProps } from "antd/es/form";
import { DimensionType } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<DimensionType>;
}

interface State {
    currentItem: Partial<DimensionType>;
}

const SaveDimensionsType: React.FC<Props> = (props) => {

    const initState: State = {
        currentItem: props.data,
    }

    const [currentItem, setCurrentItem] = useState(initState.currentItem);

    const { form: { getFieldDecorator }, form } = props;

    const save = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            fileValue.id = props.data.id;
            props.save(fileValue);
            // apis.dimensions.saveOrUpdateType(fileValue).then(e => {
            //     message.success('保存成功');
            // });
        });
    }
    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}维度分类`}
            visible={true}
            onCancel={() => props.close()}
            onOk={() => { save() }}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

                <Form.Item
                    key="name"
                    label="名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: currentItem.name,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="describe"
                    label="描述"
                >
                    {getFieldDecorator('describe', {
                        initialValue: currentItem.describe,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default Form.create<Props>()(SaveDimensionsType);