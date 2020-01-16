import { Component } from "react";
import { Modal, Row, Select, Divider, Form, Switch, Col, message } from "antd";
import React from "react";
import MonacoEditor from "react-monaco-editor";
import { FormComponentProps } from "antd/lib/form";
import { SQLConfig } from "./data";
import config from "config/config";

const { Item } = Form;
interface SQLScriptEditorProps extends FormComponentProps {
    closeVisible: () => void;
    config: SQLConfig;
    saveScript: (sqlConfig: SQLConfig) => void;
}
interface SQLScriptEditorState {
    config: SQLConfig,
}

const inlineFormItemLayout = {
    labelCol: {
        sm: { span: 16 },
    },
    wrapperCol: {
        sm: { span: 4 },
    },
};

class SQLScriptEditor extends Component<SQLScriptEditorProps, SQLScriptEditorState> {

    state: SQLScriptEditorState = {
        config: {},
    }

    constructor(props: SQLScriptEditorProps) {
        super(props);
        this.state = {
            config: props.config || {
                script: '',
                transaction: false,
                stream: false,
                dataSourcedId: '',
            },
        }
    }

    editorDidMountHandle(editor: any) {
        editor.focus();
    }

    onChangeHandle = (value: string) => {
        const { config } = this.state;

        config.script = value;
        this.setState({
            config,
        });
    }

    handleSaveConfig = () => {
        const { form, saveScript } = this.props;
        const { config } = this.state;

        const script = config.script;
        form.validateFields((err, fieldValue) => {
            if (err) return;
            saveScript({ ...fieldValue, script });
        });
    }

    render() {
        const { closeVisible, form } = this.props;
        const { config } = this.state;
        return (
            <Modal
                title="SQL编辑器"
                visible
                width={840}
                onOk={this.handleSaveConfig}
                onCancel={closeVisible}
                okText='保存'
                cancelText='关闭'
            >
                <Form layout="inline">
                    <Row>
                        <Col span={8}>
                            <Item label="数据源" {...inlineFormItemLayout}>
                                {form.getFieldDecorator('dataSourcedId', {
                                    initialValue: config.dataSourcedId,
                                })(
                                    <Select style={{ width: 120 }} onChange={(value: string) => {
                                        config.dataSourcedId = value;
                                        this.setState({ config })
                                    }}>
                                        <Select.Option value="mysql">MySQL</Select.Option>
                                        <Select.Option value="postgresql">PostgreSQL</Select.Option>
                                        <Select.Option value="redis">Redis</Select.Option>
                                    </Select>,
                                )}
                            </Item>
                        </Col>

                        <Col span={8}>
                            <Item label="流式结果" {...inlineFormItemLayout} >
                                {form.getFieldDecorator('stream', {
                                    initialValue: true,
                                })(<Switch checked={config.stream} onChange={(checked) => {
                                    config.stream = checked;
                                    this.setState({ config })
                                }} />)}
                            </Item>
                        </Col>

                        <Col span={8}>
                            <Item label="使用事务" {...inlineFormItemLayout} >
                                {form.getFieldDecorator('transaction', {
                                    initialValue: config.transaction,
                                })(<Switch checked={config.transaction} onChange={(checked) => {
                                    config.transaction = checked;
                                    this.setState({ config })
                                }} />)}
                            </Item>
                        </Col>

                    </Row>

                    <Divider />
                    <Row>
                        <MonacoEditor
                            // width="800"
                            height="400"
                            language='sql'
                            theme='vs'
                            value={config.script}
                            options={{
                                selectOnLineNumbers: true,
                            }}
                            onChange={this.onChangeHandle}
                            editorDidMount={this.editorDidMountHandle}
                        />,
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create<SQLScriptEditorProps>()(SQLScriptEditor);
