import React, { useState, useEffect } from "react";
import styles from './index.less';
import { Form, Input, Upload, Button, message, Spin, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { UploadOutlined } from "@ant-design/icons";
import Service from "../service";
import { UserDetail } from "../data";
import { getAccessToken } from "@/utils/authority";
import { UploadProps } from "antd/lib/upload";
import defaultImg from '@/assets/default.png';
import { connect } from "dva";
import { ConnectState } from '@/models/connect';

interface Props extends FormComponentProps {

}

const BaseView: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator, getFieldsValue }, dispatch } = props;
    const service = new Service('user/detail');
    const [user, setUser] = useState<Partial<UserDetail>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>('');
    useEffect(() => {
        service.get().subscribe(data => {
            setUser(data);
            setAvatar(data.avatar);
        });
    }, []);

    const uploadProps: UploadProps = {
        // accept: ,
        action: '/jetlinks/file/upload',
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'uploading') {
                setLoading(true);
            }
            if (info.file.status === 'done') {
                setAvatar(info.file.response.result.id);
                message.success('上传成功');
                setLoading(false);
            }
        },
    };

    const update = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: any = { ...getFieldsValue(), avatar };
        if (data && data.mainTenant) {
            service.setMainTenant(data.mainTenant).subscribe();
        }
        service.save(data).subscribe(() => {
            message.success('保存成功!');
            if (dispatch) {
                dispatch({
                    type: 'user/saveCurrentUser',
                    payload: {
                        avatar
                    }
                });
            }
        }, () => {
            message.error('保存失败');
        })
    }
    return (
        <Spin spinning={loading}>
            <div className={styles.baseView}>
                <div className={styles.left}>
                    <Form
                        layout="vertical"
                        onSubmit={update}
                    >
                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                initialValue: user.name,
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        {
                            user.tenants && user.tenants?.length > 0 && (
                                <Form.Item label="主租户">
                                    {getFieldDecorator('mainTenant', {
                                        initialValue: user.tenants.find((i: any) => i.mainTenant === true)?.tenantId,
                                    })(
                                        <Select allowClear>
                                            {user.tenants.map((item: any) => <Select.Option key={item.tenantId} value={item.tenantId}>{item.tenantName}</Select.Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            )
                        }
                        <Form.Item label="邮箱">
                            {getFieldDecorator('email', {
                                initialValue: user.email,
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="联系电话">
                            {getFieldDecorator('telephone', {
                                initialValue: user.telephone,
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="说明">
                            {getFieldDecorator('description', {
                                initialValue: user.description
                            })(
                                <Input.TextArea rows={3} />
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" type="primary">更新信息</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.right}>
                    <div className={styles.avatar_title}>
                        头像
                </div>
                    <div className={styles.avatar}>
                        <img src={avatar ? `/jetlinks/file/${avatar}?:X_Access_Token=${getAccessToken()}` : defaultImg} alt="avatar" />
                    </div>
                    <Upload {...uploadProps} showUploadList={false}>
                        <div className={styles.button_view}>
                            <Button>
                                <UploadOutlined />更换头像
                            </Button>
                        </div>
                    </Upload>
                </div>
            </div>
        </Spin>

    )
}
export default connect(({ user, global }: ConnectState) => ({
    currentUser: user.currentUser,
    notices: global.notices,
}))(Form.create<Props>()(BaseView));