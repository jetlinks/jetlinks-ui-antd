import { Avatar, Button, Form, Input, message, Modal, Upload } from "antd";
import { FormComponentProps } from "antd/es/form";
import apis from '@/services';
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import { getAccessToken } from "@/utils/authority";

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}
const Save: React.FC<Props> = props => {
    const { form: { getFieldsValue, getFieldDecorator }, data } = props;
    const [photoUrl, setPhotoUrl] = useState(data?.photoUrl);

    const uploadProps: UploadProps = {
        action: '/jetlinks/file/static',
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'done') {
                setPhotoUrl(info.file.response.result);
                message.success('上传成功');
            }
        },
    };
    return (
        <Modal
            title={data.id ? `编辑` : '新增'}
            visible
            onCancel={() => { props.close() }}
            onOk={() => {
                const formData = getFieldsValue();
                if (props.data.id) {
                    apis.edgeProduct.update({...formData, photoUrl}).then(res => {
                        if (res.status === 200) {
                            props.save();
                            message.success('更新成功');
                        }
                    })
                } else {
                    apis.edgeProduct.save({...formData, photoUrl}).then(res => {
                        if (res.status === 200) {
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
                <Form.Item label='图标'>
                    <>
                        <div>
                            <Avatar size={80} src={photoUrl || data?.photoUrl} />
                        </div>
                        <Upload {...uploadProps} showUploadList={false}>
                            <Button>
                                <UploadOutlined />
                                更换图片
                            </Button>
                        </Upload>
                    </>
                </Form.Item>
                <Form.Item label="说明">
                    {getFieldDecorator('description', {
                        initialValue: data?.description,
                    })(
                        <Input.TextArea rows={3} placeholder="请输入" />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);