import { Form, Modal, Input } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useState } from "react";
import { UserItem } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<UserItem>;
}

interface State {
    confirmDirty: boolean,
    defaultPassword: string,

}
const Save: React.FC<Props> = props => {

    //随机一个默认密码
    // const RandomPassword = (Math.random() * 20).toString();

    const initState: State = {
        confirmDirty: false,
        defaultPassword: '123456' //默认密码，不会被保存
    };
    const [confirmDirty, setConfirmDirty] = useState(initState.confirmDirty);

    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            if (fileValue.password === initState.defaultPassword) {
                fileValue.password = undefined;
                fileValue.confirm = undefined;
            }
            fileValue.id = props.data.id;

            if (!props.data.id) {
                fileValue.status = 0;
            }
            props.save(fileValue);
        });
    };

    const handleConfirmBlur = (event: any) => {
        const value = event.target.value;
        setConfirmDirty(confirmDirty || !!value);
    };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('您输入的两个密码不一致！');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    console.log(initState.defaultPassword, '12332');
    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}用户`}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { submitData() }}
            onCancel={() => props.close()}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

                <Form.Item
                    key="name"
                    label="姓名"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入姓名' }],
                        initialValue: props.data.name
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                {
                    props.data.id ? (<Form.Item
                        key="username"
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            initialValue: props.data.username,
                        })(<Input placeholder="请输入" disabled={true} />)}
                    </Form.Item>) : (<Form.Item
                        key="username"
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名' }],
                            initialValue: props.data.username,
                        })(<Input placeholder="请输入" />)}
                    </Form.Item>)
                }
                <Form.Item
                    key="password"
                    label="密码"
                >
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入密码' },
                            {
                                validator: validateToNextPassword,
                            }
                        ],
                        initialValue: props.data.id ? initState.defaultPassword : null
                    })(<Input.Password visibilityToggle={false} />)}
                </Form.Item>
                <Form.Item
                    key="confirm"
                    label="确认密码"
                >
                    {getFieldDecorator('confirm', {
                        rules: [
                            { required: true, message: '请输入重复密码' },
                            {
                                validator: compareToFirstPassword,
                            }
                        ],
                        initialValue: props.data.id ? initState.defaultPassword : null
                    })(
                        <Input.Password
                            visibilityToggle={false}
                            onBlur={(event) => {
                                event.persist();
                                handleConfirmBlur(event)
                            }}
                        />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default Form.create<Props>()(Save);
