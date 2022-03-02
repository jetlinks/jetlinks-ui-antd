import React, { useState } from "react";
import { GridContent } from "@ant-design/pro-layout";
import { Menu, Form, Input, Select, Button, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect } from "dva";
import { ConnectState, Dispatch } from '@/models/connect';
import { FormComponentProps } from "antd/lib/form";
import { UploadProps } from "antd/lib/upload";
import { DefaultSettings } from "../../../../config/defaultSettings";
import styles from './index.less';
import { getAccessToken } from "@/utils/authority";
import logo from '../../../assets/icon.png';

interface Props extends FormComponentProps {
    dispatch: Dispatch;
    settings: DefaultSettings
}
const Config: React.FC<Props> = props => {
    const [loading, setLoading] = useState(false);

    const { form: { getFieldDecorator, getFieldsValue }, settings } = props;
    const [titleIcon, setTitleIcon] = useState(settings.titleIcon);
    const updateSetting = () => {
        const { dispatch } = props;
        dispatch({
            type: 'settings/settingData',
            payload: { ...settings, ...getFieldsValue(), titleIcon },
            // callback:()=>{message.success('保存成功')}
            callback:(response:any)=>{
                if(response.status === 200){
                    message.success('更新成功');
                }else{
                    message.success('更新失败');
                }
            }

        })


    }


    const uploadProps: UploadProps = {
        // accept: ,
        action: '/jetlinks/file/static',
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'uploading') {
                setLoading(true);
            }
            if (info.file.status === 'done') {
                setTitleIcon(info.file.response.result);
                message.success('上传成功');
                setLoading(false);
            }
        },
    };

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
                        <Menu.Item key="basic">系统配置</Menu.Item>
                        {/* <Menu.Item key="advance">高级</Menu.Item> */}

                    </Menu>
                </div>
                <Spin spinning={loading}>
                    <div className={styles.right}>
                        <div className={styles.title}>系统配置</div>
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
                                    {/* <Form.Item
                                        label="系统简介"
                                    >
                                        <Input.TextArea
                                            placeholder="系统简介"
                                            rows={4}
                                        />
                                    </Form.Item> */}
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" onClick={updateSetting}>
                                            更新基本信息
                                    </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div className={styles.right}>
                                <>
                                    <div className={styles.avatar_title}>
                                        系统LOGO
                                </div>
                                    <div className={styles.avatar}>
                                       <img src={titleIcon||logo} alt='default'/>
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
                            </div>
                        </div>
                    </div>
                </Spin>

            </div>
        </GridContent>
    );
}

export default connect(({ settings, loading }: ConnectState) => ({
    settings,
    loading: loading.models.settings
}))(Form.create<Props>()(Config));
