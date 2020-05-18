import React from "react";
import { GridContent } from "@ant-design/pro-layout";
import { Menu, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect } from "dva";
import { ConnectState, Dispatch } from '@/models/connect';
import { FormComponentProps } from "antd/lib/form";
import { UploadProps } from "antd/lib/upload";
import { DefaultSettings } from "../../../../config/defaultSettings";
import styles from './index.less';
import { getAccessToken } from "@/utils/authority";


const uploadProps: UploadProps = {
    // accept: ,
    action: '/jetlinks/file/static',
    headers: {
        'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
        if (info.file.status === 'done') {
            // setFileUrl(info.file.response.result);
            message.success('文件上传成功');
        }
    },
};

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
        <div className={styles.avatar_title}>
            系统LOGO
        </div>
        <div className={styles.avatar}>
            <img src={avatar} alt="avatar" />
        </div>
        <Upload {...uploadProps} showUploadList={false}>
            <div className={styles.button_view}>
                <Button>
                    <UploadOutlined />
                    更换LOGO
                </Button>
            </div>
        </Upload>
    </>
);
interface Props extends FormComponentProps {
    dispatch: Dispatch;
    settings: DefaultSettings
}
const Config: React.FC<Props> = props => {
    const { form: { getFieldDecorator, getFieldsValue }, settings } = props;
    const updateSetting = () => {
        const { dispatch } = props;
        dispatch({
            type: 'settings/settingData',
            payload: { ...settings, ...getFieldsValue() }
        })
    }
    return (
        <GridContent>
            <div
                className={styles.main}
            >
                <div className={styles.leftMenu}>
                    <Menu
                        mode='inline'
                        selectedKeys={['basic']}
                    >
                        <Menu.Item key="basic">基础</Menu.Item>
                        <Menu.Item key="advance">高级</Menu.Item>

                    </Menu>
                </div>
                <div className={styles.right}>
                    <div className={styles.title}>高级</div>
                    <div className={styles.baseView}>
                        <div className={styles.left}>
                            <Form
                                layout="vertical"
                                hideRequiredMark
                            >
                                <Form.Item
                                    label="系统名称"
                                >
                                    {getFieldDecorator('title', {
                                        initialValue: settings.title,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="主题色"
                                >
                                    {getFieldDecorator('navTheme', {
                                        initialValue: settings.navTheme
                                    })(
                                        <Select onChange={(e: string) => { localStorage.setItem('theme', e) }}>
                                            <Select.Option value="light">light</Select.Option>
                                            <Select.Option value="dark">dark</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="系统简介"
                                >
                                    <Input.TextArea
                                        placeholder="系统简介"
                                        rows={4}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary" onClick={updateSetting}>
                                        更新基本信息
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className={styles.right}>
                            <AvatarView avatar='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' />
                        </div>
                    </div>
                </div>
            </div>
        </GridContent>
    );
}

export default connect(({ settings, loading }: ConnectState) => ({
    settings,
    loading: loading.models.settings
}))(Form.create<Props>()(Config));