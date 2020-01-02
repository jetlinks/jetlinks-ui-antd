import { Component } from "react";
import React from "react";
import { FormComponentProps } from "antd/es/form";
import { Form, Col, Input, Modal, message } from "antd";
import { TimerConfig } from "./data";
import config from "config/config";

const { Item } = Form;
interface TimerEditorProps extends FormComponentProps {
    closeVisible: () => void;
    config: TimerConfig;
    saveScript: (timerConfig: TimerConfig) => void;
}

interface TimerEditorState {
    data: TimerConfig,
}

const inlineFormItemLayout = {
    labelCol: {
        sm: { span: 4 },
    },
    wrapperCol: {
        sm: { span: 18 },
    },
};

class TimerEditor extends Component<TimerEditorProps, TimerEditorState>{

    state: TimerEditorState = {
        data: {
            cron: '',
            defaultData: '',
        },
    }

    constructor(props: TimerEditorProps) {
        super(props);
        this.state.data = props.config || { cron: '', defaultData: '' };
    }

    handleSaveConfig = () => {
        const { form, saveScript } = this.props;

        form.validateFields((err, fieldValue) => {
            if (err) return;
            saveScript({ ...fieldValue });
        });
    }

    render() {
        const { closeVisible, form } = this.props;
        const { data } = this.state;
        return (
            <Modal
                title="定时器配置编辑"
                visible
                width={840}
                onOk={this.handleSaveConfig}
                onCancel={closeVisible}
                okText='保存'
                cancelText='关闭'
            >
                <Form>
                    <Col>
                        <Item label="CRON" {...inlineFormItemLayout}>
                            {form.getFieldDecorator('cron', {
                                initialValue: data.cron,
                            })(<Input.TextArea rows={4} />)}
                        </Item>
                    </Col>

                    <Col>
                        <Item label="默认数据" {...inlineFormItemLayout}>
                            {form.getFieldDecorator('defaultData', {
                                initialValue: data.defaultData,
                            })(<Input.TextArea rows={4} />)}
                        </Item>
                    </Col>
                </Form>
            </Modal>

        );
    }
}
export default Form.create<TimerEditorProps>()(TimerEditor);
