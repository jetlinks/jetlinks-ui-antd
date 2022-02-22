import React, { useState } from "react";
import { List, Form, Input, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import styles from './index.less';
import Service from "../service";

interface Props extends FormComponentProps { }
const SecurityView: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator, getFieldsValue, getFieldValue, validateFields, validateFieldsAndScroll } } = props;

    const service = new Service('user/passwd');
    const [confirmDirty, setConfirmDirty] = useState(false);
    const update = () => {
        validateFieldsAndScroll((err, data) => {
            if (err) return;
            service.update(data).subscribe((resp) => {
                if (resp) {
                    message.success('修改成功');
                }
            }, (error) => {
                // message.error('修改失败!');
            })
        });
    };


    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(!!value);
    }
    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== getFieldValue('newPassword')) {
            callback('两次输入的密码不一致！');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            validateFields(['confirm'], { force: true });
        }
        callback();
    };

    return (
        <div className={styles.baseView}>

            <div className={styles.left}>
                <Form
                    layout="vertical"
                    onSubmit={update}
                >
                    <Form.Item label="旧密码">
                        {getFieldDecorator('oldPassword', {
                        })(
                            <Input.Password />
                        )}
                    </Form.Item>
                    <Form.Item label="新密码" hasFeedback>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新密码!',
                                }, {
                                    validator: validateToNextPassword
                                }
                            ]
                        })(
                            <Input.Password />
                        )}
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入确认密码！'
                                },
                                {
                                    validator: compareToFirstPassword
                                }
                            ]
                        })(
                            <Input.Password onBlur={handleConfirmBlur} />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="danger">修改密码</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    )
}

export default Form.create<Props>()(SecurityView);
