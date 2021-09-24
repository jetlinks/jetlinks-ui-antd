import React from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Modal, Select} from 'antd';


interface Props extends FormComponentProps {
    close: Function;
}

const Authority: React.FC<Props> = props => {

    const {
        form: {getFieldDecorator},
        form,
    } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;

            props.close(fileValue);
        });
    };

    return (
        <Modal
            title="资产权限"
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => {
                submitData();
            }}
            onCancel={() => props.close()}
        >
            <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
                <Form.Item key="permission" label="资产权限">
                    {getFieldDecorator('permission', {
                        rules: [{required: true}],
                    })(
                        <Select placeholder="资产权限" mode="tags">
                            <Select.Option key="read" value="read">读</Select.Option>
                            <Select.Option key="save" value="save">保存</Select.Option>
                            <Select.Option key="delete" value="delete">删除</Select.Option>
                        </Select>,
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Form.create<Props>()(Authority);
