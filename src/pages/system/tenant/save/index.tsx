import React, { useState } from "react";
import { Modal, Form, Input, Upload, Icon } from "antd"
import { FormComponentProps } from "antd/lib/form";
import { UploadProps } from "antd/lib/upload";
import { getAccessToken } from "@/utils/authority";
import { TenantItem } from "../data";

interface Props extends FormComponentProps {
    save: Function;
    close: Function;
    data: Partial<TenantItem>
}
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const Save = (props: Props) => {
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const { form, form: { getFieldDecorator, validateFields } } = props;
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">上传</div>
        </div>
    );


    const uploadProps: UploadProps = {
        action: '/jetlinks/file/static',
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        showUploadList: false,
        onChange(info: any) {
            if (info.file.status === 'done') {
                const fileUrl: string = info.file.response.result;
                setLoading(false);
                setImageUrl(fileUrl);
                // setImageUrl(fileUrl.replace('localhost', '192.168.3.110'));
            }
            if (info.file.status === 'uploading') {
                setLoading(true);
            }
        },
    };

    const saveData = () =>
        validateFields((error, filed) => {
            if (error) return;
            props.save({ ...filed, photo: imageUrl });
        })


    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    };


    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('您输入的两个密码不一致！');
        } else {
            callback();
        }
    };

    const handleConfirmBlur = (e: any) => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    return (
        <Modal
            width={880}
            title="新建租户"
            visible
            onCancel={() => props.close()}
            onOk={saveData}
        >
            <Form {...formLayout}>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请填写租户名称' }],
                    })(<Input placeholder="请填写租户名称" />)}
                </Form.Item>
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请填写管理员用户名' }],
                    })(<Input placeholder="请填写管理员用户名" />)}
                </Form.Item>

                <Form.Item label="新密码">
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入新密码' },
                            { validator: validateToNextPassword }
                        ],
                    })(<Input.Password placeholder="请输入新密码" />)}
                </Form.Item>
                <Form.Item label="确认密码">
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            { required: true, message: '确认密码' },
                            {
                                validator: compareToFirstPassword
                            }],
                    })(<Input.Password placeholder="请输入确认密码" onBlur={handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item label="头像">
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="photo-uploader"
                        showUploadList={false}
                        {...uploadProps}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item label="说明">
                    {getFieldDecorator('description', {
                    })(<Input.TextArea rows={3} placeholder="说明" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);